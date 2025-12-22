import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function stripTimestamps(data) {
  if (!data || typeof data !== "object") return data;
  // eslint-disable-next-line no-unused-vars
  const { createdAt, updatedAt, ...rest } = data;
  return rest;
}

export async function exportAllData() {
  const [famSnap, ingSnap, molSnap, solvSnap] = await Promise.all([
    getDocs(collection(db, "ingredientFamilies")),
    getDocs(collection(db, "ingredients")),
    getDocs(collection(db, "molecules")),
    getDocs(collection(db, "solvents"))
  ]);

  return {
    meta: {
      version: 1,
      exportedAt: new Date().toISOString()
    },
    ingredientFamilies: famSnap.docs.map((d) => stripTimestamps(d.data())),
    ingredients: ingSnap.docs.map((d) => stripTimestamps(d.data())),
    molecules: molSnap.docs.map((d) => stripTimestamps(d.data())),
    solvents: solvSnap.docs.map((d) => stripTimestamps(d.data()))
  };
}

export function downloadJson(payload, filename = "chem-world-export.json") {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
