// components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Users, Inbox, LogOut, ShieldCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin",           label: "Overview",  icon: LayoutDashboard, exact: true },
  { href: "/admin/vendors",   label: "Vendors",   icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
];

export default function AdminSidebar({ admin }: { admin: { name: string; email: string } }) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="hidden md:flex w-[240px] lg:w-[260px] flex-col h-full bg-[#0d0d0d] border-r border-white/[0.06] shrink-0">
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-violet-500/10 border border-violet-500/25 rounded-xl flex items-center justify-center group-hover:bg-violet-500/15 transition-colors">
            <ShieldCheck size={16} className="text-violet-400" />
          </div>
          <div>
            <span className="font-display font-bold text-white text-base tracking-tight">StarVnt</span>
            <p className="text-[10px] text-violet-400/70 font-semibold -mt-0.5 uppercase tracking-widest">Admin</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold text-white/20 uppercase tracking-widest">Admin Menu</p>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                active ? "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20" : "nav-item",
                "group"
              )}>
              <item.icon size={15} className={active ? "text-violet-400" : "text-white/40 group-hover:text-white/70"} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={12} className="text-violet-500/60" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-2 border-t border-white/[0.06]">
        <Link href="/dashboard" className="nav-item w-full text-brand-400/60 hover:text-brand-400 hover:bg-brand-500/8 mb-1">
          <LayoutDashboard size={14} /><span className="text-sm">Vendor Portal</span>
        </Link>
      </div>

      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/5 border border-violet-500/15 mb-2">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 font-bold text-sm shrink-0">
            {admin.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-white truncate">{admin.name}</p>
              <span className="text-[9px] font-bold text-violet-400 bg-violet-500/15 border border-violet-500/25 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Admin</span>
            </div>
            <p className="text-xs text-white/35 truncate">{admin.email}</p>
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
