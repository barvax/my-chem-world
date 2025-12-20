import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function importIngredientsFromFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!Array.isArray(data.ingredients)) {
    throw new Error("Invalid file format: missing ingredients[]");
  }

  let count = 0;

  for (const ingredient of data.ingredients) {
    // basic validation
    if (!ingredient.name || !ingredient.familyId) {
      console.warn("Skipped invalid ingredient:", ingredient);
      continue;
    }

    await addDoc(collection(db, "ingredients"), {
      ...ingredient,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    count++;
  }

  return count;
}
