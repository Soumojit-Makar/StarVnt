// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Welcome banner skeleton */}
      <div className="rounded-2xl border border-white/[0.06] p-6 h-24 shimmer" />

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5 h-28 shimmer" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card p-6 h-72 shimmer" />
        <div className="card p-6 h-72 shimmer" />
      </div>
    </div>
  );
}
