// components/dashboard/StatsGrid.tsx
import Link from "next/link";
import { Inbox, Sparkles, CheckCircle2, CalendarCheck, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    newCount: number;
    confirmed: number;
    upcoming: number;
    inquiryTrend: number;
    confirmedTrend: number;
  };
}

function TrendBadge({ value }: { value: number }) {
  if (value === 0) return (
    <span className="flex items-center gap-1 text-xs text-white/30 font-medium">
      <Minus size={11} /> No change
    </span>
  );
  const positive = value > 0;
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-400" : "text-red-400"}`}>
      {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {positive ? "+" : ""}{value}% vs last month
    </span>
  );
}

export default function StatsGrid({ stats }: StatsProps) {
  const cards = [
    {
      label: "Total Inquiries",
      value: stats.total,
      icon: Inbox,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      glow: "bg-violet-500/5",
      href: "/dashboard/inquiries?status=ALL",
      trend: <TrendBadge value={stats.inquiryTrend} />,
    },
    {
      label: "New Inquiries",
      value: stats.newCount,
      icon: Sparkles,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      glow: "bg-blue-500/5",
      href: "/dashboard/inquiries?status=NEW",
      trend: stats.newCount > 0
        ? <span className="text-xs text-blue-400 font-semibold">Awaiting response</span>
        : <span className="text-xs text-white/25">All handled</span>,
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      glow: "bg-emerald-500/5",
      href: "/dashboard/inquiries?status=CONFIRMED",
      trend: <TrendBadge value={stats.confirmedTrend} />,
    },
    {
      label: "Upcoming Events",
      value: stats.upcoming,
      icon: CalendarCheck,
      color: "text-brand-400",
      bg: "bg-brand-500/10",
      border: "border-brand-500/20",
      glow: "bg-brand-500/5",
      href: "/dashboard/inquiries?status=CONFIRMED",
      trend: stats.upcoming > 0
        ? <span className="text-xs text-brand-400 font-semibold">{stats.upcoming} scheduled ahead</span>
        : <span className="text-xs text-white/25">None scheduled</span>,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Link
          key={card.label}
          href={card.href}
          className="card p-5 relative overflow-hidden hover:border-white/10 hover:bg-white/[0.02] transition-all group"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 ${card.glow} rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none`} />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 ${card.bg} border ${card.border} rounded-xl flex items-center justify-center`}>
                <card.icon size={17} className={card.color} />
              </div>
              <div className={`w-6 h-6 rounded-lg ${card.bg} border ${card.border} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={card.color}/>
                </svg>
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-white tabular-nums leading-none mb-1">
              {card.value}
            </p>
            <p className="text-xs text-white/40 font-medium mb-2">{card.label}</p>
            {card.trend}
          </div>
        </Link>
      ))}
    </div>
  );
}
