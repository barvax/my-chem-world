
import { useEffect, useState } from "react";
import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function MoleculeEditor({ molecule, onSaved, onCancel }) {

useEffect(() => {
  if (molecule) {
    setForm(molecule);
  }
}, [molecule]);
async function handleSave() {
  const payload = {
    ...form,
    molarMass: Number(form.molarMass),
    meltingPoint: Number(form.meltingPoint),
    boilingPoint: Number(form.boilingPoint),
    polarityAffinity: Number(form.polarityAffinity),
    hydrogenBonding: Number(form.hydrogenBonding),
    stability: Number(form.stability),
    reactivity: Number(form.reactivity),
    updatedAt: serverTimestamp()
  };

  if (molecule?.id) {
    await updateDoc(doc(db, "molecules", molecule.id), payload);
  } else {
    await addDoc(collection(db, "molecules"), {
      ...payload,
      createdAt: serverTimestamp()
    });
  }

  onSaved?.();
}

  const [form, setForm] = useState({
    name: "",
    actualMoleculeName: "",
    description: "",

    naturalFamilies: [],

    molarMass: "",
    meltingPoint: "",
    boilingPoint: "",

    polarityAffinity: 50,
    hydrogenBonding: 50,
    ionicType: "neutral",

    stability: 50,
    reactivity: 50,

    concentrationRange: "",
    rarity: "common",
    known: true,

    imageUrl: ""
  });

  function updateField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleArrayValue(field, value) {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Create / Edit Molecule
        </h2>
        <p className="text-slate-500 text-sm">
          Define the chemical identity and behavior of a molecule
        </p>
      </div>

      {/* Basic Info */}
      <Section title="Basic Information">
        <Input label="In-Game Name" value={form.name} onChange={v => updateField("name", v)} />
        <Input label="Actual Molecule Name" value={form.actualMoleculeName} onChange={v => updateField("actualMoleculeName", v)} />
        <Textarea label="Description" value={form.description} onChange={v => updateField("description", v)} />
      </Section>

      {/* Natural Origins */}
      <Section title="Natural Origins">
        {["Fungi", "Roots", "Creeping Plants", "Crystals", "Salts"].map(f => (
          <Checkbox
            key={f}
            label={f}
            checked={form.naturalFamilies.includes(f)}
            onChange={() => toggleArrayValue("naturalFamilies", f)}
          />
        ))}
      </Section>

      {/* Physical Properties */}
      <Section title="Physical Properties">
        <NumberInput label="Molar Mass" value={form.molarMass} onChange={v => updateField("molarMass", v)} />
        <NumberInput label="Melting Point (°C)" value={form.meltingPoint} onChange={v => updateField("meltingPoint", v)} />
        <NumberInput label="Boiling Point (°C)" value={form.boilingPoint} onChange={v => updateField("boilingPoint", v)} />
      </Section>

      {/* Solubility */}
      <Section title="Solubility Traits">
        <Range label="Polarity Affinity" value={form.polarityAffinity} onChange={v => updateField("polarityAffinity", v)} />
        <Range label="Hydrogen Bonding" value={form.hydrogenBonding} onChange={v => updateField("hydrogenBonding", v)} />

        <Select
          label="Ionic Type"
          value={form.ionicType}
          onChange={v => updateField("ionicType", v)}
          options={[
            { value: "neutral", label: "Neutral" },
            { value: "ionic", label: "Ionic" }
          ]}
        />
      </Section>

      {/* Stability */}
      <Section title="Stability & Reactivity">
        <Range label="Stability" value={form.stability} onChange={v => updateField("stability", v)} />
        <Range label="Reactivity" value={form.reactivity} onChange={v => updateField("reactivity", v)} />
      </Section>

      {/* Meta */}
      <Section title="Extraction & Meta">
        <Input label="Typical Concentration Range" value={form.concentrationRange} onChange={v => updateField("concentrationRange", v)} />

        <Select
          label="Rarity"
          value={form.rarity}
          onChange={v => updateField("rarity", v)}
          options={[
            { value: "common", label: "Common" },
            { value: "uncommon", label: "Uncommon" },
            { value: "rare", label: "Rare" },
            { value: "legendary", label: "Legendary" }
          ]}
        />

        <Checkbox
          label="Known to player at start"
          checked={form.known}
          onChange={() => updateField("known", !form.known)}
        />
      </Section>

      {/* Visual */}
      <Section title="Visual">
        <Input label="Image URL (optional)" value={form.imageUrl} onChange={v => updateField("imageUrl", v)} />
      </Section>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
  onClick={onCancel}
  className="px-4 py-2 border rounded-md text-slate-600"
>
  Cancel
</button>

      <button
  onClick={handleSave}
  className="px-4 py-2 bg-slate-900 text-white rounded-md"
>
  Save Molecule
</button>

      </div>

    </div>
  );
}

/* ---------- UI Helpers ---------- */

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-xl p-4 space-y-4">
      <h3 className="font-medium text-slate-800">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <Field label={label}>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input"
      />
    </Field>
  );
}

function NumberInput(props) {
  return <Input {...props} />;
}

function Textarea({ label, value, onChange }) {
  return (
    <Field label={label} full>
      <textarea
        rows={4}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input resize-none"
      />
    </Field>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <Field label={label}>
      <select value={value} onChange={e => onChange(e.target.value)} className="input">
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
}

function Range({ label, value, onChange }) {
  return (
    <Field label={`${label}: ${value}`}>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
    </Field>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
