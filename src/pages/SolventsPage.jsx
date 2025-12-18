import { useState } from "react";
import SolventsOverview from "./SolventsOverview";
import SolventEditor from "./SolventEditor";
import SolventDocumentation from "./SolventDocumentation";

export default function SolventsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSolvent, setSelectedSolvent] = useState(null);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800">
        Solvents
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Define and manage solvent types in the chemical world
      </p>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="flex gap-6">
          <Tab label="Overview" value="overview" {...{ activeTab, setActiveTab }} />
          <Tab label="Editor" value="editor" {...{ activeTab, setActiveTab }} />
          <Tab label="Documentation" value="docs" {...{ activeTab, setActiveTab }} />
        </nav>
      </div>

      {activeTab === "overview" && (
        <SolventsOverview
          onEdit={solvent => {
            setSelectedSolvent(solvent);
            setActiveTab("editor");
          }}
        />
      )}

      {activeTab === "editor" && (
        <SolventEditor
          solvent={selectedSolvent}
          onSaved={() => {
            setSelectedSolvent(null);
            setActiveTab("overview");
          }}
        />
      )}

      {activeTab === "docs" && <SolventDocumentation />}
    </div>
  );
}

function Tab({ label, value, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`pb-3 text-sm font-medium border-b-2 ${
        activeTab === value
          ? "border-slate-800 text-slate-800"
          : "border-transparent text-slate-500"
      }`}
    >
      {label}
    </button>
  );
}
