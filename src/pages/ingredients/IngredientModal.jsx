export default function IngredientModal({ ingredient, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold">{ingredient.name}</h2>

        <div className="text-sm space-y-1">
          <div><strong>Moisture:</strong> {ingredient.moisture}%</div>
          <div><strong>Rarity:</strong> {ingredient.rarity}</div>
          <div><strong>ID:</strong> {ingredient.id}</div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
