import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const RARITY_OPTIONS = ["common", "uncommon", "rare", "legendary"];
const DENSITY_OPTIONS = ["low", "medium", "high"];
const DEGRADATION_OPTIONS = ["low", "medium", "high"];

export default function FamilyIngredientsPage() {
  const { familyId } = useParams();

  const [family, setFamily] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);

  async function loadAll() {
    setLoading(true);

    // Load family document
    const famSnap = await getDoc(doc(db, "ingredientFamilies", familyId));
    if (famSnap.exists()) {
      setFamily({ id: famSnap.id, ...famSnap.data() });
    } else {
      setFamily(null);
    }

    // Load ingredients of this family
    const q = query(
      collection(db, "ingredients"),
      where("familyId", "==", familyId)
    );
    const ingSnap = await getDocs(q);
    const list = ingSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Sort client-side by name to avoid index headaches
    list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    setIngredients(list);
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyId]);

  const title = useMemo(() => {
    if (!family) return "Family";
    return family.name || family.id;
  }, [family]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-sm text-slate-400">Loading…</div>
      </div>
    );
  }

  if (!family) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <div className="text-sm text-slate-600">
          Family not found: <span className="font-medium">{familyId}</span>
        </div>
        <Link to="/ingredients" className="text-sm text-slate-900 underline">
          Back to Ingredients
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">

      {/* Breadcrumb */}
      <div className="text-sm text-slate-500">
        <Link to="/ingredients" className="hover:text-slate-700">
          Ingredients
        </Link>{" "}
        <span className="text-slate-400">›</span>{" "}
        <span className="text-slate-700">{title}</span>
      </div>

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-600 text-sm max-w-3xl">
            {family.description}
          </p>
          <div className="text-xs text-slate-400">
            Origin: {family.originType}
          </div>
        </div>

        <button
          onClick={() => {
            setEditingIngredient(null);
            setShowForm(true);
          }}
          className="px-4 py-2 text-sm rounded-md bg-slate-900 text-white whitespace-nowrap"
        >
          + Create Ingredient
        </button>
      </header>

      {/* Form */}
      {showForm && (
        <IngredientForm
          familyId={familyId}
          initial={editingIngredient}
          onCancel={() => {
            setShowForm(false);
            setEditingIngredient(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditingIngredient(null);
            loadAll();
          }}
        />
      )}

      {/* List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">
            Ingredients in {title}
          </h2>
          <div className="text-sm text-slate-500">
            {ingredients.length} total
          </div>
        </div>

        {ingredients.length === 0 ? (
          <div className="bg-white border rounded-xl p-6 text-sm text-slate-500">
            No ingredients yet. Click <span className="font-medium">Create Ingredient</span> to add the first one.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ingredients.map(ing => (
              <IngredientCard
                key={ing.id}
                ingredient={ing}
                onEdit={() => {
                  setEditingIngredient(ing);
                  setShowForm(true);
                }}
                onDelete={async () => {
                  const ok = confirm(`Delete ingredient "${ing.name}"?`);
                  if (!ok) return;
                  await deleteDoc(doc(db, "ingredients", ing.id));
                  loadAll();
                }}
              />
            ))}
          </div>
        )}
      </section>

      <div className="text-xs text-slate-400">
        Molecules are not managed here. They will reference ingredients from the Molecules module.
      </div>
    </div>
  );
}

function IngredientCard({ ingredient, onEdit, onDelete }) {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-slate-800">{ingredient.name}</div>
          <div className="text-xs text-slate-500 mt-1">
            <Badge text={ingredient.rarity || "uncommon"} />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-xs rounded-md border hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1.5 text-xs rounded-md border border-red-200 text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-600 line-clamp-3">
        {ingredient.description}
      </p>

      <div className="text-xs text-slate-500 space-y-1">
        <div>
          Moisture: <span className="font-medium">{ingredient?.physical?.moisture ?? "-"}</span>
        </div>
        <div>
          Density: <span className="font-medium">{ingredient?.physical?.density ?? "-"}</span> ·
          Stability: <span className="font-medium"> {ingredient?.physical?.stability ?? "-"}</span>
        </div>
        <div>
          Heat Sensitivity: <span className="font-medium">{ingredient?.processing?.heatSensitivity ?? "-"}</span> ·
          Degradation: <span className="font-medium"> {ingredient?.processing?.degradationRate ?? "-"}</span>
        </div>
      </div>
    </div>
  );
}

function Badge({ text }) {
  const map = {
    common: "bg-slate-100 text-slate-700",
    uncommon: "bg-emerald-50 text-emerald-700",
    rare: "bg-indigo-50 text-indigo-700",
    legendary: "bg-amber-50 text-amber-800"
  };
  const cls = map[text] || "bg-slate-100 text-slate-700";
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${cls}`}>
      {text}
    </span>
  );
}

/* ---------- Form ---------- */

function IngredientForm({ familyId, initial, onCancel, onSaved }) {
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState(() => ({
    name: initial?.name || "",
    description: initial?.description || "",
    rarity: initial?.rarity || "uncommon",
    physical: {
      moisture: initial?.physical?.moisture ?? 50,
      density: initial?.physical?.density || "medium",
      stability: initial?.physical?.stability ?? 50,
      organic: initial?.physical?.organic ?? true
    },
    processing: {
      heatSensitivity: initial?.processing?.heatSensitivity ?? 50,
      degradationRate: initial?.processing?.degradationRate || "medium",
      notes: initial?.processing?.notes || ""
    }
  }));

  const [saving, setSaving] = useState(false);

  function update(path, value) {
    setForm(prev => {
      const next = structuredClone(prev);
      // path like "physical.moisture"
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  }

  async function handleSave() {
    if (!form.name.trim()) return alert("Name is required");
    if (!form.description.trim()) return alert("Description is required");

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      familyId,
      rarity: form.rarity,
      physical: {
        moisture: Number(form.physical.moisture),
        density: form.physical.density,
        stability: Number(form.physical.stability),
        organic: Boolean(form.physical.organic)
      },
      processing: {
        heatSensitivity: Number(form.processing.heatSensitivity),
        degradationRate: form.processing.degradationRate,
        notes: form.processing.notes || ""
      },
      updatedAt: serverTimestamp()
    };

    try {
      if (isEdit) {
        await updateDoc(doc(db, "ingredients", initial.id), payload);
      } else {
        await addDoc(collection(db, "ingredients"), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      onSaved();
    } catch (e) {
      console.error(e);
      alert("Failed to save ingredient (check Firestore rules/permissions).");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border rounded-xl p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-800">
            {isEdit ? "Edit Ingredient" : "Create Ingredient"}
          </h3>
          <p className="text-sm text-slate-500">
            This form defines the physical and gameplay properties of the ingredient.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-md border"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-md bg-slate-900 text-white"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Core */}
      <Section title="Core">
        <Input
          label="Name"
          value={form.name}
          onChange={e => update("name", e.target.value)}
          placeholder="Creeping Mushroom"
        />
        <Select
          label="Rarity"
          value={form.rarity}
          onChange={e => update("rarity", e.target.value)}
          options={RARITY_OPTIONS.map(x => ({ value: x, label: x }))}
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={e => update("description", e.target.value)}
          placeholder="Describe the ingredient and its lore..."
          full
        />
      </Section>

      {/* Physical */}
      <Section title="Physical">
        <NumberInput
          label="Moisture (0–100)"
          value={form.physical.moisture}
          onChange={e => update("physical.moisture", e.target.value)}
        />
        <Select
          label="Density"
          value={form.physical.density}
          onChange={e => update("physical.density", e.target.value)}
          options={DENSITY_OPTIONS.map(x => ({ value: x, label: x }))}
        />
        <NumberInput
          label="Stability (0–100)"
          value={form.physical.stability}
          onChange={e => update("physical.stability", e.target.value)}
        />
        <Toggle
          label="Organic"
          checked={form.physical.organic}
          onChange={e => update("physical.organic", e.target.checked)}
        />
      </Section>

      {/* Processing */}
      <Section title="Processing & Gameplay">
        <NumberInput
          label="Heat Sensitivity (0–100)"
          value={form.processing.heatSensitivity}
          onChange={e => update("processing.heatSensitivity", e.target.value)}
        />
        <Select
          label="Degradation Rate"
          value={form.processing.degradationRate}
          onChange={e => update("processing.degradationRate", e.target.value)}
          options={DEGRADATION_OPTIONS.map(x => ({ value: x, label: x }))}
        />
        <Textarea
          label="Processing Notes"
          value={form.processing.notes}
          onChange={e => update("processing.notes", e.target.value)}
          placeholder="Hints for players (e.g., sensitive to prolonged heat)..."
          full
        />
      </Section>

      <div className="text-xs text-slate-400">
        Molecules are not assigned here. Molecules will reference ingredient IDs from the Molecules module.
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-slate-700">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label, full, ...props }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <input className="input w-full" {...props} />
    </div>
  );
}

function NumberInput({ label, full, ...props }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <input type="number" className="input w-full" {...props} />
    </div>
  );
}

function Textarea({ label, full, ...props }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <textarea rows={4} className="input w-full resize-none" {...props} />
    </div>
  );
}

function Select({ label, options, full, ...props }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <select className="input w-full bg-white" {...props}>
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-slate-900" />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}
