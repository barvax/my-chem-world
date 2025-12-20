const mockFamilies = [
  {
    id: "fungi",
    name: "Fungi",
    description: "Mushrooms and fungal organisms",
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: "roots",
    name: "Roots",
    description: "Underground plant structures",
    image: "https://via.placeholder.com/300x200"
  }
];

export default function IngredientFamiliesOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockFamilies.map(family => (
        <div
          key={family.id}
          className="bg-white border rounded-xl overflow-hidden shadow-sm"
        >
          <img
            src={family.image}
            alt={family.name}
            className="h-40 w-full object-cover"
          />

          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-slate-800">
              {family.name}
            </h3>
            <p className="text-sm text-slate-600">
              {family.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
