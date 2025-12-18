export default function TopBar({ onMenuClick }) {
  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
      <button
        onClick={onMenuClick}
        className="text-2xl leading-none"
      >
        ☰
      </button>

      <div className="font-semibold tracking-wide">
        Chem World
      </div>

      <div className="w-6" />
    </div>
  );
}
