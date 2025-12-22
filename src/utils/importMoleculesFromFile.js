import { importMoleculesFromArray } from "./importMoleculesShared";

export async function importMoleculesFromFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid JSON format: expected an array");
  }

  return await importMoleculesFromArray(parsed);
}
