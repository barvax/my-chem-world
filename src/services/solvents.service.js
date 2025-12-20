import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function getSolvents() {
  const snap = await getDocs(collection(db, "solvents"));

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
