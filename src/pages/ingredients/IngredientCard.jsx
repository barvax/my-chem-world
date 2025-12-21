import { Pencil, Trash2 } from "lucide-react";

export default function IngredientCard({ ingredient, onEdit, onOpen, onDelete }) {
  return (
    <div
      onClick={onOpen}
      className="relative cursor-pointer bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
    >
      {/* ACTION ICONS (like Families) */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1 bg-white rounded-full shadow hover:bg-slate-100"
          title="Edit ingredient"
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="p-1 bg-white rounded-full shadow hover:bg-red-50 text-red-600"
          title="Delete ingredient"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* IMAGE */}
      {ingredient.imagePath && (
        <img
          src={ingredient.imagePath}
          alt={ingredient.name}
          className="w-full h-32 object-cover"
        />
      )}

      {/* CONTENT */}
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-slate-800">{ingredient.name}</h3>

        <div className="text-sm text-slate-600">
          <div>Rarity: {ingredient.rarity}</div>
          <div>Stability: {ingredient.physical?.stability ?? "—"}</div>
          <div>Toxicity: {ingredient.gameplay?.toxicity ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
