import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc
} from "firebase/firestore";

function toNumber(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeMolecules(raw, ingredientWorldId) {
  if (raw === undefined || raw === null) {
    return { molecules: [], sumMax: 0 };
  }

  if (!Array.isArray(raw)) {
    console.warn(
      `Ingredient "${ingredientWorldId}": molecules must be an array. Ignored.`
    );
    return { molecules: [], sumMax: 0 };
  }

  const molecules = [];
  let sumMax = 0;

  for (const m of raw) {
    if (!m || typeof m !== "object") {
      console.warn(
        `Ingredient "${ingredientWorldId}": skipped invalid molecule entry (not an object).`,
        m
      );
      continue;
    }

    const moleculeWorldId = (m.moleculeWorldId || "").trim();
    const moleculeName = (m.moleculeName || "").trim();

    if (!moleculeWorldId && !moleculeName) {
      console.warn(
        `Ingredient "${ingredientWorldId}": skipped molecule entry missing moleculeWorldId/moleculeName.`,
        m
      );
      continue;
    }

    // allow min only / max only (we mirror the provided one)
    const minN = toNumber(m.minWtPercent);
    const maxN = toNumber(m.maxWtPercent);

    const minWtPercent = minN !== null ? minN : (maxN !== null ? maxN : null);
    const maxWtPercent = maxN !== null ? maxN : (minN !== null ? minN : null);

    if (minWtPercent === null || maxWtPercent === null) {
      console.warn(
        `Ingredient "${ingredientWorldId}": skipped molecule entry with invalid min/max.`,
        m
      );
      continue;
    }

    if (
      minWtPercent < 0 ||
      maxWtPercent < 0 ||
      minWtPercent > 100 ||
      maxWtPercent > 100 ||
      minWtPercent > maxWtPercent
    ) {
      console.warn(
        `Ingredient "${ingredientWorldId}": skipped molecule entry with out-of-range or min>max.`,
        m
      );
      continue;
    }

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

export async function importIngredientsFromFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!Array.isArray(data)) {
    throw new Error("Invalid JSON format: expected array");
  }

  // 1) Load families map by worldId -> { id, worldId }
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
      console.warn("Skipped invalid ingredient (missing worldId/name/familyWorldId):", ing);
      continue;
    }

    const family = familyByWorldId[ing.familyWorldId];
    if (!family) {
      console.warn(
        `Skipped ingredient "${ing.worldId}": unknown familyWorldId "${ing.familyWorldId}"`
      );
      continue;
    }

    // Molecules normalization + rule: SUM(max) <= 100
    const { molecules, sumMax } = normalizeMolecules(ing.molecules, ing.worldId);
    if (sumMax > 100.0001) {
      console.warn(
        `Skipped ingredient "${ing.worldId}": sum of molecules maxWtPercent exceeds 100 (sumMax=${sumMax}).`
      );
      continue;
    }

    const payload = {
      ...ing,
      molecules,                 // ✅ store normalized array (can be empty)
      familyId: family.id,       // ✅ Firestore ID
      familyWorldId: family.worldId, // ✅ worldId normalized from DB
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
