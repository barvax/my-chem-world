import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function getIngredients() {
  const snap = await getDocs(collection(db, "ingredients"));
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function deleteIngredient(ingredientId) {
  await deleteDoc(doc(db, "ingredients", ingredientId));
}
