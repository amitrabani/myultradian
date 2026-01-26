# Firebase Integration Guide for myultradian

This guide outlines the steps to integrate Firebase into your React + Vite + TypeScript application.

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the setup wizard.
3. Once the project is ready, click the **Web** icon (`</>`) to add a web app.
4. Register your app (e.g., "myultradian-web").
5. Copy the **firebaseConfig** object shown in the setup screen. You'll need this shortly.

## 2. Install Firebase SDK

Run the following command in your terminal:

```bash
npm install firebase
```

## 3. Configure Environment Variables

Vite uses `.env` files for environment variables. Variables exposed to the client must start with `VITE_`.

1. Create a file named `.env.local` in the root of your project (same level as `package.json`).
2. Add your Firebase config values like this:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Note:** Do not commit `.env.local` to Git.

## 4. Initialize Firebase

Create a new file `src/lib/firebase.ts` to initialize the app.

```typescript
// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
```

## 5. Usage Examples

### Authentication (Sign In with Google)

First, enable Google Auth in the Firebase Console -> Authentication -> Sign-in method.

```tsx
// src/features/auth/Login.tsx (example)
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export const Login = () => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User:", result.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <button onClick={handleLogin} className="btn btn-primary">
      Sign in with Google
    </button>
  );
};
```

### Firestore (Read/Write)

Enable **Firestore Database** in the Firebase Console and start in **Test Mode** (for development).

```tsx
// Example usage
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const addRecord = async () => {
  try {
    const docRef = await addDoc(collection(db, "records"), {
      date: new Date(),
      value: 100
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
```

## 6. Next Steps

*   **State Management**: Integrate Firebase Auth state with **Zustand**.
*   **Security Rules**: Update Firestore/Storage rules in the Firebase Console before going production.
