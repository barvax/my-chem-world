import { useEffect, useState } from "react";
import { getSolvents } from "../../services/solvents.service";
import { useNavigate } from "react-router-dom";

export default function SolventsOverview() {
  const [solvents, setSolvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const data = await getSolvents();
      setSolvents(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading solvents…</p>;
  }

  if (solvents.length === 0) {
    return <p className="text-slate-500">No solvents defined yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {solvents.map(solvent => (
        <div
          key={solvent.id}
          onClick={() => navigate(`/solvents/edit/${solvent.id}`)}
          className="cursor-pointer bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
        >
        <div className="flex items-center justify-between">
  <div>
    <h3 className="font-semibold">{solvent.name}</h3>
    <p className="text-sm text-slate-500">{solvent.actualSolventName}</p>
  </div>

  <img
    src={solvent.imagePath}

    className="w-12 h-12 object-cover rounded-md"
  />
</div>

          <p className="text-sm text-slate-600 mb-3 line-clamp-3">
            {solvent.description}
          </p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
            <div>Polarity: {solvent.polarityIndex}</div>
            <div>Volatility: {solvent.volatility}</div>
            <div>BP: {solvent.boilingPoint}°C</div>
            <div>FP: {solvent.freezingPoint}°C</div>
            <div>Protic: {solvent.isProtic ? "Yes" : "No"}</div>
            <div>Flammable: {solvent.flammability}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
