import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function exportMolecules() {
  const snap = await getDocs(collection(db, "molecules"));

  const molecules = snap.docs.map(doc => {
    const d = doc.data();

    return {
      id: doc.id,
      name: d.name || "",
      actualMoleculeName: d.actualMoleculeName || "",
      description: d.description || "",
      naturalFamilies: d.naturalFamilies || [],
      molarMass: Number(d.molarMass ?? null),
      meltingPoint: Number(d.meltingPoint ?? null),
      boilingPoint: Number(d.boilingPoint ?? null),
      polarityAffinity: Number(d.polarityAffinity ?? 0),
      hydrogenBonding: Number(d.hydrogenBonding ?? 0),
      ionicType: d.ionicType || "neutral",
      stability: Number(d.stability ?? 0),
      reactivity: Number(d.reactivity ?? 0),
      concentrationRange: d.concentrationRange || "",
      rarity: d.rarity || "common",
      known: Boolean(d.known),
      imageUrl: d.imageUrl || ""
    };
  });

  const exportData = {
    meta: {
      worldName: "Chem World",
      exportType: "molecules",
      schemaVersion: "1.0",
      exportedAt: new Date().toISOString()
    },
    data: { molecules }
  };

  downloadJSON(
    exportData,
    `chem-world_molecules_${new Date().toISOString().slice(0, 10)}.json`
  );
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
