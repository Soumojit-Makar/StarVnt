// components/dashboard/QuickActions.tsx
import Link from "next/link";
import { Inbox, UserCircle, ArrowRight, TrendingUp } from "lucide-react";

const actions = [
  {
    href: "/dashboard/inquiries",
    label: "View Inquiries",
    description: "Manage all event requests",
    icon: Inbox,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    href: "/dashboard/profile",
    label: "Edit Profile",
    description: "Update your vendor info",
    icon: UserCircle,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
];

export default function QuickActions() {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={16} className="text-brand-400" />
        <h3 className="font-display font-semibold text-white">Quick Actions</h3>
      </div>

      <div className="space-y-3">
        {actions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.09] transition-all group"
          >
            <div className={`w-9 h-9 ${a.bg} border ${a.border} rounded-xl flex items-center justify-center shrink-0`}>
              <a.icon size={15} className={a.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{a.label}</p>
              <p className="text-xs text-white/35">{a.description}</p>
            </div>
            <ArrowRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Pro tip */}
      <div className="mt-5 p-3.5 rounded-xl bg-brand-500/5 border border-brand-500/15">
        <p className="text-xs text-brand-400/80 font-medium leading-relaxed">
          💡 Respond to new inquiries within 24 hours to improve your booking rate.
        </p>
      </div>
    </div>
  );
}
