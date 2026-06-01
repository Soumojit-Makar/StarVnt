// components/dashboard/RevenueCard.tsx
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { IndianRupee, TrendingUp, ArrowRight } from "lucide-react";

export default function RevenueCard({
  totalRevenue,
  confirmed,
}: {
  totalRevenue: number;
  confirmed: number;
}) {
  const avg = confirmed > 0 ? totalRevenue / confirmed : 0;
  // Rough display of revenue tiers for a mini bar
  const tiers = [
    { label: "< ₹5L",   value: 0 },
    { label: "₹5L–20L", value: 0 },
    { label: "> ₹20L",  value: 0 },
  ];

  return (
    <div className="card p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
            <IndianRupee size={16} className="text-emerald-400" />
          </div>
          <Link href="/dashboard/analytics"
            className="text-xs text-white/25 hover:text-brand-400 flex items-center gap-1 transition-colors">
            Details <ArrowRight size={11} />
          </Link>
        </div>

        <p className="text-[10px] text-white/35 font-semibold uppercase tracking-wider mb-1">Confirmed Revenue</p>
        <p className="text-3xl font-display font-bold text-white tabular-nums leading-none">
          {formatCurrency(totalRevenue)}
        </p>

        <div className="flex items-center gap-1.5 mt-1.5 mb-5">
          <TrendingUp size={11} className="text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">
            {confirmed} booking{confirmed !== 1 ? "s" : ""} confirmed
          </span>
        </div>

        {/* Divider stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06]">
          <div className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.05]">
            <p className="text-[10px] text-white/30 mb-1">Avg. per booking</p>
            <p className="text-sm font-display font-bold text-white">{formatCurrency(avg)}</p>
          </div>
          <div className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.05]">
            <p className="text-[10px] text-white/30 mb-1">Largest booking</p>
            <p className="text-sm font-display font-bold text-emerald-400">
              {confirmed > 0 ? "See analytics" : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
