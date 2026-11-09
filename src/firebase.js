import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAIyuBwAuiZX1b4Y7sVxkgg5QbikR8WsYI",
  authDomain: "my-portfoilio-5509.firebaseapp.com",
  projectId: "my-portfoilio-5509",
  storageBucket: "my-portfoilio-5509.firebasestorage.app",
  messagingSenderId: "428890013268",
  appId: "1:428890013268:web:3d4128db9147e81194b7c1",
  measurementId: "G-7HQBLK9FD0"
};

export function initFirebase() {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported) {
          getAnalytics(app);
        }
      }).catch(() => {});
    }
    return app;
  } catch (e) {
    // Non-critical analytics
    return null;
  }
}

