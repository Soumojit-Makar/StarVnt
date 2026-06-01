// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div className="rounded-2xl border border-white/[0.06] h-24 shimmer" />
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card h-32 shimmer" />
        ))}
      </div>
      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card h-40 shimmer" />
        ))}
      </div>
      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 card h-72 shimmer" />
        <div className="lg:col-span-2 card h-72 shimmer" />
      </div>
    </div>
  );
}
