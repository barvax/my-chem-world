import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

const COLLECTION = "ingredientFamilies";

/* ================================
   GET ALL FAMILIES
================================ */
export async function getIngredientFamilies() {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/* ================================
   GET SINGLE FAMILY
================================ */
export async function getIngredientFamilyById(id) {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data()
  };
}

/* ================================
   CREATE FAMILY
================================ */
export async function createIngredientFamily(data) {
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const ref = await addDoc(collection(db, COLLECTION), payload);
  return ref.id;
}

/* ================================
   UPDATE FAMILY
================================ */
export async function updateIngredientFamily(id, data) {
  const ref = doc(db, COLLECTION, id);

  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp()
  });
}

/* ================================
   DELETE FAMILY  ✅ זה היה חסר
================================ */
export async function deleteIngredientFamily(id) {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
