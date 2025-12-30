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

### 2. Configuración de Firebase

Este proyecto incluye un sistema de administración para gestionar capacitaciones y certificaciones. Para usarlo:

1. **Crear proyecto en Firebase Console**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente

2. **Configurar Authentication**
   - Habilita el método de autenticación "Email/Password"
   - Agrega al menos un usuario administrador

3. **Configurar Firestore Database**
   - Crea una base de datos Firestore
   - En modo de producción, reglas de seguridad:
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

4. **Configurar Storage**
   - Habilita Firebase Storage
   - Reglas de seguridad:
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

5. **Actualizar archivo `src/firebase.js`**
   ```javascript
   const firebaseConfig = {
     apiKey: "TU_API_KEY",
     authDomain: "TU_PROJECT_ID.firebaseapp.com",
     projectId: "TU_PROJECT_ID",
     storageBucket: "TU_PROJECT_ID.appspot.com",
     messagingSenderId: "TU_SENDER_ID",
     appId: "TU_APP_ID"
   };
   ```

### 3. Uso del Sistema de Administración

- Accede a `/admin/login` para iniciar sesión
- En el dashboard (`/admin/dashboard`) puedes:
  - Subir nuevos certificados en PDF
  - Verificar capacitaciones
  - Eliminar certificados
- Las capacitaciones verificadas aparecerán automáticamente en la sección de capacitaciones del portafolio

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
