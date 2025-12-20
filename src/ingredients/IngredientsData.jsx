export default function IngredientsData() {
  return (
    <div className="space-y-6">

      <section>
        <h2 className="text-xl font-semibold text-slate-800">
          Ingredient Data Model
        </h2>
        <p className="text-sm text-slate-600">
          Ingredients represent raw materials used to extract or process molecules.
        </p>
      </section>

      <Section title="Core Fields">
        <ul className="list-disc list-inside text-sm text-slate-600">
          <li>Name</li>
          <li>Family</li>
          <li>Description</li>
          <li>Contained Molecules</li>
        </ul>
      </Section>

      <Section title="Gameplay Role">
        <p className="text-sm text-slate-600">
          Ingredients act as containers for molecules. Players must apply
          physical processes such as mixing, heating or distillation
          to extract molecules from them.
        </p>
      </Section>

    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white border rounded-xl p-5 space-y-2">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      {children}
    </div>
  );
}
