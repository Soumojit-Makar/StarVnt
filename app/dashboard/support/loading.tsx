export default function SupportLoading() {
  return (
    <div className="space-y-5">
      <div className="h-8 w-44 shimmer rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="card h-80 shimmer" />
          <div className="card h-56 shimmer" />
        </div>
        <div className="space-y-4">
          <div className="card h-36 shimmer" />
          <div className="card h-44 shimmer" />
        </div>
      </div>
    </div>
  );
}
