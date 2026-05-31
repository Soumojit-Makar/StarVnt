// components/dashboard/TopNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X, LayoutDashboard, Inbox, UserCircle, LogOut, Star, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

interface TopNavProps {
  vendor: { name: string; email: string; image: string | null; category: string };
}

export default function TopNav({ vendor }: TopNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function getPageTitle() {
    if (pathname === "/dashboard") return "Overview";
    if (pathname.startsWith("/dashboard/inquiries")) return "Inquiries";
    if (pathname.startsWith("/dashboard/profile")) return "Profile";
    return "Dashboard";
  }

  return (
    <>
      <header className="h-14 bg-[#0d0d0d] border-b border-white/[0.06] flex items-center px-4 gap-4 shrink-0">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
        >
          <Menu size={18} />
        </button>

        {/* Mobile logo */}
        <div className="md:hidden flex items-center gap-2">
          <Star size={14} fill="#f97316" className="text-brand-500" />
          <span className="font-display font-bold text-white text-sm">StarVnt</span>
        </div>

        {/* Page title (desktop) */}
        <div className="hidden md:block flex-1">
          <h1 className="font-display font-semibold text-white text-base">{getPageTitle()}</h1>
        </div>

        <div className="flex-1 md:flex-none" />

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-colors">
            <Bell size={14} />
          </button>
          <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-xs">
            {vendor.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0d0d0d] border-r border-white/[0.06] flex flex-col animate-slide-in-right">
            <div className="px-5 py-5 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-500/10 border border-brand-500/25 rounded-xl flex items-center justify-center">
                  <Star size={14} fill="#f97316" className="text-brand-500" />
                </div>
                <span className="font-display font-bold text-white">StarVnt</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <nav className="flex-1 px-3 py-5 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(active ? "nav-item-active" : "nav-item")}
                  >
                    <item.icon size={16} className={active ? "text-brand-400" : "text-white/40"} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-3 border-t border-white/[0.06]">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] mb-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm">
                  {vendor.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{vendor.name}</p>
                  <p className="text-xs text-white/35 truncate">{vendor.email}</p>
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
        </div>
      )}
    </>
  );
}
