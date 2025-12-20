export default function IngredientModal({ ingredient, onClose }) {
  if (!ingredient) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
        >
          ✕
        </button>

        {ingredient.imagePath && (
          <img
            src={ingredient.imagePath}
            alt={ingredient.name}
            className="w-full h-40 object-cover rounded"
          />
        )}

        <h2 className="text-xl font-semibold">
          {ingredient.name}
        </h2>

        <p className="text-sm text-slate-600">
          {ingredient.description}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><strong>Rarity:</strong> {ingredient.rarity}</div>
          <div><strong>Family:</strong> {ingredient.familyId}</div>
          <div><strong>Moisture:</strong> {ingredient.physical?.moisture}%</div>
          <div><strong>Density:</strong> {ingredient.physical?.density}</div>
          <div><strong>Stability:</strong> {ingredient.physical?.stability}</div>
          <div><strong>Toxicity:</strong> {ingredient.gameplay?.toxicity}</div>
          <div><strong>Volatility:</strong> {ingredient.gameplay?.volatility}</div>
        </div>

      </div>
    </div>
  );
}
