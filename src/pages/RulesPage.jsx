import { useState } from "react";
import RulesTables from "../rules/RulesTables";
import RulesSandbox from "../rules/RulesSandbox";
import RulesCalculations from "../rules/RulesCalculations";

export default function RulesPage() {
  const [tab, setTab] = useState("sandbox");

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Game Rules – Physical Chemistry
        </h1>
        <p className="text-slate-500">
          Test and review how materials behave under physical conditions
        </p>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-2 overflow-x-auto">
          <Tab
            label="Sandbox"
            active={tab === "sandbox"}
            onClick={() => setTab("sandbox")}
          />
          <Tab
            label="Rules"
            active={tab === "rules"}
            onClick={() => setTab("rules")}
          />
        </div>
          <Tab
    label="Calculations"
    active={tab === "calculations"}
    onClick={() => setTab("calculations")}
  />
      </div>

      {/* Content */}
      <div>
        {tab === "sandbox" && <RulesSandbox />}
        {tab === "rules" && <RulesTables />}
         {tab === "calculations" && <RulesCalculations />}
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap
        ${
          active
            ? "border-slate-900 text-slate-900"
            : "border-transparent text-slate-500 hover:text-slate-700"
        }
      `}
    >
      {label}
    </button>
  );
}
