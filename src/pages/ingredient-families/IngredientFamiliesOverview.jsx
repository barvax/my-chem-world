import { useEffect, useState } from "react";
import {
  getIngredientFamilies,
  deleteIngredientFamily
} from "../../services/ingredientFamilies.service";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const CATEGORY_LABELS = {
  biological: "Biological",
  mineral: "Mineral",
  animal: "Animal",
  synthetic: "Synthetic"
};

export default function IngredientFamiliesOverview() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const data = await getIngredientFamilies();
      setFamilies(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(e, familyId) {
    e.stopPropagation();

    const ok = window.confirm(
      "Are you sure you want to delete this ingredient family?"
    );
    if (!ok) return;

    await deleteIngredientFamily(familyId);

    setFamilies((prev) => prev.filter((f) => f.id !== familyId));
  }

  function handleEdit(e, familyId) {
    e.stopPropagation();
    navigate(`/ingredient-families/edit/${familyId}`);
  }

  function handleOpenIngredients(familyId) {
    navigate(`/ingredients?familyId=${familyId}`);
  }

  if (loading) return <p className="text-slate-500">Loading families…</p>;
  if (families.length === 0) return <p className="text-slate-500">No families yet.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {families.map((family) => {
        const categoryLabel =
          CATEGORY_LABELS[family.category] ?? family.category ?? "—";
        const worldId = family.worldId ?? "—";

        return (
          <div
            key={family.id}
            onClick={() => handleOpenIngredients(family.id)}
            className="relative cursor-pointer bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            {/* ACTION ICONS */}
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <button
                onClick={(e) => handleEdit(e, family.id)}
                className="p-1 bg-white rounded-full shadow hover:bg-slate-100"
                title="Edit family"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={(e) => handleDelete(e, family.id)}
                className="p-1 bg-white rounded-full shadow hover:bg-red-50 text-red-600"
                title="Delete family"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* IMAGE */}
            {family.imagePath && (
              <img
                src={family.imagePath}
                alt={family.name}
                className="w-full h-36 object-cover"
              />
            )}

            {/* CONTENT */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-slate-800">{family.name}</h3>

              {/* NEW: Category + World ID */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Category: {categoryLabel}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  World ID: {worldId}
                </span>
              </div>

              {family.description ? (
                <p className="text-sm text-slate-500 line-clamp-2">
                  {family.description}
                </p>
              ) : (
                <p className="text-sm text-slate-400 italic">No description</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
