import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Tempel config dari Firebase Console > Project settings > Your apps > Web app
const cfg = {
  apiKey: "AIzaSyD6P3AgAnelab45qS3cjbtsHgNxYRu-i28M",
  authDomain: "undangan-endah-fahmi.firebaseapp.com",
  projectId: "undangan-endah-fahmi",
  storageBucket: "undangan-endah-fahmi.firebasestorage.app",
  messagingSenderId: "118773854036",
  appId: "1:118773854036:web:ea6c452ecc11bbf97b22c1"
};
export const ready = cfg.apiKey !== "ISI_API_KEY";
let db, auth;
if (ready) { const app = initializeApp(cfg); db = getFirestore(app); auth = getAuth(app); }

// Mode demo (Firebase belum diisi): data disimpan di localStorage browser
const subs = {};
const ls = c => { try { return JSON.parse(localStorage.getItem(c)) || []; } catch (e) { return []; } };
const fire = c => (subs[c] || []).forEach(f => f(ls(c)));

export const fmt = v => (v && v.toDate ? v.toDate() : new Date(v || Date.now()))
  .toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export function add(col, data) {
  if (!ready) { const a = ls(col); a.unshift({ ...data, id: String(Date.now()), createdAt: Date.now() }); localStorage.setItem(col, JSON.stringify(a)); fire(col); return Promise.resolve(); }
  return addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() });
}
export function watch(col, cb) {
  if (!ready) { (subs[col] = subs[col] || []).push(cb); cb(ls(col)); return; }
  onSnapshot(query(collection(db, col), orderBy("createdAt", "desc"), limit(500)), s => cb(s.docs.map(d => ({ id: d.id, ...d.data() }))));
}
export function remove(col, id) {
  if (!ready) { localStorage.setItem(col, JSON.stringify(ls(col).filter(x => x.id !== id))); fire(col); return Promise.resolve(); }
  return deleteDoc(doc(db, col, id));
}
export const login = (e, p) => signInWithEmailAndPassword(auth, e, p);
export const logout = () => (ready ? signOut(auth) : Promise.resolve());
export const onUser = cb => (ready ? onAuthStateChanged(auth, cb) : cb({ email: "mode-demo" }));
