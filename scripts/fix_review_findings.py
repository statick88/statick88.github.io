#!/usr/bin/env python3
"""
fix_review_findings.py — corrección acotada de los hallazgos R2-1, R2-2, R3-001 y
R3-002 (todos CRITICAL, todos introducidos por este candidato).

  R2-1  practice.toolNames se cruzaba contra los nombres de proyecto con
        coincidencia exacta, así que 3 de 4 herramientas nunca resolvían.
        Fix: el generador resuelve contra la fuente canónica (cv-data.ts) y
        contra el espejo JS, en unión y sin distinguir mayúsculas.
  R2-2  practice.engagements llevaba textos de un solo idioma: el CV en inglés
  R3-002  publicaba párrafos en español. Fix: entradas bilingües + selección por
        idioma en el generador (igual que servicios, herramientas y formación).
  R3-001 profileData.consultor en cvData.js heredaba id='hacker' y
        pdf='/cv-hacker-es.pdf'. Fix: id y pdf explícitos + test de deriva.

El payload `practice` se emite desde un único diccionario hacia TS, JS y YAML,
de modo que los tres espejos siguen siendo idénticos por construcción.
"""

import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent

ENGAGEMENTS = [
    {
        "period": "Oct 2026",
        "sector": {
            "es": "E-commerce con cliente 3D (nombre bajo acuerdo de confidencialidad)",
            "en": "E-commerce with a 3D client (name withheld under a confidentiality agreement)",
        },
        "scope": {
            "es": "Pentest autorizado en produccion, con carta de autorizacion firmada y ventana de 2 dias",
            "en": "Authorized production pentest, with a signed authorization letter and a 2-day window",
        },
        "outcome": {
            "es": "109 subdominios inventariados, matriz de 15 CVE verificadas, 6 cadenas de adversario y plan de remediacion",
            "en": "109 subdomains inventoried, a matrix of 15 verified CVEs, 6 adversary chains, and a remediation plan",
        },
    },
    {
        "period": "Jul 2026",
        "sector": {
            "es": "Aplicacion web con gestion de agendas",
            "en": "Web application with scheduling management",
        },
        "scope": {
            "es": "Prueba de seguridad sobre hallazgos funcionales, previa autorizacion del cliente",
            "en": "Security test over functional findings, with the client's prior authorization",
        },
        "outcome": {
            "es": "Hallazgos adjuntos y priorizados con severidad y remediacion",
            "en": "Findings attached and prioritized with severity and remediation",
        },
    },
    {
        "period": "Sep 2025",
        "sector": {
            "es": "Proyecto web (nombre bajo acuerdo de confidencialidad)",
            "en": "Web project (name withheld under a confidentiality agreement)",
        },
        "scope": {
            "es": "Carta de autorizacion previa, con alcance y ventana acordados antes de ejecutar",
            "en": "Prior authorization letter, with scope and window agreed before execution",
        },
        "outcome": {
            "es": "Ejecucion dentro del alcance firmado, sin tocar activos de terceros",
            "en": "Execution within the signed scope, without touching third-party assets",
        },
    },
]


def need(cond: bool, msg: str) -> None:
    if not cond:
        raise SystemExit(f"ANCLA NO ENCONTRADA: {msg}")


def load_practice() -> dict:
    t = (ROOT / "src/data/cv-data.ts").read_text(encoding="utf-8")
    m = re.search(r"export const practice = (\{.*?\n\}) as const", t, re.S)
    need(m is not None, "bloque practice en cv-data.ts")
    return json.loads(m.group(1))


def patch_ts() -> None:
    p = ROOT / "src/data/cv-data.ts"
    t = p.read_text(encoding="utf-8")
    practice = load_practice()
    practice["engagements"] = ENGAGEMENTS
    nuevo = json.dumps(practice, ensure_ascii=False, indent=2)
    t = re.sub(
        r"export const practice = \{.*?\n\} as const",
        "export const practice = " + nuevo + " as const",
        t,
        count=1,
        flags=re.S,
    )
    p.write_text(t, encoding="utf-8")
    print("cv-data.ts: engagements bilingües")


def patch_js() -> None:
    p = ROOT / "src/data/cvData.js"
    t = p.read_text(encoding="utf-8")
    practice = load_practice()
    practice["engagements"] = ENGAGEMENTS
    nuevo = json.dumps(practice, ensure_ascii=False, indent=2)
    t = re.sub(
        r"(  practice: )\{.*?\n  \},",
        lambda m: m.group(1) + nuevo + ",",
        t,
        count=1,
        flags=re.S,
    )
    # R3-001: id y pdf propios del perfil consultor
    m = re.search(r"profileData\.consultor = \{.*?\n\};", t, re.S)
    need(m is not None, "profileData.consultor en cvData.js")
    bloque = m.group(0)
    if "id: 'consultor'" not in bloque:
        bloque = bloque.replace(
            "profileData.consultor = {",
            "profileData.consultor = {\n  id: 'consultor',",
            1,
        )
    if "pdf:" not in bloque:
        bloque = bloque.replace(
            "  practice: true,", "  pdf: '/cv-consultor-es.pdf',\n  practice: true,", 1
        )
    t = t[: m.start()] + bloque + t[m.end() :]
    p.write_text(t, encoding="utf-8")
    print("cvData.js: engagements bilingües + id/pdf del perfil consultor")


def patch_yaml() -> None:
    p = ROOT / "src/data/cv-data.yaml"
    t = p.read_text(encoding="utf-8")
    practice = load_practice()
    practice["engagements"] = ENGAGEMENTS
    inline = json.dumps(practice, ensure_ascii=False)
    t = re.sub(r"(?m)^practice:\n  \{.*\}$", "practice:\n  " + inline, t, count=1)
    p.write_text(t, encoding="utf-8")
    print("cv-data.yaml: engagements bilingües")


GENERATOR_OLD_TOOLS = """    const tools = (cvData.projects || []).filter((p) => (practice.toolNames || []).includes(p.name));"""
GENERATOR_NEW_TOOLS = """    // Resolve against the canonical projects and the JS mirror, case-insensitively:
    // the two mirrors carry the same tools with different display names, and an
    // exact match silently dropped three of the four declared own tools.
    const wantedTools = (practice.toolNames || []).map((name) => String(name).toLowerCase());
    const allProjects = [...(canonicalProjects || []), ...(cvData.projects || [])];
    const tools = allProjects.filter(
      (p, index) =>
        wantedTools.includes(String(p.name).toLowerCase()) &&
        allProjects.findIndex((other) => other.name === p.name) === index,
    );"""

GENERATOR_OLD_ENG = """    for (const e of eng) {
      markdown += `- **${e.period} — ${e.sector}**: ${e.scope}. ${e.outcome}\\n`;
    }"""
GENERATOR_NEW_ENG = """    for (const e of eng) {
      const sector = (e.sector && (e.sector[lang] || e.sector.es)) || e.sector || '';
      const scope = (e.scope && (e.scope[lang] || e.scope.es)) || e.scope || '';
      const outcome = (e.outcome && (e.outcome[lang] || e.outcome.es)) || e.outcome || '';
      markdown += `- **${e.period} — ${sector}**: ${scope}. ${outcome}\\n`;
    }"""


def patch_generator() -> None:
    p = ROOT / "generate-profile-cvs.js"
    t = p.read_text(encoding="utf-8")
    if "canonicalProjects" not in t:
        need("import { cvData, profileData }" in t, "import del generador")
        t = t.replace(
            "import { cvData, profileData } from './src/data/cvData.js';",
            "import { cvData, profileData } from './src/data/cvData.js';\n"
            "import { projects as canonicalProjects } from './src/data/cv-data';",
            1,
        )
    if GENERATOR_OLD_TOOLS in t:
        t = t.replace(GENERATOR_OLD_TOOLS, GENERATOR_NEW_TOOLS, 1)
    elif "canonicalProjects" not in t.split("const tools =")[1][:400]:
        raise SystemExit("no se encontro el filtro de herramientas")
    if GENERATOR_OLD_ENG in t:
        t = t.replace(GENERATOR_OLD_ENG, GENERATOR_NEW_ENG, 1)
    p.write_text(t, encoding="utf-8")
    print(
        "generate-profile-cvs.js: herramientas contra la fuente canonica + encargos con idioma"
    )


DRIFT_TEST = """
  it('carries the same consultant profile record everywhere', () => {
    const ts = JSON.parse(JSON.stringify((profileData as Record<string, { id?: string; pdf?: string; label?: unknown }>).consultor))
    const js = JSON.parse(JSON.stringify((cvData as unknown as { profileData?: Record<string, unknown> }).profileData?.consultor))
    expect(ts.id, 'consultor id in cv-data.ts').toBe('consultor')
    expect(js.id, 'consultor id in cvData.js').toBe(ts.id)
    expect(js.pdf, 'consultor pdf in cvData.js').toBe(ts.pdf)
    expect(js.label, 'consultor label in cvData.js').toEqual(ts.label)
  })
"""


def patch_drift_test() -> None:
    p = ROOT / "src/__tests__/design/cv-data-drift.test.ts"
    t = p.read_text(encoding="utf-8")
    if "consultant profile record" in t:
        return
    t = t.replace(
        "import { work, practice } from '@/data/cv-data'",
        "import { work, practice, profileData } from '@/data/cv-data'",
        1,
    )
    idx = t.rstrip().rfind("})")
    t = t[:idx] + DRIFT_TEST + t[idx:]
    p.write_text(t, encoding="utf-8")
    print("cv-data-drift.test.ts: test de deriva del perfil consultor")


def main() -> int:
    patch_ts()
    patch_js()
    patch_yaml()
    patch_generator()
    patch_drift_test()
    print("fix_review_findings.py: correccion aplicada")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
