import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

/**
 * SolventsOverview
 * Displays all solvents from Firestore
 * Allows edit and delete actions
 */
export default function SolventsOverview({ onEdit }) {
  const [solvents, setSolvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolvents();
  }, []);

  async function fetchSolvents() {
    try {
      const snapshot = await getDocs(collection(db, "solvents"));
      const data = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setSolvents(data);
    } catch (error) {
      console.error("Failed to load solvents:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this solvent?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "solvents", id));
      setSolvents(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Failed to delete solvent:", error);
    }
  }

  if (loading) {
    return <LoadingState />;
  }

  if (solvents.length === 0) {
    return <EmptyState />;
  }

  return (
    <SolventsTable
      solvents={solvents}
      onEdit={onEdit}
      onDelete={handleDelete}
    />
  );
}

/* =======================
   UI STATES
======================= */

function LoadingState() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 text-slate-500">
      Loading solvents...
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 text-slate-600">
      No solvents defined yet.
    </div>
  );
}

/* =======================
   TABLE
======================= */

function SolventsTable({ solvents, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Polarity</Th>
              <Th>Boiling °C</Th>
              <Th>Toxicity</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>

          <tbody>
            {solvents.map(solvent => (
              <tr key={solvent.id} className="border-t">
                <Td>{solvent.name || "-"}</Td>
                <Td>{formatType(solvent.solventType)}</Td>
                <Td>{solvent.polarityIndex ?? "-"}</Td>
                <Td>{solvent.boilingPoint ?? "-"}</Td>
                <Td>{solvent.toxicity ?? "-"}</Td>
                <Td>
                  {solvent.isExperimental ? "Experimental" : "Stable"}
                </Td>
                <Td>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(solvent)}
                      className="text-slate-700 underline hover:text-slate-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(solvent.id)}
                      className="text-red-600 underline hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

/* =======================
   TABLE HELPERS
======================= */

function Th({ children }) {
  return (
    <th className="px-4 py-3 text-left font-medium">
      {children}
    </th>
  );
}

function Td({ children }) {
  return (
    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
      {children}
    </td>
  );
}

function formatType(type) {
  if (!type) return "-";
  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}
