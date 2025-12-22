import React, { useMemo, useState } from "react";
import { Copy, Check, Wand2 } from "lucide-react";
import { importMoleculesFromText } from "../../utils/importMoleculesFromText";

export default function MoleculesDocs({ onDone }) {
  const [copied, setCopied] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const JSON_TEMPLATE = useMemo(
    () => `[
  {
    "worldId": "molecule_glow_alkaloid",
    "name": "Glow Alkaloid",
    "actualMoleculeName": "Psilocybin",
    "description": "",

    "imageUrl": "",

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

    "functionalGroups": [],

    "smell": "",
    "color": "",
    "taste": ""
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
      const count = await importMoleculesFromText(pasteText);
      alert(`Created/Updated ${count} molecules`);
      if (onDone) onDone(); // ✅ back to overview + refresh
    } catch (e) {
      console.error(e);
      alert(e?.message || "Failed to create from JSON");
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-slate-800">
          Molecules Documentation
        </h2>
        <p className="text-sm text-slate-500">
          Paste JSON here to create/update molecules. Functional groups are kept empty for now (manual later).
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">Key fields</h3>

        <div className="bg-white border rounded-lg p-4 space-y-2">
          <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
            <li><b>worldId</b> – stable identifier (required)</li>
            <li><b>name</b> – required</li>
            <li><b>actualMoleculeName</b>, <b>description</b>, <b>imageUrl</b></li>
            <li><b>molarMass</b>, <b>meltingPoint</b>, <b>boilingPoint</b></li>
            <li><b>polarityAffinity</b>, <b>hydrogenBonding</b>, <b>ionicType</b></li>
            <li><b>stability</b>, <b>reactivity</b></li>
            <li><b>rarity</b>, <b>known</b></li>
            <li><b>functionalGroups</b> – always <b>[]</b> for now (manual later)</li>
            <li><b>smell</b>, <b>color</b>, <b>taste</b> – free text</li>
          </ul>
        </div>
      </section>

      {/* JSON TEMPLATE */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">JSON Template</h3>

        <div className="bg-white border rounded-lg p-4 space-y-2">
          <p className="text-sm text-slate-600">
            You can paste a JSON <b>array</b> or a single <b>object</b>. Minimum required: <b>worldId</b>, <b>name</b>.
          </p>
          <p className="text-sm text-slate-600">
            <b>functionalGroups</b> will be forced to <b>[]</b> on import.
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

      {/* PASTE JSON -> CREATE */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700">
          Paste JSON → Create / Update
        </h3>

        <div className="bg-white border rounded-lg p-4 space-y-3">
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
              Import from JSON
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
