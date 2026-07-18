import { initializeApp, getApps } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";

// Demo/local fallback only: the app uses Firebase when the web config is present.
const STORAGE_KEY = "mindcare-db";
const SESSION_KEY = "mindcare-session";
const defaultUsers = [];

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

function normalizeAccount(account) {
  if (!account) {
    return null;
  }

  const firstName = String(account.firstName || "").trim();
  const lastName = String(account.lastName || "").trim();
  const nameParts = String(account.name || "").trim().split(/\s+/).filter(Boolean);
  const resolvedFirstName = firstName || nameParts[0] || "";
  const resolvedLastName = lastName || nameParts.slice(1).join(" ") || "";
  const resolvedName = `${resolvedFirstName} ${resolvedLastName}`.trim();

  return {
    id: account.id || account.uid || `user-${Date.now()}`,
    name: resolvedName,
    firstName: resolvedFirstName,
    lastName: resolvedLastName,
    email: String(account.email || "").toLowerCase(),
    password: account.password || "",
    role: account.role || "user",
    emergencyContacts: Array.isArray(account.emergencyContacts) ? account.emergencyContacts : [],
  };
}

function readDb() {
  // This branch is intentionally limited to demo/local runs.
  const existing = localStorage.getItem(STORAGE_KEY);

  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return [];
  }

  try {
    return JSON.parse(existing);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return [];
  }
}

function writeDb(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function emitSessionAccountUpdate(account) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent("mindcare-account-updated", {
      detail: account,
    }),
  );
}

function getFirebaseState() {
  if (typeof window === "undefined") {
    return { enabled: false };
  }

  const hasRequiredConfig = Object.values(firebaseConfig).every(
    (val) => val && !String(val).startsWith("your_") && val !== "your_project_id"
  );

  if (!hasRequiredConfig) {
    return { enabled: false };
  }

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

  return {
    enabled: true,
    app,
    auth: getAuth(app),
    db: getFirestore(app),
  };
}

function writeFallbackUser(user) {
  const users = ensureMockBackend();
  const filteredUsers = users.filter((item) => item.id !== user.id);
  filteredUsers.push(user);
  writeDb(filteredUsers);
}

export function ensureMockBackend() {
  // Keep the fallback intentionally simple for local/demo usage.
  return readDb();
}

export function getSessionAccount() {
  const rawAccount = localStorage.getItem(SESSION_KEY);

  if (!rawAccount) {
    return null;
  }

  try {
    return normalizeAccount(JSON.parse(rawAccount));
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function setSessionAccount(account) {
  const normalizedAccount = normalizeAccount(account);

  if (!normalizedAccount) {
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(normalizedAccount));
  emitSessionAccountUpdate(normalizedAccount);
}

export function clearSessionAccount() {
  const firebaseState = getFirebaseState();

  if (firebaseState.enabled && firebaseState.auth?.currentUser) {
    signOut(firebaseState.auth).catch(() => {});
  }

  localStorage.removeItem(SESSION_KEY);
  emitSessionAccountUpdate(null);
}

export async function loginAccount(email, password) {
  const firebaseState = getFirebaseState();

  if (firebaseState.enabled) {
    try {
      const credentials = await signInWithEmailAndPassword(
        firebaseState.auth,
        String(email || "").trim().toLowerCase(),
        password,
      );
      const userRef = doc(firebaseState.db, "users", credentials.user.uid);
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        return null;
      }

      const account = normalizeAccount(snapshot.data());
      setSessionAccount(account);
      return account;
    } catch {
      return null;
    }
  }

  const users = ensureMockBackend();
  const account = users.find(
    (item) => item.email.toLowerCase() === String(email || "").trim().toLowerCase() && item.password === password,
  );

  if (!account) {
    return null;
  }

  const safeAccount = normalizeAccount(account);
  setSessionAccount(safeAccount);
  return safeAccount;
}

export async function registerAccount(payload) {
  const normalizedPayload = normalizeAccount({
    ...payload,
    email: String(payload.email || "").trim().toLowerCase(),
    name: `${String(payload.firstName || "").trim()} ${String(payload.lastName || "").trim()}`.trim(),
    emergencyContacts: payload.emergencyContacts || [],
  });

  if (!normalizedPayload) {
    return { error: "Date lipsă." };
  }

  const firebaseState = getFirebaseState();

  if (firebaseState.enabled) {
    try {
      const credentials = await createUserWithEmailAndPassword(
        firebaseState.auth,
        normalizedPayload.email,
        normalizedPayload.password,
      );

      const firebaseAccount = {
        ...normalizedPayload,
        id: credentials.user.uid,
        email: normalizedPayload.email,
      };

      await setDoc(doc(firebaseState.db, "users", firebaseAccount.id), firebaseAccount);
      writeFallbackUser(firebaseAccount);
      setSessionAccount(firebaseAccount);
      return firebaseAccount;
    } catch (error) {
      const message = error?.code === "auth/email-already-in-use"
        ? "Există deja un cont cu acest email."
        : "Nu s-a putut crea contul.";
      return { error: message };
    }
  }

  const users = ensureMockBackend();
  const existing = users.find((item) => item.email.toLowerCase() === normalizedPayload.email.toLowerCase());

  if (existing) {
    return { error: "Există deja un cont cu acest email." };
  }

  const newAccount = {
    ...normalizedPayload,
    id: `user-${Date.now()}`,
  };

  users.push(newAccount);
  writeDb(users);
  setSessionAccount(newAccount);
  return newAccount;
}

export async function updateAccount(account) {
  const normalizedAccount = normalizeAccount(account);
  const firebaseState = getFirebaseState();

  if (firebaseState.enabled && normalizedAccount) {
    await setDoc(doc(firebaseState.db, "users", normalizedAccount.id), normalizedAccount, { merge: true });
    writeFallbackUser(normalizedAccount);
    setSessionAccount(normalizedAccount);
    return normalizedAccount;
  }

  if (!normalizedAccount) {
    return null;
  }

  const users = ensureMockBackend();
  const filtered = users.filter((item) => item.id !== normalizedAccount.id);
  filtered.push(normalizedAccount);
  writeDb(filtered);
  setSessionAccount(normalizedAccount);
  return normalizedAccount;
}

export async function deleteAccount(accountId) {
  const firebaseState = getFirebaseState();

  if (firebaseState.enabled && firebaseState.auth?.currentUser?.uid === accountId) {
    await deleteUser(firebaseState.auth.currentUser);
  }

  if (firebaseState.enabled) {
    const userRef = doc(firebaseState.db, "users", accountId);
    await deleteDoc(userRef).catch(() => {});
  }

  const users = ensureMockBackend();
  const filtered = users.filter((item) => item.id !== accountId);
  writeDb(filtered);
}

export async function getAccountByEmail(email) {
  const firebaseState = getFirebaseState();

  if (firebaseState.enabled) {
    const usersRef = collection(firebaseState.db, "users");
    const q = query(usersRef, where("email", "==", String(email || "").trim().toLowerCase()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const account = normalizeAccount(snapshot.docs[0].data());
    return account;
  }

  const users = ensureMockBackend();
  return users.find((item) => item.email.toLowerCase() === String(email || "").trim().toLowerCase()) || null;
}

export function getAccountById(accountId) {
  const users = ensureMockBackend();
  return users.find((item) => item.id === accountId) || null;
}
