import { Pencil, Trash2 } from "lucide-react";

export default function MoleculeCard({ molecule, onOpen, onEdit, onDelete }) {
  const worldId = molecule.worldId || molecule.id || "—";
  const rarity = molecule.rarity || "—";
  const known = molecule.known ? "Known" : "Unknown";

  return (
    <div
      onClick={onOpen}
      className="relative cursor-pointer bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
    >
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1 bg-white rounded-full shadow hover:bg-slate-100"
          title="Edit molecule"
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="p-1 bg-white rounded-full shadow hover:bg-red-50 text-red-600"
          title="Delete molecule"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {molecule.imageUrl ? (
        <img src={molecule.imageUrl} alt={molecule.name} className="w-full h-32 object-cover" />
      ) : (
        <div className="w-full h-32 bg-slate-50" />
      )}

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-800">{molecule.name || "Unnamed"}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {rarity}
          </span>
        </div>

        <div className="text-xs text-slate-500">World ID: {worldId}</div>

        <div className="text-sm text-slate-600 grid grid-cols-2 gap-x-4 gap-y-1">
          <div>Molar mass: {molecule.molarMass ?? "—"}</div>
          <div>Polarity: {molecule.polarityAffinity ?? "—"}</div>
          <div>Stability: {molecule.stability ?? "—"}</div>
          <div>{known}</div>
        </div>
      </div>
    </div>
  );
}
