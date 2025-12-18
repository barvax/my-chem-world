export default function SolventDocumentation() {
  return (
    <div className="space-y-6">

      <DocSection
        title="Overview"
        text="A solvent defines the medium in which ingredients dissolve and reactions occur. Solvent properties directly affect solubility, reaction success, stability, and risk."
      />

      <DocGroup title="Basic Information">
        <DocField
          name="Solvent Name"
          description="The unique name of the solvent. Used for identification and reference."
        />
        <DocField
          name="Solvent Type"
          description="Defines the general chemical category of the solvent: Non-Polar, Polar Aprotic, or Polar Protic. Many rules depend on this classification."
        />
        <DocField
          name="Description"
          description="Free text description used for lore, explanation, or player guidance."
        />
      </DocGroup>

      <DocGroup title="Physical Properties">
        <DocField
          name="Boiling Point (°C)"
          description="Temperature at which the solvent evaporates. Exceeding this value may cause solvent loss or reaction failure."
        />
        <DocField
          name="Freezing Point (°C)"
          description="Temperature below which the solvent solidifies, potentially halting reactions."
        />
        <DocField
          name="Volatility"
          description="Represents how quickly the solvent evaporates over time. Higher values increase solvent loss."
        />
      </DocGroup>

      <DocGroup title="Chemical Properties">
        <DocField
          name="Polarity Index"
          description="A numeric representation of solvent polarity. Solubility is calculated by comparing this value with ingredient polarity."
        />
        <DocField
          name="Protic Solvent"
          description="Indicates whether the solvent can donate protons. Protic solvents enable or block specific reactions."
        />
        <DocField
          name="Dielectric Constant"
          description="Affects ionic interactions and salt solubility. Higher values stabilize charged species."
        />
      </DocGroup>

      <DocGroup title="Gameplay Properties">
        <DocField
          name="Toxicity"
          description="Represents danger to the player or environment. High toxicity may impose penalties or restrictions."
        />
        <DocField
          name="Flammability"
          description="Controls fire and explosion risk during heating or reactions."
        />
        <DocField
          name="Experimental Solvent"
          description="Marks solvents that are unstable, advanced, or unlocked later in gameplay."
        />
      </DocGroup>

    </div>
  );
}

/* ---------- UI helpers ---------- */

function DocSection({ title, text }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 text-sm">
        {text}
      </p>
    </div>
  );
}

function DocGroup({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h4 className="text-md font-semibold text-slate-700 mb-4">
        {title}
      </h4>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function DocField({ name, description }) {
  return (
    <div>
      <div className="text-sm font-medium text-slate-800">
        {name}
      </div>
      <div className="text-sm text-slate-600">
        {description}
      </div>
    </div>
  );
}
