import { useState } from "react";
import IngredientsOverview from "./IngredientsOverview";
import IngredientEditor from "./IngredientEditor";
import IngredientsDocs from "./IngredientsDocs";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "editor", label: "Create / Edit" },
  { key: "docs", label: "Documentation" }
];

export default function IngredientsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Ingredients</h1>
        <p className="text-sm text-slate-500">
          Ingredients grouped by families and layers
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm border-b-2 ${
              activeTab === tab.key
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <IngredientsOverview />}
      {activeTab === "editor" && <IngredientEditor />}
      {activeTab === "docs" && <IngredientsDocs />}
    </div>
  );
}
