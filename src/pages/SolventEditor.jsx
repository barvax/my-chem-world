import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function SolventEditor({ solvent, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    solventType: "",
    polarityIndex: "",
    boilingPoint: "",
    freezingPoint: "",
    volatility: "",
    toxicity: "",
    flammability: "",
    protic: false,
    isExperimental: false
  });

  // Fill form when editing
  useEffect(() => {
    if (solvent) {
      setForm({
        ...form,
        ...solvent
      });
    }
  }, [solvent]);

  function updateField(field, value) {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleSave() {
    const payload = {
      ...form,
      polarityIndex: Number(form.polarityIndex),
      boilingPoint: Number(form.boilingPoint),
      freezingPoint: Number(form.freezingPoint),
      volatility: Number(form.volatility),
      toxicity: Number(form.toxicity),
      flammability: Number(form.flammability),
      updatedAt: serverTimestamp()
    };

    if (solvent?.id) {
      await updateDoc(doc(db, "solvents", solvent.id), payload);
    } else {
      await addDoc(collection(db, "solvents"), {
        ...payload,
        createdAt: serverTimestamp()
      });
    }

    onSaved();
  }

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-slate-800">
          {solvent ? "Edit Solvent" : "Create New Solvent"}
        </h3>
        <p className="text-sm text-slate-500">
          Define physical, chemical and gameplay properties
        </p>
      </div>

      {/* Basic Info */}
      <Section title="Basic Information">
        <Input
          label="Solvent Name"
          value={form.name}
          onChange={v => updateField("name", v)}
        />

        <Select
          label="Solvent Type"
          value={form.solventType}
          onChange={v => updateField("solventType", v)}
          options={[
            { value: "non_polar", label: "Non-Polar" },
            { value: "polar_aprotic", label: "Polar Aprotic" },
            { value: "polar_protic", label: "Polar Protic" }
          ]}
        />

        <Textarea
          label="Description"
          value={form.description || ""}
          onChange={v => updateField("description", v)}
        />
      </Section>

      {/* Physical Properties */}
      <Section title="Physical Properties">
        <NumberInput
          label="Boiling Point (°C)"
          value={form.boilingPoint}
          onChange={v => updateField("boilingPoint", v)}
        />
        <NumberInput
          label="Freezing Point (°C)"
          value={form.freezingPoint}
          onChange={v => updateField("freezingPoint", v)}
        />
        <NumberInput
          label="Volatility (0–100)"
          value={form.volatility}
          onChange={v => updateField("volatility", v)}
        />
      </Section>

      {/* Chemical Properties */}
      <Section title="Chemical Properties">
        <NumberInput
          label="Polarity Index (0–100)"
          value={form.polarityIndex}
          onChange={v => updateField("polarityIndex", v)}
        />
        <Toggle
          label="Protic Solvent"
          checked={form.protic}
          onChange={v => updateField("protic", v)}
        />
      </Section>

      {/* Gameplay Properties */}
      <Section title="Gameplay Properties">
        <NumberInput
          label="Toxicity (0–100)"
          value={form.toxicity}
          onChange={v => updateField("toxicity", v)}
        />
        <NumberInput
          label="Flammability (0–100)"
          value={form.flammability}
          onChange={v => updateField("flammability", v)}
        />
        <Toggle
          label="Experimental Solvent"
          checked={form.isExperimental}
          onChange={v => updateField("isExperimental", v)}
        />
      </Section>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-md bg-slate-900 text-white"
        >
          Save Solvent
        </button>
      </div>

    </div>
  );
}

/* ---------- UI Components ---------- */

function Section({ title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h4 className="text-md font-semibold text-slate-700 mb-5">
        {title}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <Field label={label}>
      <input
        type="text"
        className="input"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </Field>
  );
}

function NumberInput({ label, value, onChange }) {
  return (
    <Field label={label}>
      <input
        type="number"
        className="input"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </Field>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <Field label={label} full>
      <textarea
        rows={4}
        className="input resize-none"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </Field>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <Field label={label}>
      <select
        className="input bg-white"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select…</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center gap-3 mt-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="h-4 w-4 accent-slate-800"
      />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
