// src/pages/molecules/MoleculeSheet.jsx
// Route:
// <Route path="/molecules/view/:id" element={<MoleculeSheet />} />

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";

const SOLUBILITY_LABELS = {
  VERY_HIGH: "Very High",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  VERY_LOW: "Very Low",
  ALMOST_NONE: "Almost None"
};

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function toNumberOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function normalizeSolventRow(raw) {
  const worldId = String(raw.worldId || raw.id || "").trim();
  const name = String(raw.name || raw.label || raw.solventName || "").trim();
  const polarityIndex = toNumberOrNull(
    raw.polarityIndex ?? raw.polarity ?? raw.polarity_score
  );
  const solventType = String(raw.solventType || raw.type || "").trim();
  const isProtic = Boolean(raw.isProtic ?? raw.protic ?? raw.is_protic);

  return { worldId, name, polarityIndex, solventType, isProtic };
}

function estimateSolubilityScore(molecule, solvent) {
  // Simple heuristic (0–100). You can tweak later.
  const molPol = toNumberOrNull(molecule?.polarityAffinity) ?? 50;
  const molHB = toNumberOrNull(molecule?.hydrogenBonding) ?? 50;

  const solPol = toNumberOrNull(solvent?.polarityIndex) ?? 50;
  const solProtic = Boolean(solvent?.isProtic);

  let score = 100 - Math.abs(solPol - molPol);

  if (solProtic) score += (molHB - 50) * 0.15;
  else score -= (molHB - 50) * 0.08;

  const t = String(solvent?.solventType || "").toLowerCase();
  if (t.includes("polar")) score += (molPol - 50) * 0.08;
  if (t.includes("non-polar") || t.includes("nonpolar")) score -= (molPol - 50) * 0.08;

  return clamp(Math.round(score), 0, 100);
}

function scoreToLabel(score) {
  if (score >= 85) return SOLUBILITY_LABELS.VERY_HIGH;
  if (score >= 70) return SOLUBILITY_LABELS.HIGH;
  if (score >= 55) return SOLUBILITY_LABELS.MEDIUM;
  if (score >= 40) return SOLUBILITY_LABELS.LOW;
  if (score >= 25) return SOLUBILITY_LABELS.VERY_LOW;
  return SOLUBILITY_LABELS.ALMOST_NONE;
}

export default function MoleculeSheet() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [molecule, setMolecule] = useState(null);
  const [solvents, setSolvents] = useState([]);
  const [error, setError] = useState("");

  // You said you'll fill Found In manually — keep it local for now.
  const [foundInText, setFoundInText] = useState(
    "- Moist mushrooms (low → medium conc.)\n- Bat blood (high conc.)\n- Certain cacti (low conc.)"
  );

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const snap = await getDoc(doc(db, "molecules", id));
        if (!snap.exists()) throw new Error("Molecule not found.");
        const m = { id: snap.id, ...snap.data() };

        const solSnap = await getDocs(collection(db, "solvents"));
        const sols = solSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        if (!alive) return;
        setMolecule(m);
        setSolvents(sols);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError(e?.message || "Failed to load molecule sheet.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id]);

  const solventRows = useMemo(() => {
    const rows = (solvents || [])
      .map((remap) => normalizeSolventRow(remap))
      .filter((s) => s.name || s.worldId);

    rows.sort((a, b) => {
      const ap = a.polarityIndex ?? 9999;
      const bp = b.polarityIndex ?? 9999;
      if (ap !== bp) return ap - bp;
      return (a.name || "").localeCompare(b.name || "");
    });

    return rows;
  }, [solvents]);

  const solubilityTable = useMemo(() => {
    if (!molecule) return [];
    return solventRows.map((s) => {
      const score = estimateSolubilityScore(molecule, s);
      return { ...s, score, solubility: scoreToLabel(score) };
    });
  }, [molecule, solventRows]);

  const topSolubility = useMemo(() => {
    const arr = [...solubilityTable];
    arr.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return arr.slice(0, 4);
  }, [solubilityTable]);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!molecule) return <p className="text-slate-500">No molecule.</p>;

  const title = molecule?.name || molecule?.worldId || "Molecule";
  const description =
    molecule?.description?.trim() ||
    "A clear, elusive essence that clings to air and skin alike—bright in scent, swift to wander, and stubbornly reluctant to mingle with waters.";
  const imageUrl = molecule?.imageUrl?.trim();

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-100 py-8 px-4">
      {/* Self-contained vintage fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Cinzel:wght@500;600;700&display=swap');

        .cw-parchment {
          font-family: "IM Fell English", ui-serif, Georgia, serif;
        }
        .cw-title {
          font-family: "Cinzel", ui-serif, Georgia, serif;
          letter-spacing: 0.02em;
        }
      `}</style>

      {/* 1024x1024 CARD */}
      <div
        className="cw-parchment mx-auto w-full max-w-[1024px] aspect-square rounded-2xl border border-slate-300 shadow-sm overflow-hidden relative"
        style={{
          backgroundImage: "url('/images/parchment-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* vignette + paper glaze */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/5" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 55%, rgba(0,0,0,0.12) 100%)"
            }}
          />
          <div className="absolute inset-6 rounded-xl border border-slate-800/20" />
          <div className="absolute inset-10 rounded-lg border border-slate-800/10" />
        </div>

        {/* CONTENT */}
        <div className="relative h-full p-5 md:p-6">
          {/* HEADER */}
          <div className="text-center">
            <div className="cw-title text-4xl md:text-5xl font-semibold text-slate-900">
              {title}
            </div>
            <div className="mt-1 text-sm text-slate-800/80">
              <span>
                Actual:{" "}
                <b>{molecule?.actualMoleculeName ? molecule.actualMoleculeName : "—"}</b>
              </span>
              {molecule?.worldId ? (
                <span className="ml-4">
                  World ID: <b>{molecule.worldId}</b>
                </span>
              ) : null}
            </div>
          </div>

          {/* TOP SECTION */}
          <div className="mt-4 grid grid-cols-12 gap-4">
            {/* ART */}
            <div className="col-span-12 lg:col-span-4">
              <div className="rounded-xl border border-slate-800/20 bg-white/15 p-3">
                <div className="aspect-square rounded-lg border border-slate-800/20 overflow-hidden bg-white/20 flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-slate-700/70 text-sm">(imageUrl missing)</div>
                  )}
                </div>
              </div>
            </div>

            {/* DESC + PROPS */}
            <div className="col-span-12 lg:col-span-8">
              <div className="rounded-xl border border-slate-800/20 bg-white/12 p-4">
                {/* Description area with safe max-height (scroll inside if needed) */}
                <div className="max-h-[120px] overflow-auto pr-2">
                  <p className="text-slate-900 leading-snug text-[16px]">
                    {description}
                  </p>
                </div>

                {/* PROPERTIES */}
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <Prop label="Molar Mass" value={molecule.molarMass} suffix="g/mol" />
                  <Prop label="Melting Point" value={molecule.meltingPoint} suffix="°C" />
                  <Prop label="Boiling Point" value={molecule.boilingPoint} suffix="°C" />
                  <Prop label="Ionic Type" value={molecule.ionicType || "neutral"} />

                  <Prop label="Polarity Affinity" value={molecule.polarityAffinity} />
                  <Prop label="Hydrogen Bonding" value={molecule.hydrogenBonding} />
                  <Prop label="Stability" value={molecule.stability} />
                  <Prop label="Reactivity" value={molecule.reactivity} />

                  <Prop label="Rarity" value={molecule.rarity || "common"} />
                  <Prop label="Known" value={molecule.known ? "true" : "false"} />
                  <Prop
                    label="Functional Groups"
                    value={
                      Array.isArray(molecule.functionalGroups)
                        ? (molecule.functionalGroups.length ? molecule.functionalGroups.join(", ") : "—")
                        : "—"
                    }
                  />
                  <Prop label="Smell" value={molecule.smell || "—"} />

                  <Prop label="Color" value={molecule.color || "—"} />
                  <Prop label="Taste" value={molecule.taste || "—"} />
                </div>
              </div>
            </div>
          </div>

          {/* MID SECTION */}
          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-6">
              <Box title="Found In" compact>
                <textarea
                  className="w-full h-24 text-[14px] text-slate-900 bg-white/20 border border-slate-800/20 rounded-lg p-3 outline-none focus:ring-2 focus:ring-slate-900/20"
                  value={foundInText}
                  onChange={(e) => setFoundInText(e.target.value)}
                />
              </Box>
            </div>

            <div className="col-span-12 lg:col-span-6">
              <Box title="Extra" compact>
                <div className="grid grid-cols-1 gap-1 text-[14px] text-slate-900">
                  <Row label="Color" value={molecule.color || "—"} />
                  <Row label="Smell" value={molecule.smell || "—"} />
                  <Row label="Taste" value={molecule.taste || "—"} />
                </div>
              </Box>
            </div>
          </div>

          {/* BOTTOM SECTION (table always visible) */}
          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4">
              <Box title="Solubility (Top)" compact>
                {topSolubility.length ? (
                  <ul className="list-disc pl-5 text-slate-900 space-y-1 text-[14px]">
                    {topSolubility.map((s) => (
                      <li key={s.worldId || s.name}>
                        <b>{s.name || s.worldId}</b> — {s.solubility}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-800/75 text-sm">No solvents found.</p>
                )}
              </Box>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <Box title="Solubility Table" compact>
                {/* fixed height inside the 1024x1024 sheet */}
                <div className="max-h-[260px] overflow-auto rounded-lg border border-slate-800/20 bg-white/10">
                  <table className="min-w-[760px] w-full text-xs">
                    <thead className="bg-white/25 sticky top-0 z-10">
                      <tr className="text-left text-slate-900">
                        <th className="px-3 py-2 border-b border-slate-800/15">Solvent (In-Game)</th>
                        <th className="px-3 py-2 border-b border-slate-800/15">Polarity</th>
                        <th className="px-3 py-2 border-b border-slate-800/15">Type</th>
                        <th className="px-3 py-2 border-b border-slate-800/15">Protic</th>
                        <th className="px-3 py-2 border-b border-slate-800/15">Solubility</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solubilityTable.map((s) => (
                        <tr key={s.worldId || s.name} className="text-slate-900">
                          <td className="px-3 py-2 border-b border-slate-800/10 font-semibold">
                            {s.name || s.worldId || "—"}
                          </td>
                          <td className="px-3 py-2 border-b border-slate-800/10">
                            {s.polarityIndex ?? "—"}
                          </td>
                          <td className="px-3 py-2 border-b border-slate-800/10">
                            {s.solventType || "—"}
                          </td>
                          <td className="px-3 py-2 border-b border-slate-800/10">
                            {String(Boolean(s.isProtic))}
                          </td>
                          <td className="px-3 py-2 border-b border-slate-800/10">
                            {s.solubility}
                          </td>
                        </tr>
                      ))}
                      {!solubilityTable.length ? (
                        <tr>
                          <td className="px-3 py-3 text-slate-800/75" colSpan={5}>
                            No solvents found in Firestore collection <b>solvents</b>.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>

                <div className="mt-2 text-center text-[11px] text-slate-900/60">
                  Auto-estimated solubility (rule-based). You can replace later with explicit values.
                </div>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Box({ title, children, compact }) {
  return (
    <div
      className={[
        "rounded-xl border border-slate-800/20 bg-white/12",
        compact ? "p-4" : "p-5"
      ].join(" ")}
    >
      <div className="cw-title text-xl md:text-2xl font-semibold text-slate-900 mb-2">
        {title}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800/10 pb-1">
      <span className="font-semibold">{label}</span>
      <span className="text-slate-900/90">{value ?? "—"}</span>
    </div>
  );
}

function Prop({ label, value, suffix }) {
  const v =
    value === null || value === undefined || value === ""
      ? "—"
      : `${value}${suffix ? ` ${suffix}` : ""}`;

  return (
    <div className="rounded-lg border border-slate-800/15 bg-white/10 px-3 py-2">
      <div className="text-[11px] text-slate-900/65">{label}</div>
      <div className="font-semibold text-slate-900 text-[13px]">{v}</div>
    </div>
  );
}
