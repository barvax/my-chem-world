import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function exportIngredients() {
  const snap = await getDocs(collection(db, "ingredients"));
  const ingredients = snap.docs.map(doc => {
    const data = doc.data();
    delete data.createdAt;
    delete data.updatedAt;
    return data;
  });

  const blob = new Blob(
    [JSON.stringify({ ingredients }, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ingredients_export.json";
  a.click();
  URL.revokeObjectURL(url);
}
