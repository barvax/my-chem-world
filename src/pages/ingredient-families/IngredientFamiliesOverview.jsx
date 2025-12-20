import { useEffect, useState } from "react";
import { getIngredientFamilies } from "../../services/ingredientFamilies.service";
import { useNavigate } from "react-router-dom";

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

  if (loading) {
    return <p className="text-slate-500">Loading families…</p>;
  }

  if (families.length === 0) {
    return <p className="text-slate-500">No families yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
   {families.map(family=> (
<div
  key={family.id}
  onClick={() => navigate(`/ingredient-families/edit/${family.id}`)}
  className="cursor-pointer bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
>
  {/* IMAGE */}
<div className="h-36 bg-slate-100">
  {family.imagePath && (
    <img
      src={family.imagePath}
      alt={family.name}
      className="w-full h-full object-cover"
    />
  )}
</div>

  {/* CONTENT */}
  <div className="p-4">
    <h3 className="font-semibold text-slate-800">
      {family.name}
    </h3>
    <p className="text-sm text-slate-500">
      {family.description}
    </p>
  </div>
</div>

))}

    </div>
  );
}
