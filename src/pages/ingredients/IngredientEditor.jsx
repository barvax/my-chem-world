import { useEffect, useMemo, useState } from "react";
import { getIngredientFamilies } from "../../services/ingredientFamilies.service";
import { getMolecules } from "../../services/molecules.service";
import { db } from "../../firebase/firebase";

import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";

function numOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function IngredientEditor() {
  const [families, setFamilies] = useState([]);
  const [moleculesCatalog, setMoleculesCatalog] = useState([]);

  const [saving, setSaving] = useState(false);
  const { ingredientId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(ingredientId);

  const [form, setForm] = useState({
    worldId: "",
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

    imagePath: "",

    // ✅ NEW: molecules composition (optional)
    molecules: [] // [{ moleculeWorldId, minWtPercent, maxWtPercent }]
  });

  // Load ingredient (edit)
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

      const data = snap.data();

      setForm((prev) => ({
        ...prev,
        ...data,
        physical: { ...prev.physical, ...(data.physical || {}) },
        gameplay: { ...prev.gameplay, ...(data.gameplay || {}) },
        molecules: Array.isArray(data.molecules) ? data.molecules : []
      }));
    }

    loadIngredient();
  }, [ingredientId, navigate]);

  // Load families + molecules catalog
  useEffect(() => {
    async function load() {
      const fams = await getIngredientFamilies();
      setFamilies(fams);

      // molecules collection (for dropdown)
      try {
        const mols = await getMolecules();
        // prefer worldId sorting
        mols.sort((a, b) =>
          String(a.worldId || a.name || "").localeCompare(String(b.worldId || b.name || ""))
        );
        setMoleculesCatalog(mols);
      } catch (e) {
        console.warn("Failed to load molecules catalog", e);
        setMoleculesCatalog([]);
      }
    }
    load();
  }, []);

  // Helper: update nested paths
  function update(path, value) {
    setForm((prev) => {
      const copy = structuredClone(prev);
      let ref = copy;
      for (let i = 0; i < path.length - 1; i++) {
        ref = ref[path[i]];
      }
      ref[path[path.length - 1]] = value;
      return copy;
    });
  }

  // Molecules UI helpers
  function addMoleculeRow() {
    setForm((prev) => ({
      ...prev,
      molecules: [
        ...(Array.isArray(prev.molecules) ? prev.molecules : []),
        { moleculeWorldId: "", minWtPercent: "", maxWtPercent: "" }
      ]
    }));
  }

  function removeMoleculeRow(index) {
    setForm((prev) => ({
      ...prev,
      molecules: prev.molecules.filter((_, i) => i !== index)
    }));
  }

  function updateMoleculeRow(index, key, value) {
    setForm((prev) => {
      const next = structuredClone(prev);
      next.molecules = Array.isArray(next.molecules) ? next.molecules : [];
      next.molecules[index] = { ...(next.molecules[index] || {}), [key]: value };
      return next;
    });
  }

  const sumMax = useMemo(() => {
    const rows = Array.isArray(form.molecules) ? form.molecules : [];
    let total = 0;

    for (const r of rows) {
      if (!r?.moleculeWorldId) continue;
      const max = numOrNull(r.maxWtPercent);
      if (max !== null) total += max;
    }
    return total;
  }, [form.molecules]);

  async function handleSave() {
    if (saving) return;

    if (!form.worldId || !form.name || !form.familyId) {
      alert("World ID, Name and Family are required");
      return;
    }

    const family = families.find((f) => f.id === form.familyId);
    const familyWorldId = family?.worldId || "";
    if (!familyWorldId) {
      alert("Selected family is missing worldId (fix the family first).");
      return;
    }

    // Normalize + validate molecules
    const rawRows = Array.isArray(form.molecules) ? form.molecules : [];
    const cleaned = [];
    const seen = new Set();
    let sumMaxLocal = 0;

    for (const r of rawRows) {
      const moleculeWorldId = String(r?.moleculeWorldId || "").trim();

      // allow empty rows (ignore)
      if (!moleculeWorldId) continue;

      if (seen.has(moleculeWorldId)) {
        alert(`Duplicate molecule detected: ${moleculeWorldId}`);
        return;
      }
      seen.add(moleculeWorldId);

      const minN = numOrNull(r.minWtPercent);
      const maxN = numOrNull(r.maxWtPercent);

      if (minN === null || maxN === null) {
        alert(`Invalid min/max for molecule: ${moleculeWorldId}`);
        return;
      }
      if (
        minN < 0 ||
        maxN < 0 ||
        minN > 100 ||
        maxN > 100 ||
        minN > maxN
      ) {
        alert(`Range error for molecule ${moleculeWorldId} (min must be <= max, 0–100).`);
        return;
      }

      sumMaxLocal += maxN;

      cleaned.push({
        moleculeWorldId,
        minWtPercent: minN,
        maxWtPercent: maxN
      });
    }

    // Rule: SUM(max) <= 100
    if (sumMaxLocal > 100.0001) {
      alert(`Sum of MAX concentration exceeds 100% (current: ${sumMaxLocal}%).`);
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      familyWorldId,
      molecules: cleaned,
      updatedAt: serverTimestamp()
    };

    try {
      if (isEdit) {
        await updateDoc(doc(db, "ingredients", ingredientId), payload);
      } else {
        await addDoc(collection(db, "ingredients"), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }

      navigate("/ingredients");
    } catch (err) {
      console.error(err);
      alert("Failed to save ingredient");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT – BASIC INFO */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-slate-800">Basic Information</h2>

        <div>
          <label className="label">World ID</label>
          <input
            className="input w-full"
            placeholder="ing_spider_fang"
            value={form.worldId}
            disabled={isEdit}
            onChange={(e) => update(["worldId"], e.target.value)}
          />
        </div>

        <div>
          <label className="label">Ingredient Name</label>
          <input
            className="input w-full"
            value={form.name}
            onChange={(e) => update(["name"], e.target.value)}
          />
        </div>

        <div>
          <label className="label">Family</label>
          <select
            className="input w-full bg-white"
            value={form.familyId}
            onChange={(e) => update(["familyId"], e.target.value)}
          >
            <option value="">Select family…</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Rarity</label>
          <select
            className="input w-full bg-white"
            value={form.rarity}
            onChange={(e) => update(["rarity"], e.target.value)}
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
            onChange={(e) => update(["imagePath"], e.target.value)}
          />
        </div>
      </div>

      {/* CENTER – PHYSICAL PROPERTIES */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-slate-800">Physical Properties</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Moisture (%)</label>
            <input
              type="number"
              className="input w-full"
              value={form.physical.moisture}
              onChange={(e) => update(["physical", "moisture"], e.target.value)}
            />
          </div>

          <div>
            <label className="label">Density</label>
            <select
              className="input w-full bg-white"
              value={form.physical.density}
              onChange={(e) => update(["physical", "density"], e.target.value)}
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
              onChange={(e) => update(["physical", "stability"], e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
              checked={form.physical.organic}
              onChange={(e) => update(["physical", "organic"], e.target.checked)}
            />
            <span className="text-sm text-slate-600">Organic</span>
          </div>
        </div>
      </div>

      {/* RIGHT – GAMEPLAY / EFFECTS */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-slate-800">Gameplay / Effects</h2>

        <div>
          <label className="label">Value</label>
          <input
            type="number"
            className="input w-full"
            value={form.gameplay.value}
            onChange={(e) => update(["gameplay", "value"], e.target.value)}
          />
        </div>

        <div>
          <label className="label">Toxicity</label>
          <input
            type="number"
            className="input w-full"
            value={form.gameplay.toxicity}
            onChange={(e) => update(["gameplay", "toxicity"], e.target.value)}
          />
        </div>

        <div>
          <label className="label">Volatility</label>
          <input
            type="number"
            className="input w-full"
            value={form.gameplay.volatility}
            onChange={(e) => update(["gameplay", "volatility"], e.target.value)}
          />
        </div>
      </div>

      {/* ✅ MOLECULES */}
      <div className="lg:col-span-3 bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Molecules (optional)</h2>
            <p className="text-sm text-slate-500">
              Each molecule has a weight-percent range. Rule: Σ(max) ≤ 100.
            </p>
          </div>

          <button
            type="button"
            onClick={addMoleculeRow}
            className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 active:translate-y-px transition"
          >
            + Add Molecule
          </button>
        </div>

        <div
          className={`text-sm font-medium ${
            sumMax > 100 ? "text-red-600" : "text-slate-600"
          }`}
        >
          Sum of MAX: {Number.isFinite(sumMax) ? sumMax : 0}% (must be ≤ 100%)
        </div>

        <div className="overflow-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-3 py-2">Molecule</th>
                <th className="text-left px-3 py-2 w-32">Min %</th>
                <th className="text-left px-3 py-2 w-32">Max %</th>
                <th className="px-3 py-2 w-14"></th>
              </tr>
            </thead>

            <tbody>
              {(Array.isArray(form.molecules) ? form.molecules : []).length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-slate-400 italic" colSpan={4}>
                    No molecules defined
                  </td>
                </tr>
              ) : (
                form.molecules.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-3 py-2">
                      <select
                        className="input bg-white"
                        value={row.moleculeWorldId || ""}
                        onChange={(e) =>
                          updateMoleculeRow(idx, "moleculeWorldId", e.target.value)
                        }
                      >
                        <option value="">Select molecule…</option>
                        {moleculesCatalog.map((m) => (
                          <option key={m.id} value={m.worldId || ""}>
                            {m.name} {m.worldId ? `(${m.worldId})` : ""}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-3 py-2">
                      <input
                        type="number"
                        className="input"
                        value={row.minWtPercent ?? ""}
                        onChange={(e) =>
                          updateMoleculeRow(idx, "minWtPercent", e.target.value)
                        }
                        placeholder="0"
                      />
                    </td>

                    <td className="px-3 py-2">
                      <input
                        type="number"
                        className="input"
                        value={row.maxWtPercent ?? ""}
                        onChange={(e) =>
                          updateMoleculeRow(idx, "maxWtPercent", e.target.value)
                        }
                        placeholder="0"
                      />
                    </td>

                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeMoleculeRow(idx)}
                        className="text-slate-500 hover:text-red-600"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="lg:col-span-3 bg-white border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Description</h2>
        <textarea
          className="input w-full h-32"
          value={form.description}
          onChange={(e) => update(["description"], e.target.value)}
        />
      </div>

      {/* ACTIONS */}
      <div className="lg:col-span-3 flex justify-end gap-3">
        <button
          onClick={() => navigate("/ingredients")}
          disabled={saving}
          className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 active:translate-y-px transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 active:translate-y-px transition disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Ingredient"}
        </button>
      </div>
    </div>
  );
}
