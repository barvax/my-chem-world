import { useEffect, useState } from "react";
import { getIngredientFamilies } from "../../services/ingredientFamilies.service";
import { getIngredients } from "../../services/ingredients.service";
import { useNavigate } from "react-router-dom";
import IngredientCard from "./IngredientCard"
import IngredientModal from "./IngredientModal";


export default function IngredientsOverview() {
  const [families, setFamilies] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [activeFamilyId, setActiveFamilyId] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
    async function load() {
      const fams = await getIngredientFamilies();
      const ings = await getIngredients();

      setFamilies(fams);
      setIngredients(ings);

      if (fams.length > 0) {
        setActiveFamilyId(fams[0].id);
      }
    }

    load();
  }, []);

  if (!families.length) {
    return <p className="text-slate-500">Loading families…</p>;
  }

  const filteredIngredients = ingredients.filter(
    ing => ing.familyId === activeFamilyId
  );

  return (
    <div className="space-y-6">

      {/* Dynamic Family Tabs */}
      <div className="flex gap-2 border-b">
        {families.map(family => (
          <button
            key={family.id}
            onClick={() => setActiveFamilyId(family.id)}
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
      {filteredIngredients.map(ing => (
  <IngredientCard
    key={ing.id}
    ingredient={ing}
    onEdit={() => navigate(`/ingredients/edit/${ing.id}`)}
    onOpen={() => setSelectedIngredient(ing)}
  />
  
))}
<IngredientModal
  ingredient={selectedIngredient}
  onClose={() => setSelectedIngredient(null)}
/>
        </div>
      )}
    </div>
  );
}

