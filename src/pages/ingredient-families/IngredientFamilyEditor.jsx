import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

const CATEGORY_OPTIONS = [
  { value: "biological", label: "Biological" },
  { value: "mineral", label: "Mineral" },
  { value: "animal", label: "Animal" },
  { value: "synthetic", label: "Synthetic" }
];

export default function IngredientFamilyEditor() {
  const { familyId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(familyId);

  const [form, setForm] = useState({
    worldId: "",
    name: "",
    description: "",
    imagePath: "",
    category: "biological"
  });

  const [loading, setLoading] = useState(isEdit);

  /* Load existing family */
  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      const ref = doc(db, "ingredientFamilies", familyId);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        alert("Family not found");
        navigate("/ingredient-families");
        return;
      }
      setForm(snap.data());
      setLoading(false);
    }

    load();
  }, [familyId, isEdit, navigate]);

  async function handleSave() {
    if (!form.name || !form.worldId) {
      alert("World ID and Name are required");
      return;
    }

    try {
      if (isEdit) {
        await updateDoc(doc(db, "ingredientFamilies", familyId), {
          ...form,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, "ingredientFamilies"), {
          ...form,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      navigate("/ingredient-families");
    } catch (err) {
      console.error(err);
      alert("Failed to save family");
    }
  }

  if (loading) {
    return <div className="text-slate-500">Loading…</div>;
  }

  return (
    <div className="max-w-xl bg-white border rounded-xl p-6 space-y-5">
      <h2 className="text-lg font-semibold">
        {isEdit ? "Edit Ingredient Family" : "Create Ingredient Family"}
      </h2>

      {/* World ID */}
      <Field label="World ID">
        <input
          className="input w-full"
          value={form.worldId}
          disabled={isEdit}
          onChange={e => setForm({ ...form, worldId: e.target.value })}
        />
      </Field>

      {/* Name */}
      <Field label="Name">
        <input
          className="input w-full"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
      </Field>

      {/* Description */}
      <Field label="Description">
        <textarea
          rows={3}
          className="input w-full"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </Field>

      {/* Category */}
      <Field label="Category">
        <select
          className="input w-full bg-white"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        >
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      {/* Image Path */}
      <Field label="Image Path (Storage)">
        <input
          className="input w-full"
          placeholder="ingredient-families/fungi.png"
          value={form.imagePath}
          onChange={e => setForm({ ...form, imagePath: e.target.value })}
        />
      </Field>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => navigate("/ingredient-families")}
          className="px-4 py-2 rounded-md border"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-md bg-slate-900 text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* UI helper */
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
