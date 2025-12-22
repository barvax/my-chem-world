import { importMoleculesFromArray } from "./importMoleculesShared";

export async function importMoleculesFromText(jsonText) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Invalid JSON");
  }

  const arr = Array.isArray(parsed) ? parsed : [parsed];
  return await importMoleculesFromArray(arr);
}
