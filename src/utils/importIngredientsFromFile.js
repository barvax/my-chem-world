import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

export async function importIngredientsFromFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!Array.isArray(data)) {
    throw new Error("Invalid JSON format: expected array");
  }

  // 1️⃣ טוענים את כל המשפחות וממפים לפי worldId
  const famSnap = await getDocs(collection(db, "ingredientFamilies"));

  const familyByWorldId = {};
  famSnap.docs.forEach(doc => {
    const fam = doc.data();
    if (fam.worldId) {
      familyByWorldId[fam.worldId] = {
        id: doc.id,
        worldId: fam.worldId
      };
    }
  });

  let count = 0;

  for (const ing of data) {
    if (!ing.name || !ing.familyWorldId) {
      console.warn("Skipped invalid ingredient:", ing);
      continue;
    }

    const family = familyByWorldId[ing.familyWorldId];

    if (!family) {
      console.warn(
        `Skipped ingredient "${ing.name}": unknown familyWorldId "${ing.familyWorldId}"`
      );
      continue;
    }

    await addDoc(collection(db, "ingredients"), {
      ...ing,
      familyId: family.id,              // 🔑 Firestore ID
      familyWorldId: family.worldId,     // 🌍 World ID
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    count++;
  }

  return count;
}
