import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc
} from "firebase/firestore";

export async function importIngredientsFromFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!Array.isArray(data)) {
    throw new Error("Invalid JSON format: expected array");
  }

  // 1) Families map by worldId -> { id, worldId }
  const famSnap = await getDocs(collection(db, "ingredientFamilies"));
  const familyByWorldId = {};
  famSnap.docs.forEach((d) => {
    const fam = d.data();
    if (fam.worldId) {
      familyByWorldId[fam.worldId] = { id: d.id, worldId: fam.worldId };
    }
  });

  // 2) Existing ingredients map by worldId -> docId (for upsert)
  const ingSnap = await getDocs(collection(db, "ingredients"));
  const ingredientDocIdByWorldId = {};
  ingSnap.docs.forEach((d) => {
    const ing = d.data();
    if (ing.worldId) ingredientDocIdByWorldId[ing.worldId] = d.id;
  });

  let count = 0;

  for (const ing of data) {
    if (!ing.worldId || !ing.name || !ing.familyWorldId) {
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

    const payload = {
      ...ing,
      familyId: family.id,          // Firestore ID
      familyWorldId: family.worldId,// World ID
      updatedAt: serverTimestamp()
    };

    const existingDocId = ingredientDocIdByWorldId[ing.worldId];

    if (existingDocId) {
      await updateDoc(doc(db, "ingredients", existingDocId), payload);
    } else {
      await addDoc(collection(db, "ingredients"), {
        ...payload,
        createdAt: serverTimestamp()
      });
      // refresh map to avoid duplicates in same import file
      ingredientDocIdByWorldId[ing.worldId] = "__created__";
    }

    count++;
  }

  return count;
}
