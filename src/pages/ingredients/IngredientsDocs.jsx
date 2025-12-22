import React, { useMemo, useState } from "react";
import { Copy, Check, Wand2 } from "lucide-react";
import { importIngredientsFromText } from "../../utils/importIngredientsFromText";

export default function IngredientsDocs({ onDone }) {
  const [copied, setCopied] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const JSON_TEMPLATE = useMemo(
    () => `[
  {
    "worldId": "ron",
    "name": "ron",
    "familyWorldId": "animal",
    "rarity": "common",
    "imagePath": "/images/ingredients/spider-fang.png",
    "description": "A sharp fang taken from a cave spider.",

    "physical": {
      "state": "solid",
      "stability": 33,
      "organic": true
    },

    "gameplay": {
      "value": 54,
      "toxicity": 45,
      "volatility": 77
    },

    "molecules": []
  }
]`,
    []
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(JSON_TEMPLATE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error(e);
      alert("Copy failed (browser permissions).");
    }
  }

  async function handleCreateFromJson() {
    try {
      const count = await importIngredientsFromText(pasteText);
      alert(`Created/Updated ${count} ingredients`);

      // ✅ go to overview + refresh (handled by IngredientsPage)
      if (onDone) onDone();
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to create from JSON");
    }
  }

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
          title="physical.state"
          description="State of matter: solid / liquid / gas."
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
        <DocItem
          title="gameplay.volatility"
          description="Reactivity/instability."
        />
      </section>

      {/* MOLECULES */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">
          Molecules (manual only)
        </h3>

        <DocItem
          title="molecules"
          description="Always an empty array on import. Molecules are added manually in the Ingredient Editor UI."
        />
      </section>

      {/* JSON TEMPLATE */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">JSON Template</h3>

        <div className="bg-white border rounded-lg p-4 space-y-2">
          <p className="text-sm text-slate-600">
            Import text must be a JSON <b>array</b> or a single <b>object</b>.
            Minimum required per item: <b>worldId</b>, <b>name</b>,{" "}
            <b>familyWorldId</b>.
          </p>
          <p className="text-sm text-slate-600">
            <b>molecules</b> is forced to <b>[]</b> on import (manual only in UI).
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-2 right-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800/80 text-slate-100 hover:bg-slate-700 active:translate-y-px transition cursor-pointer"
            title="Copy JSON"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="text-xs font-semibold">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>

          <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-auto border border-slate-800">
            <code>{JSON_TEMPLATE}</code>
          </pre>
        </div>
      </section>

      {/* ✅ PASTE JSON -> CREATE (moved OUTSIDE the <pre>) */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">
          Paste JSON → Create / Update
        </h3>

        <div className="bg-white border rounded-lg p-4 space-y-3">
          <p className="text-sm text-slate-600">
            Paste JSON here (array or single object) and click Create. Upsert by{" "}
            <b>worldId</b>. Molecules will be forced to <b>[]</b>.
          </p>

          <textarea
            className="input w-full h-44 font-mono text-xs"
            placeholder="Paste JSON here..."
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCreateFromJson}
              className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 active:translate-y-px transition inline-flex items-center gap-2"
            >
              <Wand2 size={16} />
              Create from JSON
            </button>
          </div>
        </div>
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
