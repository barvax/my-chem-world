import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

const RARITY_OPTIONS = ["common", "uncommon", "rare", "legendary"];
const IONIC_OPTIONS = ["neutral", "acidic", "basic", "ionic"];

export default function MoleculeEditor() {
  const { moleculeId } = useParams();
  const isEdit = Boolean(moleculeId);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    worldId: "",
    name: "",
    actualMoleculeName: "",
    description: "",

    molarMass: "",
    meltingPoint: "",
    boilingPoint: "",
    polarityAffinity: "",
    hydrogenBonding: "",
    ionicType: "neutral",
    stability: "",
    reactivity: "",

    rarity: "common",
    known: false,
    imageUrl: "",

    // ✅ NEW
    functionalGroups: []
  });

  const [fgInput, setFgInput] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      try {
        const ref = doc(db, "molecules", moleculeId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          alert("Molecule not found");
          navigate("/molecules");
          return;
        }

        const data = snap.data();

        setForm({
          worldId: data.worldId || data.id || "",
          name: data.name || "",
          actualMoleculeName: data.actualMoleculeName || "",
          description: data.description || "",

          molarMass: data.molarMass ?? "",
          meltingPoint: data.meltingPoint ?? "",
          boilingPoint: data.boilingPoint ?? "",
          polarityAffinity: data.polarityAffinity ?? "",
          hydrogenBonding: data.hydrogenBonding ?? "",
          ionicType: data.ionicType || "neutral",
          stability: data.stability ?? "",
          reactivity: data.reactivity ?? "",

          rarity: data.rarity || "common",
          known: Boolean(data.known),
          imageUrl: data.imageUrl || "",

          // ✅ NEW
          functionalGroups: Array.isArray(data.functionalGroups)
            ? data.functionalGroups
            : []
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isEdit, moleculeId, navigate]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function numOrEmpty(v) {
    if (v === "" || v === null || v === undefined) return "";
    const n = Number(v);
    return Number.isFinite(n) ? n : "";
  }

  function addFunctionalGroup(raw) {
    const value = (raw || "").trim();
    if (!value) return;

    setForm((prev) => {
      const exists = prev.functionalGroups.some(
        (x) => String(x).toLowerCase() === value.toLowerCase()
      );
      if (exists) return prev;

      return {
        ...prev,
        functionalGroups: [...prev.functionalGroups, value]
      };
    });

    setFgInput("");
  }

  function removeFunctionalGroup(value) {
    setForm((prev) => ({
      ...prev,
      functionalGroups: prev.functionalGroups.filter((x) => x !== value)
    }));
  }

  function onFgKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addFunctionalGroup(fgInput);
    }
  }

  async function handleSave() {
    if (saving) return;

    if (!form.worldId || !form.name) {
      alert("World ID and Name are required");
      return;
    }

    setSaving(true);

    const payload = {
      worldId: form.worldId,
      name: form.name,
      actualMoleculeName: form.actualMoleculeName || "",
      description: form.description || "",

      molarMass: numOrEmpty(form.molarMass),
      meltingPoint: numOrEmpty(form.meltingPoint),
      boilingPoint: numOrEmpty(form.boilingPoint),
      polarityAffinity: numOrEmpty(form.polarityAffinity),
      hydrogenBonding: numOrEmpty(form.hydrogenBonding),
      ionicType: form.ionicType || "neutral",
      stability: numOrEmpty(form.stability),
      reactivity: numOrEmpty(form.reactivity),

      rarity: form.rarity || "common",
      known: Boolean(form.known),
      imageUrl: form.imageUrl || "",

      // ✅ NEW
      functionalGroups: Array.isArray(form.functionalGroups)
        ? form.functionalGroups
        : [],

      updatedAt: serverTimestamp()
    };

    try {
      if (isEdit) {
        await updateDoc(doc(db, "molecules", moleculeId), payload);
      } else {
        await addDoc(collection(db, "molecules"), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }

      navigate("/molecules");
    } catch (err) {
      console.error(err);
      alert("Failed to save molecule");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-slate-500">Loading…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {isEdit ? "Edit Molecule" : "Create Molecule"}
        </h2>
        <p className="text-sm text-slate-500">
          Define molecule properties used inside Ingredients.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic */}
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <h3 className="text-lg font-semibold text-slate-800">Basic</h3>

          <div>
            <label className="label">World ID</label>
            <input
              className="input"
              value={form.worldId}
              onChange={(e) => set("worldId", e.target.value)}
              placeholder="molecule_glow_alkaloid"
              disabled={isEdit}
            />
          </div>

          <div>
            <label className="label">Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Glow Alkaloid"
            />
          </div>

          <div>
            <label className="label">Actual Molecule Name</label>
            <input
              className="input"
              value={form.actualMoleculeName}
              onChange={(e) => set("actualMoleculeName", e.target.value)}
              placeholder="Psilocybin"
            />
          </div>

          <div>
            <label className="label">Image URL</label>
            <input
              className="input"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="/images/molecules/..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
              checked={form.known}
              onChange={(e) => set("known", e.target.checked)}
            />
            <span className="text-sm text-slate-700">Known</span>
          </div>
        </div>

        {/* Properties */}
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <h3 className="text-lg font-semibold text-slate-800">Properties</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Molar Mass</label>
              <input
                type="number"
                className="input"
                value={form.molarMass}
                onChange={(e) => set("molarMass", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Melting Point</label>
              <input
                type="number"
                className="input"
                value={form.meltingPoint}
                onChange={(e) => set("meltingPoint", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Boiling Point</label>
              <input
                type="number"
                className="input"
                value={form.boilingPoint}
                onChange={(e) => set("boilingPoint", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Polarity Affinity</label>
              <input
                type="number"
                className="input"
                value={form.polarityAffinity}
                onChange={(e) => set("polarityAffinity", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Hydrogen Bonding</label>
              <input
                type="number"
                className="input"
                value={form.hydrogenBonding}
                onChange={(e) => set("hydrogenBonding", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Ionic Type</label>
              <select
                className="input bg-white"
                value={form.ionicType}
                onChange={(e) => set("ionicType", e.target.value)}
              >
                {IONIC_OPTIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Stability</label>
              <input
                type="number"
                className="input"
                value={form.stability}
                onChange={(e) => set("stability", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Reactivity</label>
              <input
                type="number"
                className="input"
                value={form.reactivity}
                onChange={(e) => set("reactivity", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Extra */}
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <h3 className="text-lg font-semibold text-slate-800">Extra</h3>

          <div>
            <label className="label">Rarity</label>
            <select
              className="input bg-white"
              value={form.rarity}
              onChange={(e) => set("rarity", e.target.value)}
            >
              {RARITY_OPTIONS.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          {/* ✅ NEW: functionalGroups multi-select (free tags) */}
          <div className="space-y-2">
            <label className="label">Functional Groups (multi)</label>

            <div className="flex gap-2">
              <input
                className="input"
                value={fgInput}
                onChange={(e) => setFgInput(e.target.value)}
                onKeyDown={onFgKeyDown}
                placeholder='Type and press Enter (e.g. "amine", "alcohol")'
              />
              <button
                type="button"
                onClick={() => addFunctionalGroup(fgInput)}
                className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 active:translate-y-px transition"
              >
                Add
              </button>
            </div>

            {form.functionalGroups?.length ? (
              <div className="flex flex-wrap gap-2">
                {form.functionalGroups.map((g) => (
                  <span
                    key={g}
                    className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700"
                  >
                    {g}
                    <button
                      type="button"
                      onClick={() => removeFunctionalGroup(g)}
                      className="text-slate-500 hover:text-slate-900"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">No functional groups</div>
            )}
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              rows={8}
              className="input"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short notes..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("/molecules")}
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
          {saving ? "Saving..." : isEdit ? "Save Molecule" : "Create Molecule"}
        </button>
      </div>
    </div>
  );
}
