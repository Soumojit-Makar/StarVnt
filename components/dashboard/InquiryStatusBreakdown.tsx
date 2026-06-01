// components/dashboard/InquiryStatusBreakdown.tsx
import Link from "next/link";
import { PieChart } from "lucide-react";

interface Props {
  stats: {
    total: number;
    newCount: number;
    contacted: number;
    confirmed: number;
    rejected: number;
  };
}

const statusConfig = [
  { key: "newCount",   label: "New",       color: "#3b82f6", bg: "bg-blue-500",    href: "?status=NEW" },
  { key: "contacted",  label: "Contacted",  color: "#f59e0b", bg: "bg-amber-500",   href: "?status=CONTACTED" },
  { key: "confirmed",  label: "Confirmed",  color: "#10b981", bg: "bg-emerald-500", href: "?status=CONFIRMED" },
  { key: "rejected",   label: "Rejected",   color: "#ef4444", bg: "bg-red-500",     href: "?status=REJECTED" },
];

export default function InquiryStatusBreakdown({ stats }: Props) {
  const values: Record<string, number> = {
    newCount: stats.newCount,
    contacted: stats.contacted,
    confirmed: stats.confirmed,
    rejected: stats.rejected,
  };
  const total = stats.total || 1;

  // Build SVG donut segments
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const segments = statusConfig.map((s) => {
    const pct = values[s.key] / total;
    const dash = pct * circumference;
    const seg = { ...s, value: values[s.key], pct, dash, offset };
    offset += dash;
    return seg;
  });

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-5">
        <PieChart size={16} className="text-brand-400" />
        <h3 className="font-display font-semibold text-white">Inquiry Breakdown</h3>
      </div>

      {stats.total === 0 ? (
        <div className="py-8 text-center">
          <p className="text-white/25 text-sm">No inquiry data yet</p>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          {/* Donut chart */}
          <div className="relative shrink-0">
            <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
              {/* Background */}
              <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              {segments.map((seg) => (
                <circle
                  key={seg.key}
                  cx="48"
                  cy="48"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="10"
                  strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                  strokeDashoffset={-seg.offset}
                  strokeLinecap="butt"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-display font-bold text-white leading-none">{stats.total}</span>
              <span className="text-[10px] text-white/30 font-medium">total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2">
            {segments.map((seg) => (
              <Link
                key={seg.key}
                href={`/dashboard/inquiries${seg.href}`}
                className="flex items-center gap-2.5 group"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${seg.bg} shrink-0`} />
                <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors flex-1">
                  {seg.label}
                </span>
                <span className="text-xs font-semibold text-white tabular-nums">{seg.value}</span>
                <span className="text-xs text-white/25 tabular-nums w-8 text-right">
                  {total > 0 ? Math.round((seg.value / total) * 100) : 0}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
