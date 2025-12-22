import { importIngredientsFromArray } from "./importIngredientsShared";

/**
 * Accepts JSON string that can be:
 * - array of ingredients
 * - single ingredient object
 */
export async function importIngredientsFromText(jsonText) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Invalid JSON");
  }

  const arr = Array.isArray(parsed) ? parsed : [parsed];
  if (!Array.isArray(arr)) throw new Error("Invalid JSON");

  return await importIngredientsFromArray(arr);
}
