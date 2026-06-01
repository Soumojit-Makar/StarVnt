// components/admin/AdminVendorTable.tsx
"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { updateUserStatus, createVendor } from "@/lib/actions";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  CheckCircle2, ShieldAlert, Clock, Users, MapPin,
  Loader2, ChevronDown, Star, Plus, X, Save, UserPlus, Eye, EyeOff,
} from "lucide-react";

type AccountStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

interface Vendor {
  id: string;
  email: string;
  name: string | null;
  accountStatus: AccountStatus;
  createdAt: Date;
  vendorProfile: {
    vendorName: string;
    category: string;
    location: string;
    rating: number | null;
    totalEvents: number;
  } | null;
  _count: { inquiries: number };
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AccountStatus }) {
  const cfg = {
    ACTIVE: { icon: CheckCircle2, cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Active" },
    SUSPENDED: { icon: ShieldAlert, cls: "bg-red-500/10 text-red-400 border-red-500/20", label: "Suspended" },
    PENDING: { icon: Clock, cls: "bg-amber-500/10 text-amber-400 border-amber-500/20", label: "Pending" },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
      <cfg.icon size={11} />{cfg.label}
    </span>
  );
}

// ─── Status Dropdown (React Portal — renders into document.body) ──────────────

function StatusDropdown({
  vendor,
  onStatusChange,
}: {
  vendor: Vendor & { accountStatus: AccountStatus };
  onStatusChange: (id: string, status: AccountStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function openDropdown() {
    if (!btnRef.current) return;
    setRect(btnRef.current.getBoundingClientRect());
    setOpen(true);
  }

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (
        dropRef.current && !dropRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    // Recalculate on scroll of any ancestor
    function handleScroll() {
      if (btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    document.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [open]);

  function handleChange(newStatus: AccountStatus) {
    setOpen(false);
    onStatusChange(vendor.id, newStatus); // optimistic
    const fd = new FormData();
    fd.append("accountStatus", newStatus);
    startTransition(async () => {
      const res = await updateUserStatus(vendor.id, fd);
      if (res.error) {
        toast.error(res.error);
        onStatusChange(vendor.id, vendor.accountStatus); // revert on error
      } else {
        toast.success(`Status updated to ${newStatus}`);
      }
    });
  }

  const options: { value: AccountStatus; label: string; icon: React.ElementType; color: string }[] = [
    { value: "ACTIVE", label: "Set Active", icon: CheckCircle2, color: "text-emerald-400" },
    { value: "SUSPENDED", label: "Suspend", icon: ShieldAlert, color: "text-red-400" },
    { value: "PENDING", label: "Set Pending", icon: Clock, color: "text-amber-400" },
  ];

  // Compute dropdown position — prefer below, flip above if not enough space
  const dropWidth = 168;
  let dropTop = 0;
  let dropLeft = 0;
  if (rect) {
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropHeight = options.length * 44 + 8; // approx
    dropTop = spaceBelow >= dropHeight ? rect.bottom + 4 : rect.top - dropHeight - 4;
    dropLeft = Math.min(rect.left, window.innerWidth - dropWidth - 8);
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={openDropdown}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white/60 hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap select-none"
      >
        {isPending
          ? <Loader2 size={11} className="animate-spin" />
          : <ChevronDown size={11} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />}
        Change Status
      </button>

      {/* Portal into document.body — fully escapes all overflow/z-index stacking contexts */}
      {mounted && open && rect && createPortal(
        <div
          ref={dropRef}
          className="fixed bg-[#1c1c1c] border border-white/[0.12] rounded-xl shadow-2xl shadow-black/60 py-1"
          style={{ top: dropTop, left: dropLeft, width: dropWidth, zIndex: 9999 }}
        >
          {options.map((opt) => {
            const isCurrent = vendor.accountStatus === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => !isCurrent && handleChange(opt.value)}
                disabled={isCurrent}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition-colors
                  ${isCurrent
                    ? "text-white/25 cursor-default"
                    : "text-white/65 hover:text-white hover:bg-white/[0.06] cursor-pointer"}`}
              >
                <opt.icon size={12} className={isCurrent ? "text-white/20" : opt.color} />
                <span className="flex-1 text-left">{opt.label}</span>
                {isCurrent && (
                  <span className="text-[9px] bg-white/[0.08] text-white/30 px-1.5 py-0.5 rounded-full">
                    current
                  </span>
                )}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
}

// ─── Add Vendor Modal ─────────────────────────────────────────────────────────

const CATEGORIES = [
  "Full Event Management", "Wedding Planner", "Corporate Events",
  "Entertainment & Shows", "Concert & Music Events", "DJ & Audio Services",
  "Photography & Videography", "Catering & Food", "Decor & Styling", "Other",
];

function AddVendorModal({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);

  // Trap Escape key
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createVendor(fd);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Vendor created successfully!");
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 ">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg
               bg-[#111111]
               rounded-2xl
               border border-white/[0.1]
               shadow-2xl
               flex flex-col
               max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal panel — self-contained scroll */}
        <div className="relative w-full max-w-lg bg-[#111111] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center shrink-0">
                <UserPlus size={16} className="text-violet-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">Add New Vendor</h3>
                <p className="text-xs text-white/35">Create a vendor account with profile</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable form body */}
         <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4" id="add-vendor-form">
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  name="name"
                  type="text"
                  className="input"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  className="input"
                  placeholder="vendor@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  className="input pr-10"
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className="text-[10px] text-white/25 mt-1">Vendor can change this after login via Settings.</p>
            </div>

            {/* Business name + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Business Name *</label>
                <input
                  name="vendorName"
                  type="text"
                  className="input"
                  placeholder="e.g. Royal Events"
                  required
                />
              </div>
              <div>
                <label className="label">Location *</label>
                <input
                  name="location"
                  type="text"
                  className="input"
                  placeholder="e.g. Delhi, NCR"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="label">Category *</label>
              <select
                name="category"
                required
                className="input appearance-none"
                style={{ backgroundColor: "#111111", colorScheme: "dark" }}
                defaultValue=""
              >
                <option value="" disabled style={{ background: "#1a1a1a", color: "#666" }}>
                  Select a category
                </option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: "#1a1a1a", color: "#fff" }}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Info */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-violet-500/5 border border-violet-500/15">
              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
              <p className="text-xs text-violet-300/65 leading-relaxed">
                Account will be created with <strong className="text-violet-300">Active</strong> status.
                The vendor can complete their profile (phone, description, image) after logging in.
              </p>
            </div>
          </form>
        </div>

        {/* Sticky footer */}
         <div className="border-t border-white/[0.06] p-4">
          <button
            type="submit"
            form="add-vendor-form"
            disabled={isPending}
            className="btn-primary flex-1 justify-center"
          >
            {isPending
              ? <><Loader2 size={14} className="animate-spin" />Creating…</>
              : <><Save size={14} />Create Vendor</>}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Table ───────────────────────────────────────────────────────────────

export default function AdminVendorTable({ vendors: initialVendors }: { vendors: Vendor[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<AccountStatus | "ALL">("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);

  // Optimistic status update
  function handleStatusChange(id: string, newStatus: AccountStatus) {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, accountStatus: newStatus } : v))
    );
  }

  const filtered = vendors.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      v.email.toLowerCase().includes(q) ||
      (v.vendorProfile?.vendorName || "").toLowerCase().includes(q) ||
      (v.name || "").toLowerCase().includes(q);
    return matchSearch && (filterStatus === "ALL" || v.accountStatus === filterStatus);
  });

  const counts = {
    ALL: vendors.length,
    ACTIVE: vendors.filter((v) => v.accountStatus === "ACTIVE").length,
    SUSPENDED: vendors.filter((v) => v.accountStatus === "SUSPENDED").length,
    PENDING: vendors.filter((v) => v.accountStatus === "PENDING").length,
  };

  return (
    <>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input max-w-xs"
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["ALL", "ACTIVE", "SUSPENDED", "PENDING"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${filterStatus === s
                  ? "bg-violet-500/15 text-violet-400 border-violet-500/25"
                  : "bg-white/[0.03] text-white/40 border-white/[0.07] hover:text-white/60 hover:bg-white/[0.06]"
                  }`}
              >
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                <span className={`ml-1.5 text-[10px] font-bold tabular-nums ${filterStatus === s ? "text-violet-300" : "text-white/20"}`}>
                  {counts[s]}
                </span>
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-white/25 hidden sm:inline">
              {filtered.length} vendor{filtered.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 active:scale-95 text-white text-xs font-semibold transition-all shadow-lg shadow-violet-500/20"
            >
              <Plus size={13} />Add Vendor
            </button>
          </div>
        </div>

        {/* Desktop table — overflow-visible so no child is clipped */}
        <div className="card overflow-visible hidden md:block">
          <div className="overflow-hidden rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                  {["Vendor", "Category", "Location", "Inquiries", "Rating", "Joined", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-white/30 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <Users size={32} className="text-white/10 mx-auto mb-3" />
                      <p className="text-white/30 text-sm font-medium">No vendors found</p>
                      {search && <p className="text-white/20 text-xs mt-1">Try a different search term</p>}
                      {!search && (
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold hover:bg-violet-500/20 transition-all"
                        >
                          <UserPlus size={13} />Add First Vendor
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filtered.map((v) => (
                    <tr
                      key={v.id}
                      className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Vendor */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-300 font-bold text-sm shrink-0">
                            {(v.vendorProfile?.vendorName || v.name || v.email).charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate max-w-[160px]">
                              {v.vendorProfile?.vendorName || v.name || "—"}
                            </p>
                            <p className="text-xs text-white/35 truncate max-w-[160px]">{v.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-white/55 truncate max-w-[120px] block">{v.vendorProfile?.category || "—"}</span>
                      </td>
                      {/* Location */}
                      <td className="px-5 py-4">
                        <span className="text-xs text-white/40 flex items-center gap-1.5">
                          <MapPin size={10} className="text-white/20 shrink-0" />
                          <span className="truncate max-w-[120px]">{v.vendorProfile?.location || "—"}</span>
                        </span>
                      </td>
                      {/* Inquiries */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-white/60 tabular-nums font-medium">{v._count.inquiries}</span>
                      </td>
                      {/* Rating */}
                      <td className="px-5 py-4">
                        {v.vendorProfile?.rating ? (
                          <span className="flex items-center gap-1 text-sm text-amber-400 font-semibold">
                            <Star size={11} fill="currentColor" />
                            {v.vendorProfile.rating.toFixed(1)}
                          </span>
                        ) : <span className="text-white/20 text-sm">—</span>}
                      </td>
                      {/* Joined */}
                      <td className="px-5 py-4">
                        <span className="text-xs text-white/35">{formatDate(v.createdAt)}</span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={v.accountStatus} />
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <StatusDropdown vendor={v} onStatusChange={handleStatusChange} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="card p-10 text-center">
              <Users size={28} className="text-white/10 mx-auto mb-2" />
              <p className="text-white/25 text-sm">No vendors found</p>
            </div>
          ) : (
            filtered.map((v) => (
              <div key={v.id} className="card p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-300 font-bold shrink-0">
                      {(v.vendorProfile?.vendorName || v.name || v.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{v.vendorProfile?.vendorName || v.name || "—"}</p>
                      <p className="text-xs text-white/35 truncate">{v.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={v.accountStatus} />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/35">
                  <span>{v.vendorProfile?.category || "—"}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><MapPin size={9} />{v.vendorProfile?.location || "—"}</span>
                  <span>·</span>
                  <span>{v._count.inquiries} inquiries</span>
                  {v.vendorProfile?.rating && (
                    <><span>·</span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star size={9} fill="currentColor" />{v.vendorProfile.rating.toFixed(1)}
                      </span></>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-white/25">{formatDate(v.createdAt)}</span>
                  <StatusDropdown vendor={v} onStatusChange={handleStatusChange} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddModal && <AddVendorModal onClose={() => setShowAddModal(false)} />}
    </>
  );
}
