import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc
} from "firebase/firestore";

const STATE_OPTIONS = new Set(["solid", "liquid", "gas"]);

function toNumber(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizePhysical(raw) {
  const p = raw && typeof raw === "object" ? raw : {};
  const state =
    typeof p.state === "string" && STATE_OPTIONS.has(p.state) ? p.state : "solid";
  return {
    state,
    stability: p.stability ?? "",
    organic: Boolean(p.organic)
  };
}

function normalizeMolecules(raw, ingredientWorldId) {
  if (raw === undefined || raw === null) return { molecules: [], sumMax: 0 };
  if (!Array.isArray(raw)) {
    console.warn(`Ingredient "${ingredientWorldId}": molecules must be an array. Ignored.`);
    return { molecules: [], sumMax: 0 };
  }

  const molecules = [];
  let sumMax = 0;

  for (const m of raw) {
    if (!m || typeof m !== "object") continue;

    const moleculeWorldId = String(m.moleculeWorldId || "").trim();
    const moleculeName = String(m.moleculeName || "").trim();
    if (!moleculeWorldId && !moleculeName) continue;

    const minN = toNumber(m.minWtPercent);
    const maxN = toNumber(m.maxWtPercent);

    const minWtPercent = minN !== null ? minN : (maxN !== null ? maxN : null);
    const maxWtPercent = maxN !== null ? maxN : (minN !== null ? minN : null);

    if (minWtPercent === null || maxWtPercent === null) continue;
    if (minWtPercent < 0 || maxWtPercent < 0 || minWtPercent > 100 || maxWtPercent > 100) continue;
    if (minWtPercent > maxWtPercent) continue;

    sumMax += maxWtPercent;

    molecules.push({
      ...(moleculeWorldId ? { moleculeWorldId } : {}),
      ...(moleculeName ? { moleculeName } : {}),
      minWtPercent,
      maxWtPercent
    });
  }

  return { molecules, sumMax };
}

export async function importIngredientsFromArray(items) {
  if (!Array.isArray(items)) throw new Error("Invalid JSON format: expected array");

  // Families map by worldId -> { id, worldId }
  const famSnap = await getDocs(collection(db, "ingredientFamilies"));
  const familyByWorldId = {};
  famSnap.docs.forEach((d) => {
    const fam = d.data();
    if (fam.worldId) familyByWorldId[fam.worldId] = { id: d.id, worldId: fam.worldId };
  });

  // Existing ingredients by worldId -> docId (upsert)
  const ingSnap = await getDocs(collection(db, "ingredients"));
  const ingredientDocIdByWorldId = {};
  ingSnap.docs.forEach((d) => {
    const ing = d.data();
    if (ing.worldId) ingredientDocIdByWorldId[ing.worldId] = d.id;
  });

  let count = 0;

  for (const ing of items) {
    if (!ing || typeof ing !== "object") continue;

    if (!ing.worldId || !ing.name || !ing.familyWorldId) {
      console.warn("Skipped invalid ingredient:", ing);
      continue;
    }

    const family = familyByWorldId[ing.familyWorldId];
    if (!family) {
      console.warn(`Skipped ingredient "${ing.worldId}": unknown familyWorldId "${ing.familyWorldId}"`);
      continue;
    }

  const molecules = [];

    const payload = {
      ...ing,
      physical: normalizePhysical(ing.physical),
      molecules: [],
      familyId: family.id,
      familyWorldId: family.worldId,
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
      ingredientDocIdByWorldId[ing.worldId] = "__created__";
    }

    count++;
  }

  return count;
}
