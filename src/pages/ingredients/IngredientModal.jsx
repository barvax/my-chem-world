export default function IngredientModal({ ingredient, onClose }) {
  if (!ingredient) return null;

  const molecules = Array.isArray(ingredient.molecules) ? ingredient.molecules : [];
  const sumMax = molecules.reduce((acc, r) => acc + (Number(r?.maxWtPercent) || 0), 0);

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

        <h2 className="text-xl font-semibold">{ingredient.name}</h2>

        <p className="text-sm text-slate-600">{ingredient.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><strong>Rarity:</strong> {ingredient.rarity}</div>
          <div><strong>World ID:</strong> {ingredient.worldId || "—"}</div>
          <div><strong>Moisture:</strong> {ingredient.physical?.moisture ?? "—"}%</div>
          <div><strong>Density:</strong> {ingredient.physical?.density ?? "—"}</div>
          <div><strong>Stability:</strong> {ingredient.physical?.stability ?? "—"}</div>
          <div><strong>Toxicity:</strong> {ingredient.gameplay?.toxicity ?? "—"}</div>
          <div><strong>Volatility:</strong> {ingredient.gameplay?.volatility ?? "—"}</div>
        </div>

        {/* Molecules */}
        <div className="border rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-slate-800">Molecules</div>
            <div className={`text-xs font-semibold ${sumMax > 100 ? "text-red-600" : "text-slate-500"}`}>
              Σ(max) = {sumMax}%
            </div>
          </div>

          {molecules.length === 0 ? (
            <div className="text-sm text-slate-400 italic">No molecules defined</div>
          ) : (
            <div className="space-y-1 text-sm">
              {molecules.map((m, i) => (
                <div key={i} className="flex items-center justify-between border-t pt-2">
                  <div className="text-slate-700">{m.moleculeWorldId || "—"}</div>
                  <div className="text-slate-600">
                    {m.minWtPercent ?? "—"}–{m.maxWtPercent ?? "—"}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
