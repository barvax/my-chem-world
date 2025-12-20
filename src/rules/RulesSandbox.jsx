import { useState } from "react";

const INGREDIENTS = [
  {
    id: "creeping_mushroom",
    name: "Creeping Mushroom",
    molecules: [
      { name: "Creeping Flavone", concentration: "3–8%" },
      { name: "Minor Alkaloid", concentration: "trace" }
    ]
  }
];

const SOLVENTS = [
  { id: "water", name: "Water", type: "Polar Protic" },
  { id: "ethanol", name: "Ethanol", type: "Polar Protic" },
  { id: "methanol", name: "Methanol", type: "Polar Protic" },
  { id: "dmso", name: "DMSO", type: "Polar Aprotic" },
  { id: "hexane", name: "Hexane", type: "Non-Polar" }
];

export default function RulesSandbox() {
  const [ingredient, setIngredient] = useState(INGREDIENTS[0]);
  const [solvent, setSolvent] = useState(SOLVENTS[1]);
  const [temperature, setTemperature] = useState(25);
  const [closedSystem, setClosedSystem] = useState(true);
  const [log, setLog] = useState([]);

  function addLog(text) {
    setLog(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${text}`
    ]);
  }

  function handleMix() {
    addLog(`Mixed ${ingredient.name} with ${solvent.name}`);
  }

  function handleHeat() {
    addLog(`Heated system to ${temperature}°C`);
  }

  function handleCool() {
    addLog(`Cooling system`);
    setTemperature(25);
  }

  function handleDistill() {
    addLog(`Attempted distillation`);
  }

  function handleReset() {
    setTemperature(25);
    setLog([]);
    addLog("System reset");
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">

      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Simulation Lab (Sandbox)
        </h1>
        <p className="text-slate-500">
          Test physical behavior of materials under controlled conditions
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* INPUTS */}
        <section className="space-y-5 bg-white border rounded-xl p-4">
          <h2 className="font-semibold text-lg">Inputs</h2>

          {/* Ingredient */}
          <div>
            <label className="text-sm font-medium">Ingredient</label>
            <select
              className="input w-full"
              value={ingredient.id}
              onChange={e =>
                setIngredient(
                  INGREDIENTS.find(i => i.id === e.target.value)
                )
              }
            >
              {INGREDIENTS.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>

            <div className="text-xs text-slate-500 mt-1">
              Contains:
              {ingredient.molecules.map(m => (
                <div key={m.name}>
                  • {m.name} ({m.concentration})
                </div>
              ))}
            </div>
          </div>

          {/* Solvent */}
          <div>
            <label className="text-sm font-medium">Solvent</label>
            <select
              className="input w-full"
              value={solvent.id}
              onChange={e =>
                setSolvent(
                  SOLVENTS.find(s => s.id === e.target.value)
                )
              }
            >
              {SOLVENTS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div className="text-xs text-slate-500">
              Type: {solvent.type}
            </div>
          </div>

          {/* Temperature */}
          <div>
            <label className="text-sm font-medium">
              Temperature: {temperature}°C
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={temperature}
              onChange={e => setTemperature(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* System */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={closedSystem}
              onChange={() => setClosedSystem(!closedSystem)}
            />
            <span className="text-sm">
              Closed system
            </span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleMix} className="btn-primary">Mix</button>
            <button onClick={handleHeat} className="btn-primary">Heat</button>
            <button onClick={handleCool} className="btn-secondary">Cool</button>
            <button onClick={handleDistill} className="btn-secondary">Distill</button>
            <button onClick={handleReset} className="btn-danger col-span-2">
              Reset
            </button>
          </div>
        </section>

        {/* OBSERVATIONS */}
        <section className="space-y-4 bg-white border rounded-xl p-4">
          <h2 className="font-semibold text-lg">Observations</h2>

          <div className="text-sm text-slate-600">
            Temperature: {temperature}°C<br />
            System: {closedSystem ? "Closed" : "Open"}
          </div>

          <div className="border rounded-md p-3 bg-slate-50 text-sm h-64 overflow-auto">
            {log.length === 0 && (
              <div className="text-slate-400">
                No actions yet
              </div>
            )}
            {log.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
