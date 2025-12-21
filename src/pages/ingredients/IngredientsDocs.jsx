export default function IngredientsDocs() {
  return (
    <div className="max-w-3xl space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-slate-800">
          Ingredient Documentation
        </h2>
        <p className="text-sm text-slate-500">
          Field reference + JSON template for bulk import.
        </p>
      </section>

      {/* BASIC INFORMATION */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">
          Basic Information
        </h3>

        <DocItem
          title="World ID"
          description="Stable identifier (e.g. ing_spider_fang). Used for imports and future recipe references."
        />

        <DocItem
          title="Name"
          description="The display name of the ingredient. Used throughout the UI and gameplay."
        />

        <DocItem
          title="familyWorldId"
          description="Links the ingredient to an Ingredient Family by family worldId (must exist)."
        />

        <DocItem
          title="Rarity"
          description="common / uncommon / rare / legendary. Affects availability, value and loot probability."
        />

        <DocItem
          title="Image Path"
          description="Path or URL to the ingredient image."
        />
      </section>

      {/* PHYSICAL PROPERTIES */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">
          Physical Properties
        </h3>

        <DocItem
          title="physical.moisture"
          description="Water content (%)."
        />

        <DocItem
          title="physical.density"
          description="low / medium / high."
        />

        <DocItem
          title="physical.stability"
          description="Resistance to degradation."
        />

        <DocItem
          title="physical.organic"
          description="true/false."
        />
      </section>

      {/* GAMEPLAY PROPERTIES */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">
          Gameplay / Effects
        </h3>

        <DocItem title="gameplay.value" description="Economic value." />
        <DocItem title="gameplay.toxicity" description="Harmfulness level." />
        <DocItem title="gameplay.volatility" description="Reactivity/instability." />
      </section>

      {/* MOLECULES */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">
          Molecules (optional)
        </h3>

        <DocItem
          title="molecules"
          description="Optional array of molecules found in this ingredient (can be empty or omitted)."
        />

        <DocItem
          title="molecules[].moleculeWorldId / moleculeName"
          description="Reference to the molecule. For now you can use moleculeWorldId (recommended) and/or moleculeName until the Molecules object exists."
        />

        <DocItem
          title="molecules[].minWtPercent / maxWtPercent"
          description="Weight-percent range of this molecule in the ingredient (e.g. 10–13)."
        />

        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-slate-800">Rule</h4>
          <p className="text-sm text-slate-600 mt-1">
            For each ingredient: <b>sum of all molecules maxWtPercent must be ≤ 100</b>.
            No need to reach 100 — it’s ok to be lower.
          </p>
        </div>
      </section>

      {/* JSON TEMPLATE */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">JSON Template</h3>

        <div className="bg-white border rounded-lg p-4 space-y-2">
          <p className="text-sm text-slate-600">
            Import file must be an <b>array</b>. Minimum required per item:{" "}
            <b>worldId</b>, <b>name</b>, <b>familyWorldId</b>.
          </p>
          <p className="text-sm text-slate-600">
            <b>molecules</b> is optional. Rule enforced on import:{" "}
            <b>Σ(maxWtPercent) ≤ 100</b>.
          </p>
        </div>

        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-auto border border-slate-800">
          <code>{`[
  {
    "worldId": "ing_spider_fang",
    "name": "Spider Fang",
    "familyWorldId": "family_animal_derived",
    "rarity": "common",
    "imagePath": "/images/ingredients/spider-fang.png",
    "description": "A sharp fang taken from a cave spider.",

    "physical": {
      "moisture": 23,
      "density": "medium",
      "stability": 33,
      "organic": true
    },

    "gameplay": {
      "value": 54,
      "toxicity": 45,
      "volatility": 77
    },

    "molecules": [
      { "moleculeWorldId": "mol_sugar", "moleculeName": "Sugar", "minWtPercent": 0, "maxWtPercent": 2 },
      { "moleculeWorldId": "mol_venom_x", "moleculeName": "Venom-X", "minWtPercent": 10, "maxWtPercent": 13 }
    ]
  },
  {
    "worldId": "ing_ironroot",
    "name": "Ironroot",
    "familyWorldId": "family_roots",
    "rarity": "uncommon",
    "imagePath": "/images/ingredients/ironroot.png",
    "description": "Dense root with metallic fibers.",

    "physical": {
      "moisture": 12,
      "density": "high",
      "stability": 65,
      "organic": true
    },

    "gameplay": {
      "value": 120,
      "toxicity": 10,
      "volatility": 20
    },

    "molecules": []
  }
]`}</code>
        </pre>
      </section>
    </div>
  );
}

function DocItem({ title, description }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h4 className="font-medium text-slate-800">{title}</h4>
      <p className="text-sm text-slate-600 mt-1">{description}</p>
    </div>
  );
}
