// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Inbox, UserCircle, LogOut, Star,
  ChevronRight, CalendarDays, BarChart3, Settings, LifeBuoy, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/dashboard",           label: "Overview",  icon: LayoutDashboard, exact: true },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/dashboard/calendar",  label: "Calendar",  icon: CalendarDays },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];
const accountNav = [
  { href: "/dashboard/profile",  label: "Profile",  icon: UserCircle },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/support",  label: "Support",  icon: LifeBuoy },
];

interface SidebarProps {
  vendor: { name: string; email: string; image: string | null; category: string; role: string };
}

export default function Sidebar({ vendor }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = vendor.role === "ADMIN";

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  function NavLink({ href, label, icon: Icon, exact }: { href: string; label: string; icon: React.ElementType; exact?: boolean }) {
    const active = isActive(href, exact);
    return (
      <Link href={href} className={cn(active ? "nav-item-active" : "nav-item", "group")}>
        <Icon size={15} className={active ? "text-brand-400" : "text-white/40 group-hover:text-white/70"} />
        <span className="flex-1 text-sm">{label}</span>
        {active && <ChevronRight size={12} className="text-brand-500/60" />}
      </Link>
    );
  }

  return (
    <aside className="hidden md:flex w-[240px] lg:w-[260px] flex-col h-full bg-[#0d0d0d] border-r border-white/[0.06] shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-brand-500/10 border border-brand-500/25 rounded-xl flex items-center justify-center group-hover:bg-brand-500/15 transition-colors">
            <Star size={16} fill="#f97316" className="text-brand-500" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-base tracking-tight">StarVnt</span>
            <p className="text-[10px] text-white/30 font-medium -mt-0.5">Vendor Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        <div>
          <p className="px-3 mb-2 text-[10px] font-semibold text-white/20 uppercase tracking-widest">Main</p>
          <div className="space-y-0.5">
            {mainNav.map((item) => <NavLink key={item.href} {...item} />)}
          </div>
        </div>
        <div>
          <p className="px-3 mb-2 text-[10px] font-semibold text-white/20 uppercase tracking-widest">Account</p>
          <div className="space-y-0.5">
            {accountNav.map((item) => <NavLink key={item.href} {...item} />)}
          </div>
        </div>

        {/* Admin shortcut — only shown to admins */}
        {isAdmin && (
          <div>
            <p className="px-3 mb-2 text-[10px] font-semibold text-violet-400/40 uppercase tracking-widest">Admin</p>
            <Link href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-violet-400/70 hover:text-violet-400 hover:bg-violet-500/10 transition-all border border-transparent hover:border-violet-500/20 group">
              <ShieldCheck size={15} className="text-violet-400/60 group-hover:text-violet-400" />
              <span className="flex-1">Admin Panel</span>
              <span className="text-[9px] font-bold text-violet-400 bg-violet-500/15 border border-violet-500/25 px-1.5 py-0.5 rounded-full uppercase">Admin</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Vendor card + logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500/30 to-brand-600/10 border border-brand-500/25 flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
            {vendor.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-white truncate">{vendor.name}</p>
              {isAdmin && (
                <span className="text-[9px] font-bold text-violet-400 bg-violet-500/15 border border-violet-500/25 px-1 py-0.5 rounded-full uppercase shrink-0">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-white/35 truncate">{vendor.category}</p>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="nav-item w-full text-red-400/60 hover:text-red-400 hover:bg-red-500/10">
          <LogOut size={14} /><span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
