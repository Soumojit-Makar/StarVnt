// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Inbox,
  UserCircle,
  LogOut,
  Star,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

interface SidebarProps {
  vendor: { name: string; email: string; image: string | null; category: string };
}

export default function Sidebar({ vendor }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="hidden md:flex w-[240px] lg:w-[260px] flex-col h-full bg-[#0d0d0d] border-r border-white/[0.06] shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/[0.06]">
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
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-semibold text-white/25 uppercase tracking-widest">
          Main Menu
        </p>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(active ? "nav-item-active" : "nav-item", "group")}
            >
              <item.icon size={16} className={active ? "text-brand-400" : "text-white/40 group-hover:text-white/70"} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={13} className="text-brand-500/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Vendor info + logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] mb-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
            {vendor.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{vendor.name}</p>
            <p className="text-xs text-white/35 truncate">{vendor.category}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="nav-item w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
