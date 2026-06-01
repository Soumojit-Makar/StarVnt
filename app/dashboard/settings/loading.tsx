export default function SettingsLoading() {
  return (
    <div className="space-y-5">
      <div className="h-8 w-36 shimmer rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="card h-48 shimmer" />
        <div className="lg:col-span-3 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-44 shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}
