import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

/**
 * Import solvents from JSON file into Firestore
 */
export async function importSolventsFromFile(file) {
  const text = await file.text();
  const json = JSON.parse(text);

  if (!json?.data?.solvents || !Array.isArray(json.data.solvents)) {
    throw new Error("Invalid solvents JSON format");
  }

  const solvents = json.data.solvents;

  for (const solvent of solvents) {
    if (!solvent.id || !solvent.name) {
      console.warn("Skipping invalid solvent:", solvent);
      continue;
    }

    // 🔑 use solvent.id as Firestore document ID
    const ref = doc(collection(db, "solvents"), solvent.id);

    await setDoc(ref, {
      ...solvent,
      importedAt: new Date().toISOString()
    });
  }

  return solvents.length;
}
