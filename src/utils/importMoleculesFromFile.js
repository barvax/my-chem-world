import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
  doc
} from "firebase/firestore";

function toNumberOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function toStringOrEmpty(v) {
  return v === null || v === undefined ? "" : String(v);
}

function normalizeStringArray(v) {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => toStringOrEmpty(x).trim())
    .filter(Boolean);
}

const IONIC_ALLOWED = new Set(["neutral", "acidic", "basic", "ionic"]);
const RARITY_ALLOWED = new Set(["common", "uncommon", "rare", "legendary"]);

export async function importMoleculesFromFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);

  if (!Array.isArray(data)) {
    throw new Error("Invalid JSON format: expected an array");
  }

  // Existing molecules map by worldId -> docId
  const snap = await getDocs(collection(db, "molecules"));
  const existingByWorldId = {};
  snap.docs.forEach((d) => {
    const m = d.data();
    if (m.worldId) existingByWorldId[m.worldId] = d.id;
  });

  let count = 0;

  for (const raw of data) {
    if (!raw || typeof raw !== "object") {
      console.warn("Skipped invalid molecule (not an object):", raw);
      continue;
    }

    // support legacy "id" coming from your example
    const worldId = toStringOrEmpty(raw.worldId || raw.id).trim();
    const name = toStringOrEmpty(raw.name).trim();

    if (!worldId || !name) {
      console.warn("Skipped invalid molecule (missing worldId/name):", raw);
      continue;
    }

    const ionicType = toStringOrEmpty(raw.ionicType || "neutral").trim();
    const rarity = toStringOrEmpty(raw.rarity || "common").trim();

    const payload = {
      worldId,
      name,
      actualMoleculeName: toStringOrEmpty(raw.actualMoleculeName).trim(),
      description: toStringOrEmpty(raw.description).trim(),

      imageUrl: toStringOrEmpty(raw.imageUrl).trim(),

      molarMass: toNumberOrNull(raw.molarMass),
      meltingPoint: toNumberOrNull(raw.meltingPoint),
      boilingPoint: toNumberOrNull(raw.boilingPoint),

      polarityAffinity: toNumberOrNull(raw.polarityAffinity),
      hydrogenBonding: toNumberOrNull(raw.hydrogenBonding),

      ionicType: IONIC_ALLOWED.has(ionicType) ? ionicType : "neutral",

      stability: toNumberOrNull(raw.stability),
      reactivity: toNumberOrNull(raw.reactivity),

      rarity: RARITY_ALLOWED.has(rarity) ? rarity : "common",
      known: Boolean(raw.known),

      functionalGroups: normalizeStringArray(raw.functionalGroups),

      smell: toStringOrEmpty(raw.smell).trim(),
      color: toStringOrEmpty(raw.color).trim(),
      taste: toStringOrEmpty(raw.taste).trim(),

      updatedAt: serverTimestamp()
    };

    const existingDocId = existingByWorldId[worldId];

    if (existingDocId) {
      await updateDoc(doc(db, "molecules", existingDocId), payload);
    } else {
      await addDoc(collection(db, "molecules"), {
        ...payload,
        createdAt: serverTimestamp()
      });
      existingByWorldId[worldId] = "__created__";
    }

    count++;
  }

  return count;
}
