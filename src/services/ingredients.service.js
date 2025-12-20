import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function getIngredients() {
  const snap = await getDocs(collection(db, "ingredients"));
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
