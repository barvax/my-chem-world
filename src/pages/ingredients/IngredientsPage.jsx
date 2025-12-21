import { useState } from "react";
import IngredientsOverview from "./IngredientsOverview";
import IngredientEditor from "./IngredientEditor";
import IngredientsDocs from "./IngredientsDocs";
import { importIngredientsFromFile } from "../../utils/importIngredientsFromFile";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "editor", label: "Create / Edit" },
  { key: "docs", label: "Documentation" }
];

export default function IngredientsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const count = await importIngredientsFromFile(file);
      alert(`Imported ${count} ingredients successfully`);
    } catch (err) {
      console.error(err);
      alert("Failed to import ingredients");
    }

    e.target.value = "";
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Ingredients
          </h1>
          <p className="text-sm text-slate-500">
            Manage ingredients and their properties
          </p>
        </div>

        {/* IMPORT BUTTON */}
        <label className="btn-secondary cursor-pointer">
          📥 Import JSON
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImport}
          />
        </label>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              px-4 py-2 text-sm font-medium border-b-2
              ${
                activeTab === tab.key
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && <IngredientsOverview />}
      {activeTab === "editor" && <IngredientEditor />}
      {activeTab === "docs" && <IngredientsDocs />}
    </div>
  );
}
