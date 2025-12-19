import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function importMoleculesFromFile(file) {
  const text = await file.text();
  const json = JSON.parse(text);

  if (!Array.isArray(json?.data?.molecules)) {
    throw new Error("Invalid molecules JSON");
  }

  for (const m of json.data.molecules) {
    if (!m.id || !m.name) continue;

    await setDoc(
      doc(collection(db, "molecules"), m.id),
      {
        ...m,
        importedAt: new Date().toISOString()
      }
    );
  }

  return json.data.molecules.length;
}
