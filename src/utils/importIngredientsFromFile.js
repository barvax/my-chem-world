import { importIngredientsFromArray } from "./importIngredientsShared";

export async function importIngredientsFromFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid JSON format: expected array");
  }

  return await importIngredientsFromArray(parsed);
}
