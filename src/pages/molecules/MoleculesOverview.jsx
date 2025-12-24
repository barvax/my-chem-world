import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MoleculeCard from "./MoleculeCard";
import MoleculeModal from "./MoleculeModal";
import { deleteMolecule, getMolecules } from "../../services/molecules.service";

export default function MoleculesOverview() {
  const [molecules, setMolecules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const data = await getMolecules();
      setMolecules(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDelete(moleculeDocId) {
    const ok = window.confirm("Are you sure you want to delete this molecule?");
    if (!ok) return;

    await deleteMolecule(moleculeDocId);
    setMolecules((prev) => prev.filter((m) => m.id !== moleculeDocId));

    if (selected?.id === moleculeDocId) setSelected(null);
  }

  if (loading) return <p className="text-slate-500">Loading molecules…</p>;
  if (!molecules.length) return <p className="text-slate-500">No molecules yet.</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {molecules.map((m) => (
          <MoleculeCard
            key={m.id}
            molecule={m}
           onOpen={() => navigate(`/molecules/view/${m.id}`)}
            onEdit={() => navigate(`/molecules/edit/${m.id}`)}
            onDelete={() => handleDelete(m.id)}
          />
        ))}
      </div>

      <MoleculeModal molecule={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
