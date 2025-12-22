import { Pencil, Trash2 } from "lucide-react";

export default function IngredientCard({ ingredient, onEdit, onDelete, onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="relative bg-white border rounded-xl overflow-hidden cursor-pointer hover:shadow-sm transition"
    >
      {/* TOP ACTIONS */}
   {/* DELETE (top-left) */}
{onDelete && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onDelete();
    }}
    className="absolute top-2 left-2 z-10 bg-white/95 hover:bg-white p-2 rounded-full shadow active:translate-y-px transition"
    title="Delete"
  >
    <Trash2 size={16} className="text-red-600" />
  </button>
)}

{/* EDIT (top-right) */}
<button
  onClick={(e) => {
    e.stopPropagation();
    onEdit();
  }}
  className="absolute top-2 right-2 z-10 bg-white/95 hover:bg-white p-2 rounded-full shadow active:translate-y-px transition"
  title="Edit"
>
  <Pencil size={16} />
</button>


      {/* IMAGE (smaller area, still shows full image) */}
      <div className="p-3 pb-0">
        <div className="w-full aspect-square max-h-[220px] rounded-lg border bg-slate-50 overflow-hidden flex items-center justify-center">
          {ingredient.imagePath ? (
            <img
              src={ingredient.imagePath}
              alt={ingredient.name}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="text-xs text-slate-400">No image</div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3 pt-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-800 leading-tight text-[15px]">
            {ingredient.name}
          </h3>

          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
            {ingredient.rarity || "—"}
          </span>
        </div>

        <div className="mt-2 text-sm text-slate-600 space-y-1">
          <div className="flex justify-between gap-3">
            <span className="text-slate-500">State</span>
            <span className="font-medium text-slate-700">
              {ingredient.physical?.state ?? "—"}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Stability</span>
            <span className="font-medium text-slate-700">
              {ingredient.physical?.stability ?? "—"}
            </span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-slate-500">Toxicity</span>
            <span className="font-medium text-slate-700">
              {ingredient.gameplay?.toxicity ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
