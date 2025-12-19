import { useState } from "react";
import MoleculesOverview from "../molecules/MoleculesOverview";
import MoleculeEditor from "../molecules/MoleculeEditor";
import MoleculesDocumentation from "../molecules/MoleculesDocumentation";

export default function MoleculesPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingMolecule, setEditingMolecule] = useState(null);

  return (
    <div className="flex flex-col h-full">

      {/* Tabs */}
      <div className="border-b bg-white">
        <div className="flex overflow-x-auto">
          <Tab label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <Tab label="Create / Edit" active={activeTab === "editor"} onClick={() => setActiveTab("editor")} />
          <Tab label="Documentation" active={activeTab === "docs"} onClick={() => setActiveTab("docs")} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "overview" && (
          <MoleculesOverview
            onCreate={() => {
              setEditingMolecule(null);
              setActiveTab("editor");
            }}
            onEdit={molecule => {
              setEditingMolecule(molecule);
              setActiveTab("editor");
            }}
          />
        )}

        {activeTab === "editor" && (
          <MoleculeEditor
            molecule={editingMolecule}
            onSaved={() => setActiveTab("overview")}
            onCancel={() => setActiveTab("overview")}
          />
        )}

        {activeTab === "docs" && <MoleculesDocumentation />}
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 ${
        active
          ? "border-slate-900 text-slate-900 font-medium"
          : "border-transparent text-slate-500"
      }`}
    >
      {label}
    </button>
  );
}
