export default function AnalyticsLoading() {
  return (
    <div className="space-y-5">
      <div className="h-8 w-44 shimmer rounded-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card h-28 shimmer" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card h-64 shimmer" />
        <div className="card h-64 shimmer" />
      </div>
      <div className="card h-56 shimmer" />
    </div>
  );
}
