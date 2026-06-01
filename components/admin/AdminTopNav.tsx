// components/admin/AdminTopNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X, LayoutDashboard, Users, Inbox, LogOut, ShieldCheck, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin",           label: "Overview",  icon: LayoutDashboard, exact: true },
  { href: "/admin/vendors",   label: "Vendors",   icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
];

export default function AdminTopNav({ admin }: { admin: { name: string; email: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function getTitle() {
    if (pathname === "/admin")                  return "Admin Overview";
    if (pathname.startsWith("/admin/vendors"))  return "Vendor Management";
    if (pathname.startsWith("/admin/inquiries"))return "All Inquiries";
    return "Admin";
  }

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <>
      <header className="h-14 bg-[#0d0d0d] border-b border-white/[0.06] flex items-center px-4 gap-4 shrink-0">
        <button onClick={() => setOpen(true)} className="md:hidden text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors">
          <Menu size={18} />
        </button>
        <div className="md:hidden flex items-center gap-2">
          <ShieldCheck size={14} className="text-violet-400" />
          <span className="font-display font-bold text-white text-sm">Admin</span>
        </div>
        <div className="hidden md:block flex-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display font-semibold text-white text-base">{getTitle()}</h1>
            <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Admin
            </span>
          </div>
        </div>
        <div className="flex-1 md:flex-none" />
        <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-violet-300 font-bold text-xs">
          {admin.name.charAt(0).toUpperCase()}
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0d0d0d] border-r border-white/[0.06] flex flex-col">
            <div className="px-5 py-5 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-violet-400" />
                <span className="font-display font-bold text-white text-sm">StarVnt Admin</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white p-1 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className={cn(active ? "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20" : "nav-item")}>
                    <item.icon size={15} className={active ? "text-violet-400" : "text-white/40"} />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight size={12} className="text-violet-500/60" />}
                  </Link>
                );
              })}
              <Link href="/dashboard" onClick={() => setOpen(false)}
                className="nav-item text-brand-400/60 hover:text-brand-400">
                <LayoutDashboard size={14} /><span className="text-sm">Vendor Portal</span>
              </Link>
            </nav>
            <div className="p-3 border-t border-white/[0.06]">
              <button onClick={() => signOut({ callbackUrl: "/login" })}
                className="nav-item w-full text-red-400/60 hover:text-red-400 hover:bg-red-500/10">
                <LogOut size={14} /><span className="text-sm">Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
