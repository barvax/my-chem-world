import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

/**
 * Export all solvents to a JSON file
 */
export async function exportSolvents() {
  const snapshot = await getDocs(collection(db, "solvents"));

  const solvents = snapshot.docs.map(doc => {
    const data = doc.data();

  return {
    id: data.id || `solvent_${doc.id}`,
    name: data.name,
    actualSolventName: data.actualSolventName || "",
    description: data.description || "",
    solventType: data.solventType,
    polarityIndex: Number(data.polarityIndex ?? 0),
    boilingPoint: Number(data.boilingPoint ?? null),
    freezingPoint: Number(data.freezingPoint ?? null),
    volatility: Number(data.volatility ?? null),
    toxicity: Number(data.toxicity ?? null),
    flammability: Number(data.flammability ?? null),
    isProtic: Boolean(data.isProtic),
    isExperimental: Boolean(data.isExperimental)
  };
  });

  const exportData = {
    meta: {
      worldName: "Chem World",
      exportType: "solvents_only",
      schemaVersion: "1.0",
      exportedAt: new Date().toISOString()
    },
    data: {
      solvents
    }
  };

  downloadJSON(
    exportData,
    `chem-world_solvents_${new Date().toISOString().slice(0, 10)}.json`
  );
}

/**
 * Trigger browser download
 */
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
