// app/admin/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAdminStats } from "@/lib/actions";
import { formatCurrency } from "@/lib/utils";
import { Users, Inbox, CheckCircle2, IndianRupee, ShieldAlert, BarChart3 } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") redirect("/dashboard");

  const stats = await getAdminStats();

  const cards = [
    { label: "Total Vendors",     value: stats.totalVendors,    icon: Users,        color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", href: "/admin/vendors" },
    { label: "Active Vendors",    value: stats.activeVendors,   icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", href: "/admin/vendors" },
    { label: "Suspended",         value: stats.suspendedVendors, icon: ShieldAlert, color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20",     href: "/admin/vendors" },
    { label: "Total Inquiries",   value: stats.totalInquiries,  icon: Inbox,        color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   href: "/admin/inquiries" },
    { label: "Confirmed Bookings",value: stats.confirmedInquiries, icon: BarChart3, color: "text-brand-400",  bg: "bg-brand-500/10",  border: "border-brand-500/20",  href: "/admin/inquiries" },
    { label: "Total Revenue",     value: formatCurrency(stats.totalRevenue), icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", href: "/admin/inquiries" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 via-violet-600/5 to-transparent border border-violet-500/15 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider mb-1">Admin Panel</p>
          <h2 className="font-display text-2xl font-bold text-white">Platform Overview</h2>
          <p className="text-white/40 text-sm mt-1">Manage all vendors, inquiries and platform settings.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card p-5 hover:border-white/10 hover:bg-white/[0.02] transition-all group">
            <div className={`w-9 h-9 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center mb-4`}>
              <c.icon size={16} className={c.color} />
            </div>
            <p className="text-2xl font-display font-bold text-white tabular-nums">{c.value}</p>
            <p className="text-xs text-white/40 mt-0.5">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/vendors" className="card p-5 flex items-center gap-4 hover:border-white/10 hover:bg-white/[0.02] transition-all group">
          <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center shrink-0">
            <Users size={18} className="text-violet-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Vendor Management</p>
            <p className="text-xs text-white/35 mt-0.5">View, activate, suspend vendor accounts</p>
          </div>
        </Link>
        <Link href="/admin/inquiries" className="card p-5 flex items-center gap-4 hover:border-white/10 hover:bg-white/[0.02] transition-all group">
          <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
            <Inbox size={18} className="text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">All Inquiries</p>
            <p className="text-xs text-white/35 mt-0.5">Platform-wide inquiry overview</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
