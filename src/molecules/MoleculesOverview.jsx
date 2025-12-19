import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default function MoleculesOverview({ onCreate, onEdit }) {
  const [molecules, setMolecules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMolecules();
  }, []);
async function handleDelete(molecule) {
  const ok = window.confirm(
    `Are you sure you want to delete "${molecule.name}"?`
  );

  if (!ok) return;

  await deleteDoc(doc(db, "molecules", molecule.id));

  setMolecules(prev =>
    prev.filter(m => m.id !== molecule.id)
  );
}

  async function loadMolecules() {
    const snap = await getDocs(collection(db, "molecules"));
    setMolecules(
      snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    );
    setLoading(false);
  }

  if (loading) {
    return <div className="text-slate-500">Loading molecules…</div>;
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Molecules</h2>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-slate-900 text-white rounded-md"
        >
          + Create Molecule
        </button>
      </div>

   <div className="space-y-4">
  {molecules.map(m => (
    <div
      key={m.id}
      className="border rounded-xl p-4 space-y-3 bg-white"
    >

      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="text-lg font-semibold text-slate-900">
            {m.name}
          </div>
          <div className="text-sm text-slate-500">
            {m.actualMoleculeName || "—"}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(m)}
            className="px-3 py-1 text-sm border rounded-md"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(m)}
            className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Description */}
      {m.description && (
        <p className="text-sm text-slate-700">
          {m.description}
        </p>
      )}

      {/* Meta grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">

        <Field label="Natural Families">
          {m.naturalFamilies?.join(", ") || "—"}
        </Field>

        <Field label="Rarity">
          {m.rarity}
        </Field>

        <Field label="Molar Mass">
          {m.molarMass}
        </Field>

        <Field label="Melting Point">
          {m.meltingPoint} °C
        </Field>

        <Field label="Boiling Point">
          {m.boilingPoint} °C
        </Field>

        <Field label="Polarity Affinity">
          {m.polarityAffinity}
        </Field>

        <Field label="Hydrogen Bonding">
          {m.hydrogenBonding}
        </Field>

        <Field label="Ionic Type">
          {m.ionicType}
        </Field>

        <Field label="Stability">
          {m.stability}
        </Field>

        <Field label="Reactivity">
          {m.reactivity}
        </Field>

        <Field label="Concentration Range">
          {m.concentrationRange || "—"}
        </Field>

        <Field label="Known">
          {m.known ? "Yes" : "No"}
        </Field>

      </div>
    </div>
  ))}

  {molecules.length === 0 && (
    <div className="text-slate-500">
      No molecules defined yet.
    </div>
  )}
</div>


    </div>
  );
}
function Field({ label, children }) {
  return (
    <div>
      <span className="font-medium">{label}:</span>{" "}
      <span>{children}</span>
    </div>
  );
}
