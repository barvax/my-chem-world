import { useEffect, useState } from "react";
import { getIngredientFamilies } from "../../services/ingredientFamilies.service";
import { getIngredients, deleteIngredient } from "../../services/ingredients.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import IngredientCard from "./IngredientCard";
import IngredientModal from "./IngredientModal";

export default function IngredientsOverview() {
  const [families, setFamilies] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [activeFamilyId, setActiveFamilyId] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function load() {
      const fams = await getIngredientFamilies();
      const ings = await getIngredients();

      setFamilies(fams);
      setIngredients(ings);

      const familyFromUrl = searchParams.get("familyId");

      if (familyFromUrl && fams.some((f) => f.id === familyFromUrl)) {
        setActiveFamilyId(familyFromUrl);
      } else if (fams.length > 0) {
        setActiveFamilyId(fams[0].id);
      }
    }

    load();
  }, [searchParams]);

  async function handleDelete(ingredientId) {
    const ok = window.confirm("Are you sure you want to delete this ingredient?");
    if (!ok) return;

    await deleteIngredient(ingredientId);

    setIngredients((prev) => prev.filter((i) => i.id !== ingredientId));

    if (selectedIngredient?.id === ingredientId) {
      setSelectedIngredient(null);
    }
  }

  if (!families.length) {
    return <p className="text-slate-500">Loading families…</p>;
  }

  const filteredIngredients = ingredients.filter(
    (ing) => ing.familyId === activeFamilyId
  );

  return (
    <div className="space-y-6">
      {/* Dynamic Family Tabs */}
      <div className="flex gap-2 border-b">
        {families.map((family) => (
          <button
            key={family.id}
            onClick={() => {
              setActiveFamilyId(family.id);
              navigate(`/ingredients?familyId=${family.id}`);
            }}
            className={`
              px-4 py-2 text-sm font-medium border-b-2
              ${
                activeFamilyId === family.id
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }
            `}
          >
            {family.name}
          </button>
        ))}
      </div>

      {/* Ingredients Cards */}
      {filteredIngredients.length === 0 ? (
        <p className="text-slate-500">No ingredients in this family.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIngredients.map((ing) => (
            <IngredientCard
              key={ing.id}
              ingredient={ing}
              onEdit={() => navigate(`/ingredients/edit/${ing.id}`)}
              onOpen={() => setSelectedIngredient(ing)}
              onDelete={() => handleDelete(ing.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <IngredientModal
        ingredient={selectedIngredient}
        onClose={() => setSelectedIngredient(null)}
      />
    </div>
  );
}
