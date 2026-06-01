// components/dashboard/AnalyticsDashboard.tsx
"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Target, IndianRupee, BarChart3, PieChart, ArrowUpRight } from "lucide-react";

interface MonthlyData {
  month: string;
  total: number;
  confirmed: number;
  revenue: number;
}

interface EventTypeRow {
  eventType: string;
  _count: { _all: number };
  _sum: { budget: number | null };
}

interface Props {
  monthlyData: MonthlyData[];
  eventTypeBreakdown: EventTypeRow[];
  totalRevenue: number;
  avgBudget: number;
  conversionRate: number;
  totalInquiries: number;
  totalConfirmed: number;
}

const TYPE_COLORS = [
  "#f97316","#3b82f6","#10b981","#8b5cf6",
  "#f59e0b","#ef4444","#06b6d4","#ec4899",
];

export default function AnalyticsDashboard({
  monthlyData,
  eventTypeBreakdown,
  totalRevenue,
  avgBudget,
  conversionRate,
  totalInquiries,
  totalConfirmed,
}: Props) {
  const [chartMode, setChartMode] = useState<"inquiries" | "revenue">("inquiries");

  // Bar chart calculations
  const maxVal = Math.max(...monthlyData.map((m) => chartMode === "inquiries" ? m.total : m.revenue), 1);
  const CHART_H = 140;

  // Donut for event types
  const totalCount = eventTypeBreakdown.reduce((s, r) => s + r._count._all, 0) || 1;
  let donutOffset = 0;
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const donutSegments = eventTypeBreakdown.slice(0, 8).map((row, i) => {
    const pct = row._count._all / totalCount;
    const dash = pct * circ;
    const seg = { ...row, color: TYPE_COLORS[i % TYPE_COLORS.length], dash, offset: donutOffset, pct };
    donutOffset += dash;
    return seg;
  });

  const kpis = [
    { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", sub: "From confirmed bookings" },
    { label: "Avg. Booking Value", value: formatCurrency(avgBudget), icon: TrendingUp, color: "text-brand-400", bg: "bg-brand-500/10", border: "border-brand-500/20", sub: `Across ${totalConfirmed} confirmed` },
    { label: "Conversion Rate", value: `${conversionRate}%`, icon: Target, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", sub: `${totalConfirmed} of ${totalInquiries} inquiries` },
    { label: "Total Inquiries", value: totalInquiries.toString(), icon: BarChart3, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", sub: "All time" },
  ];

  return (
    <div className="space-y-5">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card p-5 relative overflow-hidden hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 ${kpi.bg} border ${kpi.border} rounded-xl flex items-center justify-center`}>
                <kpi.icon size={16} className={kpi.color} />
              </div>
              <ArrowUpRight size={13} className="text-white/15" />
            </div>
            <p className="text-2xl font-display font-bold text-white tabular-nums">{kpi.value}</p>
            <p className="text-xs text-white/40 font-medium mt-0.5">{kpi.label}</p>
            <p className="text-[10px] text-white/25 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Bar chart + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-semibold text-white">Monthly Trends</h3>
              <p className="text-xs text-white/35 mt-0.5">Last 6 months</p>
            </div>
            <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1 border border-white/[0.06]">
              {(["inquiries", "revenue"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setChartMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    chartMode === mode
                      ? "bg-brand-500/20 text-brand-400 border border-brand-500/25"
                      : "text-white/40 hover:text-white/60"
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="flex items-end gap-3 h-44">
            {monthlyData.map((m, i) => {
              const val = chartMode === "inquiries" ? m.total : m.revenue;
              const confVal = chartMode === "inquiries" ? m.confirmed : m.revenue;
              const barH = maxVal > 0 ? Math.max((val / maxVal) * CHART_H, val > 0 ? 4 : 0) : 0;
              const confH = maxVal > 0 ? Math.max((confVal / maxVal) * CHART_H, confVal > 0 ? 4 : 0) : 0;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative w-full flex items-end justify-center gap-1" style={{ height: CHART_H }}>
                    {/* Total bar */}
                    <div
                      className="w-[40%] rounded-t-lg bg-white/[0.06] border border-white/[0.08] transition-all duration-500 group-hover:bg-white/[0.1]"
                      style={{ height: barH }}
                      title={`Total: ${val}`}
                    />
                    {/* Confirmed bar */}
                    <div
                      className="w-[40%] rounded-t-lg bg-brand-500/60 border border-brand-500/40 transition-all duration-500 group-hover:bg-brand-500/80"
                      style={{ height: confH }}
                      title={`Confirmed: ${confVal}`}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {chartMode === "inquiries" ? `${val} total · ${confVal} confirmed` : formatCurrency(val)}
                    </div>
                  </div>
                  <span className="text-[10px] text-white/30 font-medium">{m.month}</span>
                </div>
              );
            })}
          </div>

          {/* Chart legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-white/[0.06] border border-white/[0.08]" />
              <span className="text-xs text-white/30">{chartMode === "inquiries" ? "Total inquiries" : "Total revenue"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-brand-500/60" />
              <span className="text-xs text-white/30">{chartMode === "inquiries" ? "Confirmed" : "Confirmed revenue"}</span>
            </div>
          </div>
        </div>

        {/* Event type donut */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <PieChart size={15} className="text-brand-400" />
            <h3 className="font-display font-semibold text-white">By Event Type</h3>
          </div>

          {eventTypeBreakdown.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-white/25 text-sm">No data yet</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
                    <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
                    {donutSegments.map((seg) => (
                      <circle
                        key={seg.eventType}
                        cx="64" cy="64" r={radius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="14"
                        strokeDasharray={`${seg.dash} ${circ - seg.dash}`}
                        strokeDashoffset={-seg.offset}
                        strokeLinecap="butt"
                      />
                    ))}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-display font-bold text-white">{totalInquiries}</span>
                    <span className="text-[10px] text-white/30">total</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {donutSegments.map((seg) => (
                  <div key={seg.eventType} className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: seg.color }} />
                    <span className="text-xs text-white/55 flex-1 truncate">{seg.eventType}</span>
                    <span className="text-xs font-semibold text-white tabular-nums">{seg._count._all}</span>
                    <span className="text-xs text-white/25 tabular-nums w-7 text-right">
                      {Math.round(seg.pct * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Revenue by event type table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h3 className="font-display font-semibold text-white">Revenue by Event Type</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              <th className="text-left px-6 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">Event Type</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">Count</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">Total Budget</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider hidden md:table-cell">Avg Budget</th>
              <th className="px-6 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider">Share</th>
            </tr>
          </thead>
          <tbody>
            {eventTypeBreakdown.map((row, i) => {
              const total = row._sum.budget || 0;
              const avg = row._count._all > 0 ? total / row._count._all : 0;
              const pct = Math.round((row._count._all / totalInquiries) * 100);
              return (
                <tr key={row.eventType} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: TYPE_COLORS[i % TYPE_COLORS.length] }} />
                      <span className="text-sm text-white/80">{row.eventType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right text-sm text-white/60 tabular-nums">{row._count._all}</td>
                  <td className="px-6 py-3.5 text-right text-sm font-semibold text-white tabular-nums">{formatCurrency(total)}</td>
                  <td className="px-6 py-3.5 text-right text-sm text-white/50 tabular-nums hidden md:table-cell">{formatCurrency(avg)}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: TYPE_COLORS[i % TYPE_COLORS.length] }} />
                      </div>
                      <span className="text-xs text-white/30 w-7 text-right">{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
