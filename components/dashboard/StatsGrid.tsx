// components/dashboard/StatsGrid.tsx
import { Inbox, Sparkles, CheckCircle2, CalendarCheck } from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    newCount: number;
    confirmed: number;
    upcoming: number;
  };
}

const statConfig = [
  {
    key: "total",
    label: "Total Inquiries",
    icon: Inbox,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    glow: "bg-violet-500/5",
  },
  {
    key: "newCount",
    label: "New Inquiries",
    icon: Sparkles,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "bg-blue-500/5",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "bg-emerald-500/5",
  },
  {
    key: "upcoming",
    label: "Upcoming Events",
    icon: CalendarCheck,
    color: "text-brand-400",
    bg: "bg-brand-500/10",
    border: "border-brand-500/20",
    glow: "bg-brand-500/5",
  },
];

export default function StatsGrid({ stats }: StatsProps) {
  const values: Record<string, number> = {
    total: stats.total,
    newCount: stats.newCount,
    confirmed: stats.confirmed,
    upcoming: stats.upcoming,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfig.map((s, i) => (
        <div
          key={s.key}
          className="card p-5 relative overflow-hidden hover:border-white/10 transition-colors"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 ${s.glow} rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none`} />
          <div className="relative z-10">
            <div className={`w-9 h-9 ${s.bg} border ${s.border} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon size={17} className={s.color} />
            </div>
            <p className="text-3xl font-display font-bold text-white tabular-nums">{values[s.key]}</p>
            <p className="text-xs text-white/40 font-medium mt-1">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
