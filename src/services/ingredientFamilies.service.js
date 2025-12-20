import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/firebase";

/* Load all families */
export async function getIngredientFamilies() {
  const snap = await getDocs(collection(db, "ingredientFamilies"));
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/* Create family with unique worldId */
export async function createIngredientFamily(data) {
  // prevent duplicate worldId
  const q = query(
    collection(db, "ingredientFamilies"),
    where("worldId", "==", data.worldId)
  );
  const existing = await getDocs(q);
  if (!existing.empty) {
    throw new Error("Family with this worldId already exists");
  }

  await addDoc(collection(db, "ingredientFamilies"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}
