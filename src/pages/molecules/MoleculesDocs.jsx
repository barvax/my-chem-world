export default function MoleculesDocs() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          Molecules Documentation
        </h2>
        <p className="text-sm text-slate-500">
          Molecules are referenced by Ingredients (ingredient.molecules[]).  
          Molecules do not store concentration — concentration lives inside the Ingredient link.
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-slate-800">Key fields</h3>
        <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
          <li><b>worldId</b> – stable identifier (e.g. molecule_glow_alkaloid)</li>
          <li><b>name</b>, <b>actualMoleculeName</b>, <b>description</b></li>
          <li><b>molarMass</b>, <b>meltingPoint</b>, <b>boilingPoint</b></li>
          <li><b>polarityAffinity</b>, <b>hydrogenBonding</b></li>
          <li><b>ionicType</b> (neutral / acidic / basic / ionic)</li>
          <li><b>stability</b>, <b>reactivity</b></li>
          <li><b>rarity</b>, <b>known</b>, <b>imageUrl</b></li>
          <li><b>functionalGroups</b> – array (multi-select) of functional group identifiers/names</li>
        </ul>
      </div>

      <div className="bg-white border rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-slate-800">JSON Template</h3>
        <p className="text-sm text-slate-600">
          Example molecule object (stored in the <b>molecules</b> collection):
        </p>

        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-auto border border-slate-800">
          <code>{`{
  "worldId": "molecule_glow_alkaloid",
  "name": "Glow Alkaloid",
  "actualMoleculeName": "Psilocybin",
  "description": "",

  "molarMass": 284,
  "meltingPoint": 220,
  "boilingPoint": 523,
  "polarityAffinity": 80,
  "hydrogenBonding": 70,
  "ionicType": "neutral",
  "stability": 40,
  "reactivity": 60,

  "rarity": "rare",
  "known": false,
  "imageUrl": "",

  "functionalGroups": ["indole", "amine", "hydroxyl"]
}`}</code>
        </pre>
      </div>

      <div className="bg-white border rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-slate-800">Where concentration lives</h3>
        <p className="text-sm text-slate-600">
          Concentration is stored inside the Ingredient:
        </p>

        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-auto border border-slate-800">
          <code>{`{
  "worldId": "ing_some_ingredient",
  "molecules": [
    { "moleculeWorldId": "molecule_glow_alkaloid", "minWtPercent": 1, "maxWtPercent": 3 }
  ]
}`}</code>
        </pre>
      </div>
    </div>
  );
}
