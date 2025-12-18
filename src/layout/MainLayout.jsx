import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";



export default function MainLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-slate-100">

      {/* Mobile Top Bar */}
      <TopBar onMenuClick={() => setMenuOpen(true)} />

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <Sidebar
          mobile
          onClose={() => setMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
