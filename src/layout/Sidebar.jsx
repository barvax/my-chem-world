import { NavLink } from "react-router-dom";




const menuItems = [
  { label: "Solvents", path: "/solvents" },
   { label: "Ingredient Families", path: "/ingredient-families" },
{ label: "Ingredients", path: "/ingredients" },
  { label: "Molecules", path: "/molecules" },

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








      </div>
    </aside>
  );
}
