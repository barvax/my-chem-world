import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IngredientFamiliesOverview from "./IngredientFamiliesOverview";
import IngredientFamiliesDocs from "./IngredientFamiliesDocs";

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "docs", label: "Documentation" }
];

export default function IngredientFamiliesPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Ingredient Families
          </h1>
          <p className="text-sm text-slate-500">
            Define high-level ingredient categories
          </p>
        </div>

        <button
          onClick={() => navigate("/ingredient-families/new")}
          className="px-4 py-2 rounded-md bg-slate-900 text-white"
        >
          + New Family
        </button>
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
      {activeTab === "overview" && <IngredientFamiliesOverview />}
      {activeTab === "docs" && <IngredientFamiliesDocs />}
    </div>
  );
}
