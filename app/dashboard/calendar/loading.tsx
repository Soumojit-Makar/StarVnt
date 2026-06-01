export default function CalendarLoading() {
  return (
    <div className="space-y-5">
      <div className="h-8 w-52 shimmer rounded-xl" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 card h-[520px] shimmer" />
        <div className="card h-[520px] shimmer" />
      </div>
    </div>
  );
}
