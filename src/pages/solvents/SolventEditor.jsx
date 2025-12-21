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

const SOLVENT_TYPE_OPTIONS = [
  { value: "polar_protic", label: "Polar protic" },
  { value: "polar_aprotic", label: "Polar aprotic" },
  { value: "non_polar", label: "Non-polar" }
];

export default function SolventEditor() {
  const { solventId } = useParams();
  const isEdit = Boolean(solventId);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    worldId: "",
    name: "",
    actualSolventName: "",
    solventType: "polar_protic",
    description: "",
    imagePath: "",

    polarityIndex: "",
    volatility: "",
    toxicity: "",
    flammability: "",
    boilingPoint: "",
    freezingPoint: "",

    isProtic: false,
    isExperimental: false
  });

  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      try {
        const ref = doc(db, "solvents", solventId);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          alert("Solvent not found");
          navigate("/solvents");
          return;
        }

        const data = snap.data();
        setForm({
          worldId: data.worldId ?? "",
          name: data.name ?? "",
          actualSolventName: data.actualSolventName ?? "",
          solventType: data.solventType ?? "polar_protic",
          description: data.description ?? "",
          imagePath: data.imagePath ?? "",

          polarityIndex: data.polarityIndex ?? "",
          volatility: data.volatility ?? "",
          toxicity: data.toxicity ?? "",
          flammability: data.flammability ?? "",
          boilingPoint: data.boilingPoint ?? "",
          freezingPoint: data.freezingPoint ?? "",

          isProtic: Boolean(data.isProtic),
          isExperimental: Boolean(data.isExperimental)
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isEdit, navigate, solventId]);

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toNumberOrEmpty(v) {
    if (v === "" || v === null || v === undefined) return "";
    const n = Number(v);
    return Number.isFinite(n) ? n : "";
  }

  async function handleSave() {
    if (saving) return;

    if (!form.name) {
      alert("Name is required");
      return;
    }

    setSaving(true);

    const payload = {
      worldId: form.worldId || "",
      name: form.name,
      actualSolventName: form.actualSolventName || "",
      solventType: form.solventType || "polar_protic",
      description: form.description || "",
      imagePath: form.imagePath || "",

      polarityIndex: toNumberOrEmpty(form.polarityIndex),
      volatility: toNumberOrEmpty(form.volatility),
      toxicity: toNumberOrEmpty(form.toxicity),
      flammability: toNumberOrEmpty(form.flammability),
      boilingPoint: toNumberOrEmpty(form.boilingPoint),
      freezingPoint: toNumberOrEmpty(form.freezingPoint),

      isProtic: Boolean(form.isProtic),
      isExperimental: Boolean(form.isExperimental),
      updatedAt: serverTimestamp()
    };

    try {
      if (isEdit) {
        await updateDoc(doc(db, "solvents", solventId), payload);
      } else {
        await addDoc(collection(db, "solvents"), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }

      navigate("/solvents");
    } catch (err) {
      console.error(err);
      alert("Failed to save solvent");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-slate-500">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {isEdit ? "Edit Solvent" : "Create Solvent"}
        </h2>
        <p className="text-sm text-slate-500">
          Define solvent properties for extraction, reactions and purification.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic */}
        <div className="card p-6 space-y-5">
          <h3 className="text-lg font-semibold text-slate-800">Basic</h3>

          <div>
            <label className="label">World ID</label>
            <input
              className="input"
              value={form.worldId}
              disabled={isEdit && Boolean(form.worldId)}
              onChange={(e) => set("worldId", e.target.value)}
              placeholder="solvent_methanol"
            />
          </div>

          <div>
            <label className="label">Display Name</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Spirit of Ashes"
            />
          </div>

          <div>
            <label className="label">Actual Solvent Name</label>
            <input
              className="input"
              value={form.actualSolventName}
              onChange={(e) => set("actualSolventName", e.target.value)}
              placeholder="Methanol"
            />
          </div>

          <div>
            <label className="label">Solvent Type</label>
            <select
              className="input bg-white"
              value={form.solventType}
              onChange={(e) => set("solventType", e.target.value)}
            >
              {SOLVENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Image Path</label>
            <input
              className="input"
              value={form.imagePath}
              onChange={(e) => set("imagePath", e.target.value)}
              placeholder="/images/solvents/methanol.png"
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
                checked={form.isProtic}
                onChange={(e) => set("isProtic", e.target.checked)}
              />
              Protic
            </label>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
                checked={form.isExperimental}
                onChange={(e) => set("isExperimental", e.target.checked)}
              />
              Experimental
            </label>
          </div>
        </div>

        {/* Numbers */}
        <div className="card p-6 space-y-5">
          <h3 className="text-lg font-semibold text-slate-800">Properties</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Polarity Index</label>
              <input
                type="number"
                className="input"
                value={form.polarityIndex}
                onChange={(e) => set("polarityIndex", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Volatility</label>
              <input
                type="number"
                className="input"
                value={form.volatility}
                onChange={(e) => set("volatility", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Toxicity</label>
              <input
                type="number"
                className="input"
                value={form.toxicity}
                onChange={(e) => set("toxicity", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Flammability</label>
              <input
                type="number"
                className="input"
                value={form.flammability}
                onChange={(e) => set("flammability", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Boiling Point (°C)</label>
              <input
                type="number"
                className="input"
                value={form.boilingPoint}
                onChange={(e) => set("boilingPoint", e.target.value)}
              />
            </div>

            <div>
              <label className="label">Freezing Point (°C)</label>
              <input
                type="number"
                className="input"
                value={form.freezingPoint}
                onChange={(e) => set("freezingPoint", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card p-6 space-y-5">
          <h3 className="text-lg font-semibold text-slate-800">Description</h3>
          <div>
            <label className="label">Notes</label>
            <textarea
              rows={10}
              className="input"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Short lore / usage notes..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("/solvents")}
          disabled={saving}
          className={
            "px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 active:translate-y-px transition " +
            (saving ? "opacity-60" : "")
          }
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className={
            "px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 active:translate-y-px transition " +
            (saving ? "opacity-60" : "")
          }
        >
          {saving ? "Saving..." : isEdit ? "Save Solvent" : "Create Solvent"}
        </button>
      </div>
    </div>
  );
}
