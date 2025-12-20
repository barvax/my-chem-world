import { Pencil } from "lucide-react";

export default function IngredientCard({ ingredient, onEdit, onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="relative bg-white border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition"
    >
      {/* IMAGE */}
      {ingredient.imagePath && (
        <img
          src={ingredient.imagePath}
          alt={ingredient.name}
          className="w-full h-32 object-cover"
        />
      )}

      {/* EDIT ICON */}
      <button
        onClick={e => {
          e.stopPropagation();
          onEdit();
        }}
        className="absolute top-2 right-2 bg-white/90 hover:bg-white p-1 rounded-full shadow"
      >
        <Pencil size={16} />
      </button>

      {/* CONTENT */}
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-slate-800">
          {ingredient.name}
        </h3>

        <div className="text-sm text-slate-600">
          <div>Rarity: {ingredient.rarity}</div>
          <div>Stability: {ingredient.physical?.stability ?? "—"}</div>
          <div>Toxicity: {ingredient.gameplay?.toxicity ?? "—"}</div>
        </div>
      </div>
    </div>
  );
}
