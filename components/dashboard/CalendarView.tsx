// components/dashboard/CalendarView.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createManualEvent, updateManualEvent, deleteManualEvent } from "@/lib/actions";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import {
  ChevronLeft, ChevronRight, CalendarCheck, Clock,
  Plus, X, Save, Trash2, Loader2, Edit2, MapPin,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CalEvent {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: Date;
  eventLocation: string;
  guestCount: number;
  budget: number;
  status: string;
}

interface ManualEvent {
  id: string;
  title: string;
  description: string | null;
  eventDate: Date;
  endDate: Date | null;
  location: string | null;
  color: string;
  allDay: boolean;
}

type ModalMode = "create" | "edit" | null;

const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const COLOR_OPTIONS = [
  { value: "purple", label: "Purple", bg: "bg-violet-500",  ring: "ring-violet-400" },
  { value: "rose",   label: "Rose",   bg: "bg-rose-500",    ring: "ring-rose-400" },
  { value: "sky",    label: "Sky",    bg: "bg-sky-500",     ring: "ring-sky-400" },
  { value: "amber",  label: "Amber",  bg: "bg-amber-500",   ring: "ring-amber-400" },
];

function manualColor(color: string): string {
  return { purple: "#8b5cf6", rose: "#f43f5e", sky: "#0ea5e9", amber: "#f59e0b" }[color] ?? "#8b5cf6";
}

function toDateInput(date: Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function sameDay(a: Date, b: Date) {
  const da = new Date(a), db = new Date(b);
  return da.getDate() === db.getDate() && da.getMonth() === db.getMonth() && da.getFullYear() === db.getFullYear();
}

// ─── Event Form Modal ─────────────────────────────────────────────────────────

function EventModal({
  mode,
  selectedDate,
  editEvent,
  onClose,
}: {
  mode: ModalMode;
  selectedDate: Date;
  editEvent: ManualEvent | null;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [delPending, startDelTransition] = useTransition();
  const [color, setColor] = useState(editEvent?.color ?? "purple");

  if (!mode) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("color", color);
    fd.set("allDay", "true");

    startTransition(async () => {
      const res = mode === "edit" && editEvent
        ? await updateManualEvent(editEvent.id, fd)
        : await createManualEvent(fd);
      if (res.error) { toast.error(res.error); return; }
      toast.success(mode === "edit" ? "Event updated!" : "Event created!");
      onClose();
    });
  }

  function handleDelete() {
    if (!editEvent) return;
    startDelTransition(async () => {
      const res = await deleteManualEvent(editEvent.id);
      if (res.error) { toast.error(res.error); return; }
      toast.success("Event deleted");
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[#111111] border border-white/[0.1] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-display font-semibold text-white">
            {mode === "edit" ? "Edit Event" : "Add Manual Event"}
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="label">Event Title *</label>
            <input
              name="title"
              type="text"
              className="input"
              placeholder="e.g. Site Visit, Team Meeting"
              defaultValue={editEvent?.title}
              required
              maxLength={100}
            />
          </div>

          {/* Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date *</label>
              <input
                name="eventDate"
                type="date"
                className="input"
                defaultValue={editEvent ? toDateInput(editEvent.eventDate) : toDateInput(selectedDate)}
                required
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                name="endDate"
                type="date"
                className="input"
                defaultValue={editEvent?.endDate ? toDateInput(editEvent.endDate) : ""}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="label">Location</label>
            <div className="relative">
              <MapPin size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                name="location"
                type="text"
                className="input pl-9"
                placeholder="Venue or address"
                defaultValue={editEvent?.location ?? ""}
                maxLength={200}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Notes</label>
            <textarea
              name="description"
              className="input resize-none"
              rows={3}
              placeholder="Optional notes or reminders…"
              defaultValue={editEvent?.description ?? ""}
              maxLength={500}
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="label">Color</label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-7 h-7 rounded-full ${c.bg} transition-all ${color === c.value ? `ring-2 ring-offset-2 ring-offset-[#111] ${c.ring} scale-110` : "opacity-60 hover:opacity-100"}`}
                  title={c.label}
                />
              ))}
              <span className="text-xs text-white/30 ml-1">{COLOR_OPTIONS.find(c => c.value === color)?.label}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={isPending} className="btn-primary flex-1 justify-center">
              {isPending ? <><Loader2 size={14} className="animate-spin" />Saving…</> : <><Save size={14} />{mode === "edit" ? "Update Event" : "Create Event"}</>}
            </button>
            {mode === "edit" && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={delPending}
                className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
              >
                {delPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Calendar ────────────────────────────────────────────────────────────

export default function CalendarView({
  confirmed,
  pending,
  manualEvents: initialManual,
}: {
  confirmed: CalEvent[];
  pending: CalEvent[];
  manualEvents: ManualEvent[];
}) {
  const today = new Date();
  const [current, setCurrent]   = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(today);
  const [modal, setModal]       = useState<ModalMode>(null);
  const [editTarget, setEditTarget] = useState<ManualEvent | null>(null);

  const year  = current.getFullYear();
  const month = current.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();

  const allEvents = [...confirmed, ...pending];

  function inquiriesOn(date: Date) {
    return allEvents.filter((e) => sameDay(e.eventDate, date));
  }
  function manualsOn(date: Date) {
    return initialManual.filter((e) => sameDay(e.eventDate, date));
  }

  // Build calendar cells
  const cells: { date: Date; current: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ date: new Date(year, month - 1, daysInPrev - i), current: false });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ date: new Date(year, month, d), current: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++)
    cells.push({ date: new Date(year, month + 1, d), current: false });

  function openCreate() { setModal("create"); setEditTarget(null); }
  function openEdit(e: ManualEvent) { setModal("edit"); setEditTarget(e); }
  function closeModal() { setModal(null); setEditTarget(null); }

  const selectedInquiries = allEvents.filter((e) => sameDay(e.eventDate, selected));
  const selectedManuals   = initialManual.filter((e) => sameDay(e.eventDate, selected));

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* ── Calendar grid ── */}
        <div className="xl:col-span-2 card p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-white text-lg">
              {MONTHS[month]} {year}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrent(new Date(year, month - 1, 1))}
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => { setCurrent(new Date(today.getFullYear(), today.getMonth(), 1)); setSelected(today); }}
                className="px-3 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold hover:bg-brand-500/20 transition-all">
                Today
              </button>
              <button onClick={() => setCurrent(new Date(year, month + 1, 1))}
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
                <ChevronRight size={15} />
              </button>
              <button onClick={openCreate}
                className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-all ml-1">
                <Plus size={13} /> Add Event
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-white/25 py-2">{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((cell, i) => {
              const inqs   = inquiriesOn(cell.date);
              const mans   = manualsOn(cell.date);
              const isToday    = sameDay(cell.date, today);
              const isSelected = sameDay(cell.date, selected);
              const confirmedInqs = inqs.filter(e => e.status === "CONFIRMED");
              const pendingInqs   = inqs.filter(e => e.status !== "CONFIRMED");

              return (
                <button key={i} onClick={() => setSelected(new Date(cell.date))}
                  className={`relative min-h-[54px] p-1.5 rounded-xl text-left transition-all
                    ${!cell.current ? "opacity-25" : ""}
                    ${isSelected ? "bg-brand-500/15 border border-brand-500/30" : "hover:bg-white/[0.04] border border-transparent"}
                    ${isToday && !isSelected ? "border border-brand-500/30" : ""}`}>
                  <span className={`text-xs font-semibold block text-right pr-0.5
                    ${isToday ? "text-brand-400" : isSelected ? "text-white" : "text-white/50"}`}>
                    {cell.date.getDate()}
                  </span>
                  {/* Event dots */}
                  <div className="mt-0.5 space-y-0.5">
                    {confirmedInqs.slice(0, 1).map((e) => (
                      <div key={e.id} className="w-full h-1 rounded-full bg-emerald-500/80" />
                    ))}
                    {pendingInqs.slice(0, 1).map((e) => (
                      <div key={e.id} className={`w-full h-1 rounded-full ${e.status === "CONTACTED" ? "bg-amber-500/70" : "bg-blue-500/70"}`} />
                    ))}
                    {mans.slice(0, 2).map((e) => (
                      <div key={e.id} className="w-full h-1 rounded-full" style={{ backgroundColor: manualColor(e.color) + "cc" }} />
                    ))}
                    {(inqs.length + mans.length) > 3 && (
                      <span className="text-[9px] text-white/30 font-medium">+{inqs.length + mans.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/[0.06]">
            {[
              { dot: "bg-emerald-500/80", label: "Confirmed inquiry" },
              { dot: "bg-amber-500/70",   label: "Contacted" },
              { dot: "bg-blue-500/70",    label: "New inquiry" },
              { dot: "bg-violet-500/80",  label: "Manual event" },
            ].map(({ dot, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-1.5 rounded-full ${dot}`} />
                <span className="text-xs text-white/30">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Day detail panel ── */}
        <div className="card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarCheck size={15} className="text-brand-400" />
              <h3 className="font-display font-semibold text-white text-sm">
                {selected.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </h3>
            </div>
            <button onClick={openCreate}
              className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 hover:bg-brand-500/20 transition-all"
              title="Add event on this day">
              <Plus size={13} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {/* Inquiry events */}
            {selectedInquiries.map((e) => (
              <Link key={e.id} href={`/dashboard/inquiries/${e.id}`}
                className="block p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <p className="text-sm font-semibold text-white leading-snug">{e.clientName}</p>
                    <p className="text-xs text-white/40">{e.eventType}</p>
                  </div>
                  <span className={`status-badge ${getStatusColor(e.status)} text-[10px] shrink-0`}>
                    {getStatusLabel(e.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/30 flex items-center gap-1 truncate"><MapPin size={9} />{e.eventLocation.split(",")[0]}</span>
                  <span className="text-emerald-400 font-semibold shrink-0">{formatCurrency(e.budget)}</span>
                </div>
              </Link>
            ))}

            {/* Manual events */}
            {selectedManuals.map((e) => (
              <div key={e.id}
                className="p-3 rounded-xl border bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                style={{ borderColor: manualColor(e.color) + "40" }}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-start gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: manualColor(e.color) }} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white leading-snug">{e.title}</p>
                      {e.location && <p className="text-xs text-white/35 mt-0.5 flex items-center gap-1"><MapPin size={9} />{e.location}</p>}
                      {e.description && <p className="text-xs text-white/30 mt-1 leading-relaxed">{e.description}</p>}
                    </div>
                  </div>
                  <button onClick={() => openEdit(e)}
                    className="w-6 h-6 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-white/70 transition-colors shrink-0">
                    <Edit2 size={10} />
                  </button>
                </div>
                <p className="text-[10px] text-white/25 mt-1.5 pl-4 uppercase tracking-wider font-medium">Manual</p>
              </div>
            ))}

            {selectedInquiries.length === 0 && selectedManuals.length === 0 && (
              <div className="py-10 text-center">
                <Clock size={28} className="text-white/10 mx-auto mb-2" />
                <p className="text-white/25 text-sm">No events</p>
                <button onClick={openCreate}
                  className="mt-3 text-xs text-brand-400/70 hover:text-brand-400 transition-colors underline underline-offset-2">
                  Add an event
                </button>
              </div>
            )}
          </div>

          {/* Upcoming mini list */}
          <div className="mt-4 pt-4 border-t border-white/[0.06]">
            <p className="text-xs font-semibold text-white/25 uppercase tracking-wider mb-3">Next Confirmed</p>
            <div className="space-y-2">
              {confirmed
                .filter((e) => new Date(e.eventDate) >= today)
                .slice(0, 3)
                .map((e) => (
                  <Link key={e.id} href={`/dashboard/inquiries/${e.id}`}
                    className="flex items-center gap-2 group">
                    <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <CalendarCheck size={11} className="text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white/65 truncate group-hover:text-white/90 transition-colors">{e.clientName}</p>
                      <p className="text-[10px] text-white/30">
                        {new Date(e.eventDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <EventModal
        mode={modal}
        selectedDate={selected}
        editEvent={editTarget}
        onClose={closeModal}
      />
    </>
  );
}
