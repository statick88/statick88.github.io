# Environment Variables Setup

Copy this configuration to your local `.env` file with your actual Firebase credentials:

```bash
# Create .env file in project root
cp .env.example .env

# Edit .env with your Firebase credentials
PUBLIC_FIREBASE_API_KEY=your_api_key_here
PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
PUBLIC_FIREBASE_APP_ID=your_app_id
PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Firebase Setup Steps:

1. Create Firebase Project at https://console.firebase.google.com
2. Enable Authentication → Email/Password
3. Create Firestore Database with production rules
4. Enable Storage with security rules
5. Get your configuration from Project Settings → Web apps

## Security Rules:

**Firestore Rules:**
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

**Storage Rules:**
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