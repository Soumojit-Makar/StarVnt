// app/dashboard/inquiries/loading.tsx
export default function InquiriesLoading() {
  return (
    <div className="space-y-5">
      <div className="h-8 w-48 shimmer rounded-xl" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 shimmer rounded-xl" />
        ))}
      </div>
      <div className="card overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 border-b border-white/[0.04] shimmer" />
        ))}
      </div>
    </div>
  );
}
