export default function RulesTables() {
  return (
    <div className="space-y-10">

      {/* Solubility */}
      <RuleTable
        title="Solubility (Mixing)"
        rows={[
          ["High polarity match", "Full dissolution"],
          ["Medium polarity match", "Partial dissolution"],
          ["Low polarity match", "No dissolution"],
          ["Protic solvent + H-bonding", "Solubility bonus"],
          ["Non-polar solvent + polar molecule", "Failure"]
        ]}
      />

      {/* Temperature */}
      <RuleTable
        title="Temperature States"
        rows={[
          ["T < Melting Point", "Solid"],
          ["Melting ≤ T < Boiling", "Liquid / Dissolved"],
          ["T ≥ Boiling Point", "Evaporation / Distillation"]
        ]}
      />

      {/* Stability */}
      <RuleTable
        title="Thermal Stability"
        rows={[
          ["Below threshold", "Stable"],
          ["Near threshold", "Partial degradation"],
          ["Above threshold", "Decomposition"]
        ]}
      />

      {/* Distillation */}
      <RuleTable
        title="Distillation"
        rows={[
          ["Lowest BP", "Separates first"],
          ["Large BP gap", "Clean separation"],
          ["Small BP gap", "Mixed fractions"],
          ["Decomposition before BP", "Impossible"]
        ]}
      />

    </div>
  );
}

function RuleTable({ title, rows }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-slate-800">{title}</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-slate-200 text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-2 border-b">Condition</th>
              <th className="text-left p-2 border-b">Result</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([c, r], i) => (
              <tr key={i} className="even:bg-slate-50">
                <td className="p-2 border-b">{c}</td>
                <td className="p-2 border-b">{r}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
