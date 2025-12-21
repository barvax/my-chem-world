export default function IngredientsDocs() {
  return (
    <div className="max-w-3xl space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-slate-800">
          Ingredient Documentation
        </h2>
        <p className="text-sm text-slate-500">
          This section explains the meaning and usage of every field used to
          define an Ingredient in the system.
        </p>
      </section>

      {/* BASIC INFORMATION */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">
          Basic Information
        </h3>
<DocItem
  title="World ID"
  description="Stable identifier (e.g. ing_spider_fang). Used for imports, references in recipes and cross-environment stability."
/>

        <DocItem
          title="Name"
          description="The display name of the ingredient. Used throughout the UI and gameplay."
        />

        <DocItem
          title="Family"
          description="Defines which Ingredient Family this ingredient belongs to (e.g. Fungi, Roots, Minerals). Used for grouping and extraction logic."
        />

        <DocItem
          title="Rarity"
          description="Describes how common the ingredient is in the world. Affects availability, value and loot probability."
        />

        <DocItem
          title="Image Path"
          description="Path or URL to the ingredient image. Used for cards, popups and future in-game visuals."
        />
      </section>

      {/* PHYSICAL PROPERTIES */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">
          Physical Properties
        </h3>

        <DocItem
          title="Moisture (%)"
          description="Represents the water content of the ingredient. High moisture may require drying and affects extraction efficiency."
        />

        <DocItem
          title="Density"
          description="Qualitative density (low / medium / high). Used for filtering, separation and processing rules."
        />

        <DocItem
          title="Stability"
          description="Indicates how resistant the ingredient is to heat, oxidation and degradation."
        />

        <DocItem
          title="Organic"
          description="Marks whether the ingredient is organic/biological in nature. Used for biological vs inorganic rules."
        />
      </section>

      {/* GAMEPLAY PROPERTIES */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">
          Gameplay / Effects
        </h3>

        <DocItem
          title="Value"
          description="Economic value of the ingredient. Used for trading, crafting cost and rewards."
        />

        <DocItem
          title="Toxicity"
          description="Represents harmful effects. High toxicity may require safety measures or limit usage."
        />

        <DocItem
          title="Volatility"
          description="Indicates how reactive or unstable the ingredient is during processing."
        />
      </section>

      {/* DESCRIPTION */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Description</h3>

        <DocItem
          title="Description"
          description="Free text describing lore, origin, usage and special notes about the ingredient."
        />
      </section>

      {/* JSON TEMPLATE */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">JSON Template</h3>

        <div className="bg-white border rounded-lg p-4 space-y-2">
        <p className="text-sm text-slate-600">
  Use this template for bulk import (Import JSON). The file must be an <b>array</b>. Minimum required fields per item: <b>worldId</b>, <b>name</b> and <b>familyWorldId</b>.
</p>

          <p className="text-sm text-slate-600">
            Tip: <b>familyWorldId</b> must match an existing Ingredient Family{" "}
            <b>worldId</b>.
          </p>
        </div>

        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-auto border border-slate-800">
          <code>{`[
  {
   "worldId": "ing_spider_fang",
    "name": "Spider Fang",
    "familyWorldId": "animal",
    "rarity": "common",
    "imagePath": "/images/ingredients/spider-fang.png",
    "description": "A sharp fang taken from a cave spider. Used in venom recipes.",

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
    }
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
