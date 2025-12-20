export default function RulesCalculations() {
  return (
    <div className="space-y-10">

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Solubility – Calculation Model
        </h2>

        <p className="text-slate-600 text-sm">
          This section documents the mathematical model used to evaluate
          molecular solubility in a given solvent.
        </p>
      </section>

      {/* Inputs */}
      <Section title="Inputs">
        <List
          title="Molecule Properties"
          items={[
            "polarityAffinity (0–100)",
            "hydrogenBonding (0–100)"
          ]}
        />
        <List
          title="Solvent Properties"
          items={[
            "polarityIndex (0–100)",
            "isProtic (boolean)"
          ]}
        />
      </Section>

      {/* Core Formula */}
      <Section title="Core Formula – Polarity Match">
        <Formula>
          polarityMatch = 100 − | molecule.polarityAffinity − solvent.polarityIndex |
        </Formula>
        <Explanation>
          The closer the polarity values, the higher the solubility potential.
        </Explanation>
      </Section>

      {/* Modifier */}
      <Section title="Hydrogen Bonding Modifier">
        <Formula>
          if solvent.isProtic == true AND molecule.hydrogenBonding &gt; 50 → +10
        </Formula>
        <Explanation>
          Protic solvents provide additional stabilization for hydrogen-bonding
          molecules.
        </Explanation>
      </Section>

      {/* Final Score */}
      <Section title="Final Solubility Score">
        <Formula>
          solubilityScore = polarityMatch + hydrogenBondingBonus
        </Formula>
      </Section>

      {/* Mapping */}
      <Section title="Score Mapping">
        <table className="w-full text-sm border border-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 border-b text-left">Score Range</th>
              <th className="p-2 border-b text-left">Result</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border-b">≥ 75</td>
              <td className="p-2 border-b">Fully Dissolved</td>
            </tr>
            <tr>
              <td className="p-2 border-b">40 – 74</td>
              <td className="p-2 border-b">Partially Dissolved</td>
            </tr>
            <tr>
              <td className="p-2 border-b">&lt; 40</td>
              <td className="p-2 border-b">No Dissolution</td>
            </tr>
          </tbody>
        </table>
      </Section>

    </div>
  );
}

/* ---------- UI Helpers ---------- */

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      {children}
    </div>
  );
}

function Formula({ children }) {
  return (
    <div className="font-mono bg-slate-100 p-3 rounded text-sm">
      {children}
    </div>
  );
}

function Explanation({ children }) {
  return (
    <p className="text-sm text-slate-600">{children}</p>
  );
}

function List({ title, items }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-slate-700 mb-1">
        {title}
      </h4>
      <ul className="list-disc list-inside text-sm text-slate-600">
        {items.map(i => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
