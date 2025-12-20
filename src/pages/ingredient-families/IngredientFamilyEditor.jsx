export default function IngredientFamilyEditor() {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Create Ingredient Family
        </h2>
        <p className="text-sm text-slate-500">
          Define a new family category
        </p>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <Field label="Family Name">
          <input type="text" className="input" placeholder="Fungi" />
        </Field>

        <Field label="Description">
          <textarea
            rows={3}
            className="input resize-none"
            placeholder="Short explanation of this family"
          />
        </Field>

        <Field label="Image URL">
          <input
            type="text"
            className="input"
            placeholder="https://..."
          />
        </Field>

        <div className="flex justify-end gap-3 pt-4">
          <button className="px-4 py-2 border rounded-md text-slate-700">
            Cancel
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-md">
            Save Family
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
