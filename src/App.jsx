import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import SolventsPage from "./pages/SolventsPage";
import IngredientsPage from "./pages/IngredientsPage";
import MoleculesPage from "./pages/MoleculesPage";
import ReactionsPage from "./pages/ReactionsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/solvents" replace />} />
        <Route path="solvents" element={<SolventsPage />} />
        <Route path="ingredients" element={<IngredientsPage />} />
        <Route path="molecules" element={<MoleculesPage />} />
        <Route path="reactions" element={<ReactionsPage />} />
      </Route>
    </Routes>
  );
}
