import { NavLink } from "react-router-dom";

// אם עדיין יש לך Import Solvents מהסיידבר – תשאיר את זה
// import { importSolventsFromFile } from "../utils/importSolventsFromFile";

import { exportAllData, downloadJson } from "../utils/exportAllData";

const menuItems = [
  { label: "Solvents", path: "/solvents" },
  { label: "Ingredient Families", path: "/ingredient-families" },
  { label: "Ingredients", path: "/ingredients" },
  { label: "Molecules", path: "/molecules" } // ✅ back
];

export default function Sidebar({ mobile, onClose }) {
  // אם אתה לא משתמש בזה יותר – תמחק את כל הפונקציה
  function handleImportSolvents(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // importSolventsFromFile(file)
    //   .then((count) => alert(`Imported ${count} solvents successfully`))
    //   .catch((err) => {
    //     console.error(err);
    //     alert("Failed to import solvents");
    //   });

    e.target.value = "";
  }

  async function handleExportAll() {
    try {
      const payload = await exportAllData();
      downloadJson(payload, "chem-world-export.json");
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  }

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-200 flex flex-col">
      {/* Mobile overlay */}
      {mobile && <div className="absolute inset-0 bg-black/40" onClick={onClose} />}

      {/* Panel */}
      <div
        className={`
          relative h-full w-64 bg-slate-900 flex flex-col
          ${mobile ? "animate-slide-in" : ""}
        `}
      >
        <div className="px-6 py-5 border-b border-slate-800">
          <h1 className="text-lg font-semibold">Chem World</h1>
          <p className="text-xs text-slate-400">Chemical World Editor</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `
                block px-4 py-3 rounded-md text-sm font-medium
                ${isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800"}
                `
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ✅ Bottom actions */}
        <div className="px-3 pb-4 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleExportAll}
            className="w-full px-4 py-3 rounded-md text-sm font-semibold bg-black text-white hover:bg-slate-900 active:translate-y-px transition cursor-pointer"
          >
            ⬇ Export All Data
          </button>

          {/* אם תרצה להחזיר Import Solvents פה למטה — אפשר לפתוח את זה */}
          {/*
          <label className="mt-2 w-full inline-flex justify-center px-4 py-3 rounded-md text-sm font-semibold border border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer">
            📥 Import Solvents
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImportSolvents}
            />
          </label>
          */}

          <p className="mt-2 text-[11px] text-slate-400 px-1">
            Exports Families, Ingredients, Molecules, Solvents
          </p>
        </div>
      </div>
    </aside>
  );
}
