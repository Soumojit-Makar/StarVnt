// components/dashboard/QuickActions.tsx
import Link from "next/link";
import { Inbox, UserCircle, BarChart3, CalendarDays, ArrowRight, Zap } from "lucide-react";

const actions = [
  { href: "/dashboard/inquiries?status=NEW", label: "New Inquiries", desc: "Respond to pending requests", icon: Inbox, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { href: "/dashboard/calendar",             label: "View Calendar", desc: "See upcoming confirmed events", icon: CalendarDays, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { href: "/dashboard/analytics",            label: "Analytics",     desc: "Revenue & conversion stats", icon: BarChart3, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { href: "/dashboard/profile",              label: "Edit Profile",  desc: "Update your vendor info", icon: UserCircle, color: "text-brand-400", bg: "bg-brand-500/10", border: "border-brand-500/20" },
];

export default function QuickActions() {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={15} className="text-brand-400" />
        <h3 className="font-display font-semibold text-white">Quick Actions</h3>
      </div>
      <div className="space-y-2">
        {actions.map((a) => (
          <Link key={a.href} href={a.href}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.09] transition-all group">
            <div className={`w-8 h-8 ${a.bg} border ${a.border} rounded-xl flex items-center justify-center shrink-0`}>
              <a.icon size={14} className={a.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white">{a.label}</p>
              <p className="text-[10px] text-white/30">{a.desc}</p>
            </div>
            <ArrowRight size={12} className="text-white/15 group-hover:text-white/45 transition-colors" />
          </Link>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-xl bg-brand-500/5 border border-brand-500/15">
        <p className="text-xs text-brand-400/75 leading-relaxed">
          💡 Respond within 24h to boost your booking rate by up to 3×.
        </p>
      </div>
    </div>
  );
}
