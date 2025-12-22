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

const IONIC_ALLOWED = new Set(["neutral", "acidic", "basic", "ionic"]);
const RARITY_ALLOWED = new Set(["common", "uncommon", "rare", "legendary"]);

export async function importMoleculesFromArray(items) {
  if (!Array.isArray(items)) {
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

  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue;

    // support legacy "id"
    const worldId = toStringOrEmpty(raw.worldId || raw.id).trim();
    const name = toStringOrEmpty(raw.name).trim();
    if (!worldId || !name) continue;

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

      // ✅ FORCE EMPTY (manual later)
      functionalGroups: [],

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
