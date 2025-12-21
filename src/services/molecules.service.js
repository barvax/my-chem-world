import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function getMolecules() {
  const snap = await getDocs(collection(db, "molecules"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteMolecule(moleculeDocId) {
  await deleteDoc(doc(db, "molecules", moleculeDocId));
}
