<div align="center">
<img src="logo.png" height="90px" width="auto" /> 
<h2>
    <em>Currículum Vitae (CV)</em> minimalista maquetado para web y pdf
</h2>
<p>
Esquema del JSON de CV de <a href="https://jsonresume.org/schema/">jsonresume.org</a>
</p>


<p>
Basado en el diseño de <a href="https://github.com/BartoszJarocki/cv">Bartosz Jarocki</a>

</p>

</div>

<div align="center">
    <a href="#🚀-empezar">
        Empezar
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#🧞-comandos">
        Comandos
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="#🔑-licencia">
        Licencia
    </a>
    <span>&nbsp;✦&nbsp;</span>
    <a href="https://statick88.github.io">
        Personal
    </a>
   
</div>

<p></p>

<div align="center">

![Astro Badge](https://img.shields.io/badge/Astro-BC52EE?logo=astro&logoColor=fff&style=flat)
![GitHub stars](https://img.shields.io/github/stars/statick88/statick88.github.io)
![GitHub issues](https://img.shields.io/github/issues/statick88/statick88.github.io)
![GitHub forks](https://img.shields.io/github/forks/statick88/statick88.github.io)
![GitHub PRs](https://img.shields.io/github/issues-pr/statick88/statick88.github.io)

</div>

<img src="portada.png"></img>

## 🛠️ Stack

- [**Astro**](https://astro.build/) - El framework web de la nueva época.
- [**Typescript**](https://www.typescriptlang.org/) - JavaScript con sintaxis de tipado.
- [**Firebase**](https://firebase.google.com/) - Autenticación y almacenamiento en la nube.
- [**Ninja Keys**](https://github.com/ssleptsov/ninja-keys) - Menu desplegable con atajos de teclado hecho en puro Javascript.
- [**Vitest**](https://vitest.dev/) - Framework de testing moderno.


## 🚀 Empezar

### 1. Clona este [repositorio](https://github.com/statick88/statick88.github.io)
Este proyecto está listo para ser desplegado. Simplemente clona el repositorio y usa tus propias dependencias.

- Yo uso [pnpm](https://pnpm.io/installation) como gestor de dependencias y empaquetador.

```bash
# Clona el repositorio
git clone [https://github.com/statick88/statick88.github.io.git](https://github.com/statick88/statick88.github.io.git)
cd statick88.github.io

# Instala las dependencias
corepack enable
pnpm install
```

### 2. Configuración de Variables de Entorno

Este proyecto incluye un sistema de administración para gestionar capacitaciones y certificaciones. Para configurarlo:

1. **Crear archivo `.env`**
   ```bash
   # Copia el archivo de ejemplo
   cp .env.example .env
   
   # Edita el archivo .env con tus credenciales de Firebase
   ```
   
2. **Configurar credenciales de Firebase**
   ```bash
   # Variables requeridas en .env
   PUBLIC_FIREBASE_API_KEY=tu_api_key
   PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
   PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
   PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
   PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
   PUBLIC_FIREBASE_APP_ID=tu_app_id
   PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id
   ```

3. **Configurar Firebase Console**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto o usa uno existente
   
4. **Configurar Authentication**
   - Habilita el método "Email/Password"
   - Crea al menos un usuario administrador
   
5. **Configurar Firestore Database**
   - Crea una base de datos Firestore
   - En modo de producción, agrega estas reglas de seguridad:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /trainings/{trainingId} {
         allow read: if resource.data.verified == true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
   
6. **Configurar Storage**
   - Habilita Firebase Storage
   - Agrega estas reglas de seguridad:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /trainings/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

### 3. Cómo Agregar Certificados

Una vez configurado Firebase, puedes agregar tus certificados al portafolio:

#### **3.1. Acceso al Panel de Administración**
1. Inicia sesión en `/admin/login` con tus credenciales de administrador
2. Serás redirigido automáticamente al dashboard en `/admin/dashboard`

#### **3.2. Subir Nuevo Certificado**
En el panel de administración:
1. **Título**: Nombre del curso o certificación (ej: "Certificación AWS Cloud Practitioner")
2. **Fecha de obtención**: Cuándo recibiste el certificado
3. **Descripción**: Breve descripción del curso (opcional)
4. **Archivo PDF**: Sube el certificado en formato PDF (máximo 10MB)
5. **Institución**: Nombre de la organización que emitió el certificado (ej: "AWS", "Coursera")

#### **3.3. Proceso de Verificación**
- Los certificados subidos aparecen como **"Pendientes de verificación"**
- Solo el administrador puede verificar los certificados válidos
- Los certificados **verificados** aparecen automáticamente en el portafolio público
- Los certificados **no verificados** solo son visibles en el panel admin

#### **3.4. Gestión de Certificados**
En el dashboard puedes:
- **Verificar**: Marcar un certificado como válido para mostrarlo públicamente
- **Eliminar**: Borrar certificados (se elimina el PDF y los metadatos)
- **Descargar**: Ver el PDF del certificado en una nueva pestaña

#### **3.5. Visualización en el Portafolio**
- Los certificados verificados aparecen en la sección "Capacitaciones" del portafolio
- Se ordenan por fecha (más recientes primero)
- Cada tarjeta muestra: título, institución, fecha y enlace al PDF
- Solo los usuarios autenticados pueden acceder al panel de administración

#### **3.6. Recomendaciones**
- **Formato PDF**: Asegúrate de que los certificados sean PDFs claros y legibles
- **Tamaño**: Mantén los archivos por debajo de 10MB para mejor rendimiento
- **Consistencia**: Usa nombres descriptivos para identificar fácilmente cada certificado
- **Seguridad**: Solo verifica certificados que puedas confirmar como auténticos

### 4. Testing

El proyecto incluye tests para garantizar la calidad del sistema:

```bash
# Ejecutar tests en modo observación
npm run test

# Ejecutar tests una vez
npm run test:run

# Ver interfaz de tests
npm run test:ui
```

### 5. Despliegue

Para producción, configura las variables de entorno en tu plataforma de hosting:

```bash
# Variables de entorno recomendadas
FIREBASE_API_KEY=tu_api_key
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_APP_ID=tu_app_id
```
