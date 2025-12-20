export default function IngredientCard({ ingredient, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white border rounded-lg p-3 hover:shadow"
    >
      <h3 className="font-medium text-slate-800">{ingredient.name}</h3>
      <p className="text-xs text-slate-500">
        Moisture: {ingredient.moisture}%
      </p>
      <p className="text-xs text-slate-400">{ingredient.rarity}</p>
    </div>
  );
}
