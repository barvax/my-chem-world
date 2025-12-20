// src/layout/MainLayout.jsx
import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";

export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-200 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <aside className="w-64 h-full bg-slate-900 text-slate-200">
            <SidebarContent onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-xl"
          >
            ☰
          </button>
          <span className="font-semibold">Chem World Editor</span>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }) {
  return (
    <>
      <div className="px-6 py-5 border-b border-slate-800">
        <h1 className="text-lg font-semibold">Chem World</h1>
        <p className="text-xs text-slate-400">World Editor</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavItem to="/ingredient-families" onClick={onNavigate}>
          Ingredient Families
        </NavItem>
      </nav>

      <div className="px-6 py-4 border-t border-slate-800 text-xs text-slate-500">
        v0.1 · Clean Reset
      </div>
    </>
  );
}

function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `
        block px-4 py-3 rounded-md text-sm font-medium
        ${
          isActive
            ? "bg-slate-800 text-white"
            : "hover:bg-slate-800 text-slate-300"
        }
        `
      }
    >
      {children}
    </NavLink>
  );
}
