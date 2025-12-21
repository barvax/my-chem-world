export default function MoleculeModal({ molecule, onClose }) {
  if (!molecule) return null;

  const worldId = molecule.worldId || molecule.id || "—";
  const groups = Array.isArray(molecule.functionalGroups)
    ? molecule.functionalGroups
    : [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[min(900px,95vw)] rounded-xl overflow-hidden shadow-xl border">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <div className="text-lg font-semibold text-slate-900">{molecule.name}</div>
            <div className="text-xs text-slate-500">World ID: {worldId}</div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 active:translate-y-px transition"
          >
            Close
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-1">
            {molecule.imageUrl ? (
              <img
                src={molecule.imageUrl}
                alt={molecule.name}
                className="w-full h-56 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-full h-56 bg-slate-50 rounded-lg border" />
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            {molecule.actualMoleculeName ? (
              <div className="text-sm text-slate-700">
                <span className="font-semibold">Actual name:</span>{" "}
                {molecule.actualMoleculeName}
              </div>
            ) : null}

            {molecule.description ? (
              <div className="text-sm text-slate-700">{molecule.description}</div>
            ) : (
              <div className="text-sm text-slate-400 italic">No description</div>
            )}

            {/* ✅ NEW: functionalGroups display */}
            <div className="bg-white border rounded-lg p-3">
              <div className="text-xs font-semibold text-slate-600">
                Functional Groups
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {groups.length ? (
                  groups.map((g) => (
                    <span
                      key={g}
                      className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700"
                    >
                      {g}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400 italic">
                    None
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Molar mass" value={molecule.molarMass} />
              <Info label="Melting point" value={molecule.meltingPoint} />
              <Info label="Boiling point" value={molecule.boilingPoint} />
              <Info label="Polarity affinity" value={molecule.polarityAffinity} />
              <Info label="Hydrogen bonding" value={molecule.hydrogenBonding} />
              <Info label="Ionic type" value={molecule.ionicType} />
              <Info label="Stability" value={molecule.stability} />
              <Info label="Reactivity" value={molecule.reactivity} />
              <Info label="Rarity" value={molecule.rarity} />
              <Info label="Known" value={molecule.known ? "true" : "false"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-white border rounded-lg p-3">
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <div className="text-sm text-slate-800 mt-1">{value ?? "—"}</div>
    </div>
  );
}
