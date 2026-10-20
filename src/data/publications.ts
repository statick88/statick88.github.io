/**
 * src/data/publications.ts — Academic production
 *
 * Peer-reviewed work and theses. Kept as data (instead of inline JSX) so the
 * panel, the structured export and the markdown CV all read the same source.
 */

export interface Publication {
  id: string
  title: string
  journal: string
  year: string
  author: string
  pages: string
  citations: number
  type: 'article' | 'thesis'
  url: string
  tags: string[]
  description: string
}

export const publications: Publication[] = [
  {
    id: 'paper-tdah',
    title:
      'Evaluación de Deep Learning para detectar TDAH y síndrome de Asperger en estudiantes universitarios',
    journal: 'Revista de Investigación Multidisiplinaria, Iberoamericana',
    year: '2024',
    author: 'Diego Medardo Saavedra García',
    pages: '1-10',
    citations: 1,
    type: 'article',
    url: 'https://scholar.google.com/citations?user=getKs_4AAAAJ&hl=es',
    tags: ['Deep Learning', 'TDAH', 'Asperger', 'Educación'],
    description:
      'Revisión de literatura sobre el uso de modelos de Deep Learning para la detección de TDAH y síndrome de Asperger en entornos educativos universitarios. Analiza metodologías, enfoques teóricos y resultados de estudios previos.',
  },
  {
    id: 'thesis-atencion',
    title:
      'Modelo para detectar la atención de los estudiantes en un salón de clases basado en redes neuronales convolucionales',
    journal:
      'Trabajo de Titulación — Magíster en Cs. y Tec. de la Computación, UTPL',
    year: '2021',
    author: 'Diego Medardo Saavedra García',
    pages: '',
    citations: 0,
    type: 'thesis',
    url: 'https://dspace.utpl.edu.ec/handle/20.500.11962/27635',
    tags: ['RNC', 'Visión Artificial', 'Atención', 'Educación'],
    description:
      'Sistema de monitoreo de atención estudiantil usando Redes Neuronales Convolucionales (RNC) y visión artificial. Aprendizaje >90%, precisión de detección de atención 99.64%. Metodología SCRUM, 3000+ secuencias de video.',
  },
]
