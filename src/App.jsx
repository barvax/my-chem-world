import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import MoleculeSheet from "./pages/molecules/MoleculeSheet";
import IngredientEditor from "./pages/ingredients/IngredientEditor";
import IngredientFamilyEditor from "./pages/ingredient-families/IngredientFamilyEditor";
import IngredientFamiliesPage from "./pages/ingredient-families/IngredientFamiliesPage";
import IngredientsPage from "./pages/ingredients/IngredientsPage";

import SolventsPage from "./pages/solvents/SolventsPage";
import SolventEditor from "./pages/solvents/SolventEditor";

// ✅ Molecules
import MoleculesPage from "./pages/molecules/MoleculesPage";
import MoleculeEditor from "./pages/molecules/MoleculeEditor";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Default */}
        <Route path="/" element={<Navigate to="/ingredient-families" />} />

        {/* Ingredient Families */}
        <Route path="/ingredient-families" element={<IngredientFamiliesPage />} />
        <Route path="/ingredient-families/edit/:familyId" element={<IngredientFamilyEditor />} />
        <Route path="/ingredient-families/new" element={<IngredientFamilyEditor />} />

        {/* Ingredients */}
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/ingredients/edit/:ingredientId" element={<IngredientEditor />} />
        <Route path="/ingredients/new" element={<IngredientEditor />} />

        {/* Solvents */}
        <Route path="/solvents" element={<SolventsPage />} />
        <Route path="/solvents/edit/:solventId" element={<SolventEditor />} />
        {/* אם כבר הוספת אצלך /solvents/new תשאיר, אם לא: */}
        {/* <Route path="/solvents/new" element={<SolventEditor />} /> */}

        {/* ✅ Molecules */}
        <Route path="/molecules" element={<MoleculesPage />} />
        <Route path="/molecules/edit/:moleculeId" element={<MoleculeEditor />} />
        <Route path="/molecules/new" element={<MoleculeEditor />} />
        <Route path="/molecules/view/:id" element={<MoleculeSheet />} />
      </Route>
    </Routes>
  );
}
