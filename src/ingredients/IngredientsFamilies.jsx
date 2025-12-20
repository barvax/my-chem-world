import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function IngredientsFamilies() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadFamilies();
  }, []);

  async function loadFamilies() {
    setLoading(true);
    const snap = await getDocs(collection(db, "ingredientFamilies"));
    setFamilies(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  }

  return (
    <div className="space-y-6">

      {/* Header + Add */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-slate-600 text-sm">
          Ingredient families group raw materials by origin. Tap a family to manage its ingredients.
        </p>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm rounded-md bg-slate-900 text-white whitespace-nowrap"
        >
          + Add Family
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <AddFamilyForm
          onCancel={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            loadFamilies();
          }}
        />
      )}

      {/* List */}
      {loading ? (
        <div className="text-sm text-slate-400">Loading families…</div>
      ) : families.length === 0 ? (
        <div className="bg-white border rounded-xl p-6 text-sm text-slate-500">
          No families found. Add one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {families.map(f => (
            <FamilyCard key={f.id} family={f} />
          ))}
        </div>
      )}

    </div>
  );
}

/* ---------- Components ---------- */

function FamilyCard({ family }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/ingredients/families/${family.id}`)}
      className="text-left bg-white border rounded-xl p-5 space-y-2 hover:border-slate-300 hover:shadow-sm transition"
    >
      <h3 className="font-semibold text-slate-800">{family.name}</h3>
      <p className="text-sm text-slate-600 line-clamp-3">{family.description}</p>
      <div className="text-xs text-slate-400">
        Origin: {family.originType}
      </div>
      <div className="text-xs text-slate-500 pt-2">
        Tap to manage ingredients →
      </div>
    </button>
  );
}

function AddFamilyForm({ onCancel, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    originType: "biological",
    notes: ""
  });
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.name || !form.description) {
      alert("Name and description are required");
      return;
    }

    setSaving(true);
    await addDoc(collection(db, "ingredientFamilies"), {
      ...form,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    setSaving(false);
    onSaved();
  }

  return (
    <div className="bg-white border rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-slate-800">Add Ingredient Family</h3>

      <Input label="Name" value={form.name} onChange={e => update("name", e.target.value)} />
      <Textarea label="Description" value={form.description} onChange={e => update("description", e.target.value)} />

      <Select
        label="Origin Type"
        value={form.originType}
        onChange={e => update("originType", e.target.value)}
        options={[
          { value: "biological", label: "Biological" },
          { value: "mineral", label: "Mineral" },
          { value: "animal", label: "Animal" }
        ]}
      />

      <Textarea label="Notes (optional)" value={form.notes} onChange={e => update("notes", e.target.value)} />

      <div className="flex gap-3 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm rounded-md border">
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
  );
}

/* ---------- UI Helpers ---------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <input className="input w-full" {...props} />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <textarea rows={3} className="input w-full resize-none" {...props} />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
      <select className="input w-full bg-white" {...props}>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
