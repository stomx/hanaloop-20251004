export default function RootLoading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-gray-100" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2 h-72 rounded-lg bg-gray-100" />
        <div className="h-72 rounded-lg bg-gray-100" />
        <div className="h-72 rounded-lg bg-gray-100" />
      </div>
    </div>
  );
}
