// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import IngredientFamiliesPage from "./pages/IngredientFamilies/IngredientFamiliesPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Default */}
        <Route path="/" element={<Navigate to="/ingredient-families" />} />

        {/* Ingredient Families */}
        <Route
          path="/ingredient-families"
          element={<IngredientFamiliesPage />}
        />
      </Route>
    </Routes>
  );
}
