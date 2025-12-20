import { NavLink } from "react-router-dom";
import { exportSolvents } from "../utils/exportSolvents";
import { importSolventsFromFile } from "../utils/importSolvents";
import { exportMolecules } from "../utils/exportMolecules";
import { importMoleculesFromFile } from "../utils/importMolecules";
import { importIngredientsFromFile } from "../utils/importIngredients";
import { exportIngredients } from "../utils/exportIngredients";

const menuItems = [
  { label: "Solvents", path: "/solvents" },
  { label: "Ingredients", path: "/ingredients" },
  { label: "Molecules", path: "/molecules" },
  { label: "Reactions", path: "/reactions" },
   { label: "Rules", path: "/rules" }
];

export default function Sidebar({ mobile, onClose }) {
    function handleImportSolvents(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  importSolventsFromFile(file)
    .then(count => {
      alert(`Imported ${count} solvents successfully`);
    })
    .catch(err => {
      console.error(err);
      alert("Failed to import solvents");
    });

  e.target.value = "";
}

  return (
<aside className="w-64 h-screen bg-slate-900 text-slate-200 flex flex-col">

      {/* Mobile overlay */}
      {mobile && (
        <div
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
          relative h-full w-64 bg-slate-900
          ${mobile ? "animate-slide-in" : ""}
        `}
      >
        <div className="px-6 py-5 border-b border-slate-800">
          <h1 className="text-lg font-semibold">Chem World</h1>
          <p className="text-xs text-slate-400">
            Chemical World Editor
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `
                block px-4 py-3 rounded-md text-sm font-medium
                ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "hover:bg-slate-800"
                }
                `
              }
            >
              {item.label}
            </NavLink>
            
            
          ))}
        </nav>
        <label className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer">
  <span>📥</span>
  <span>Import Solvents</span>

  <input
    type="file"
    accept="application/json"
    onChange={handleImportSolvents}
    className="hidden"
  />
</label>

<button
  onClick={exportSolvents}
  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md"
>
  <span>⬇️</span>
  <span>Export</span>
</button>

        <div className="px-6 py-4 border-t border-slate-800 text-xs text-slate-500">
          v0.1 · Internal Tool
        </div>
        <button
  onClick={exportMolecules}
  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 rounded-md"
>
  ⬇️ Export Molecules
</button>
<label className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 rounded-md cursor-pointer">
  📥 Import Molecules
  <input
    type="file"
    accept="application/json"
    className="hidden"
    onChange={async e => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const count = await importMoleculesFromFile(file);
        alert(`Imported ${count} molecules`);
      } catch (err) {
        alert("Failed to import molecules");
        console.error(err);
      }

      e.target.value = "";
    }}
  />
</label>
{/* Ingredients Import */}
<label className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 rounded-md cursor-pointer">
  📥 Import Ingredients
  <input
    type="file"
    accept="application/json"
    className="hidden"
    onChange={async e => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const count = await importIngredientsFromFile(file);
        alert(`Imported ${count} ingredients`);
      } catch (err) {
        console.error(err);
        alert("Failed to import ingredients");
      }

      e.target.value = "";
    }}
  />
</label>

{/* Ingredients Export */}
<button
  onClick={exportIngredients}
  className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 rounded-md"
>
  ⬇️ Export Ingredients
</button>

      </div>
    </aside>
  );
}
