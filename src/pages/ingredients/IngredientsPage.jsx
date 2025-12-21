import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IngredientsOverview from "./IngredientsOverview";
import IngredientsDocs from "./IngredientsDocs";
import { importIngredientsFromFile } from "../../utils/importIngredientsFromFile";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "docs", label: "Documentation" }
];

export default function IngredientsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-semibold text-slate-800">Ingredients</h1>
          <p className="text-sm text-slate-500">
            Manage ingredients and their properties
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* NEW INGREDIENT (same black style as Families) */}
          <button
            onClick={() => navigate("/ingredients/new")}
            className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 active:translate-y-px transition"
          >
            + New Ingredient
          </button>

          {/* IMPORT */}
          <label className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 active:translate-y-px transition cursor-pointer">
            📥 Import JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={
              `px-4 py-2 text-sm font-medium border-b-2 ` +
              (activeTab === tab.key
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-700")
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && <IngredientsOverview />}
      {activeTab === "docs" && <IngredientsDocs />}
    </div>
  );
}
