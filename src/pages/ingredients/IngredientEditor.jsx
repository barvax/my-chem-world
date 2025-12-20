import { useEffect, useState } from "react";
import { getIngredientFamilies } from "../../services/ingredientFamilies.service";
import { db } from "../../firebase/firebase";

import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";


export default function IngredientEditor() {
  const [families, setFamilies] = useState([]);
const [saving, setSaving] = useState(false);
const { ingredientId } = useParams();
const navigate = useNavigate();

const isEdit = Boolean(ingredientId);

  const [form, setForm] = useState({
    name: "",
    familyId: "",
    rarity: "common",
    description: "",

    physical: {
      moisture: "",
      density: "",
      stability: "",
      organic: false
    },

    gameplay: {
      value: "",
      toxicity: "",
      volatility: ""
    },

    imagePath: ""
  });
useEffect(() => {
  if (!ingredientId) return;

  async function loadIngredient() {
    const ref = doc(db, "ingredients", ingredientId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("Ingredient not found");
      navigate("/ingredients");
      return;
    }

    setForm(snap.data());
  }

  loadIngredient();
}, [ingredientId, navigate]);

  useEffect(() => {
    async function load() {
      const data = await getIngredientFamilies();
      setFamilies(data);
    }
    load();
  }, []);
async function handleSave() {
  if (!form.name || !form.familyId) {
    alert("Name and family are required");
    return;
  }

  const payload = {
    ...form,
    updatedAt: serverTimestamp()
  };

  if (isEdit) {
    await updateDoc(doc(db, "ingredients", ingredientId), payload);
  } else {
    await addDoc(collection(db, "ingredients"), {
      ...payload,
      createdAt: serverTimestamp()
    });
  }

  navigate("/ingredients");
}


  function update(path, value) {
    setForm(prev => {
      const copy = structuredClone(prev);
      let ref = copy;
      for (let i = 0; i < path.length - 1; i++) {
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return copy;
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* LEFT – BASIC INFO */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Basic Information
        </h2>

        <div>
          <label className="label">Ingredient Name</label>
          <input
            className="input w-full"
            value={form.name}
            onChange={e => update(["name"], e.target.value)}
          />
        </div>

        <div>
          <label className="label">Family</label>
          <select
            className="input w-full"
            value={form.familyId}
            onChange={e => update(["familyId"], e.target.value)}
          >
            <option value="">Select family…</option>
            {families.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Rarity</label>
          <select
            className="input w-full"
            value={form.rarity}
            onChange={e => update(["rarity"], e.target.value)}
          >
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>

        <div>
          <label className="label">Image Path</label>
          <input
            className="input w-full"
            placeholder="/images/ingredients/ironroot.png"
            value={form.imagePath}
            onChange={e => update(["imagePath"], e.target.value)}
          />
        </div>
      </div>

      {/* CENTER – PHYSICAL PROPERTIES */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Physical Properties
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Moisture (%)</label>
            <input
              type="number"
              className="input w-full"
              value={form.physical.moisture}
              onChange={e => update(["physical","moisture"], e.target.value)}
            />
          </div>

          <div>
            <label className="label">Density</label>
            <select
              className="input w-full"
              value={form.physical.density}
              onChange={e => update(["physical","density"], e.target.value)}
            >
              <option value="">—</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="label">Stability</label>
            <input
              type="number"
              className="input w-full"
              value={form.physical.stability}
              onChange={e => update(["physical","stability"], e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={form.physical.organic}
              onChange={e => update(["physical","organic"], e.target.checked)}
            />
            <span className="text-sm text-slate-600">Organic</span>
          </div>
        </div>
      </div>

      {/* RIGHT – GAMEPLAY / EFFECTS */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Gameplay / Effects
        </h2>

        <div>
          <label className="label">Value</label>
          <input
            type="number"
            className="input w-full"
            value={form.gameplay.value}
            onChange={e => update(["gameplay","value"], e.target.value)}
          />
        </div>

        <div>
          <label className="label">Toxicity</label>
          <input
            type="number"
            className="input w-full"
            value={form.gameplay.toxicity}
            onChange={e => update(["gameplay","toxicity"], e.target.value)}
          />
        </div>

        <div>
          <label className="label">Volatility</label>
          <input
            type="number"
            className="input w-full"
            value={form.gameplay.volatility}
            onChange={e => update(["gameplay","volatility"], e.target.value)}
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="lg:col-span-3 bg-white border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Description
        </h2>
        <textarea
          className="input w-full h-32"
          value={form.description}
          onChange={e => update(["description"], e.target.value)}
        />
      </div>

      {/* ACTIONS */}
      <div className="lg:col-span-3 flex justify-end gap-3">
        <button className="btn-secondary">Cancel</button>
      <button
  onClick={handleSave}
  disabled={saving}
  className={`btn-primary ${saving ? "opacity-60 cursor-not-allowed" : ""}`}
>
  {saving ? "Saving..." : "Save Ingredient"}
</button>

      </div>

    </div>
  );
}
