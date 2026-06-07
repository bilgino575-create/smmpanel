// ============================================================
// KRIYAVA — Firebase Auth (Google sign-in)
// Config comes from NEXT_PUBLIC_FIREBASE_* env vars.
// If not configured, isFirebaseConfigured() returns false and
// the login page asks users to continue with email auth.
// ============================================================
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  type Auth,
} from "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function getFirebaseAuth(): Auth | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = getApps().length ? getApps()[0] : initializeApp(config);
    auth = getAuth(app);
  }
  return auth;
}

export interface GoogleResult {
  email: string;
  name: string;
  uid: string;
  idToken: string;
  photoURL?: string;
}

/** Opens the real Google account-picker popup. Throws if not configured or cancelled. */
export async function signInWithGoogle(): Promise<GoogleResult> {
  const a = getFirebaseAuth();
  if (!a) throw new Error("Firebase not configured");
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const cred = await signInWithPopup(a, provider);
  const idToken = await cred.user.getIdToken();
  return {
    email: cred.user.email || `${cred.user.uid}@google.user`,
    name: cred.user.displayName || "Google User",
    uid: cred.user.uid,
    idToken,
    photoURL: cred.user.photoURL || undefined,
  };
}
