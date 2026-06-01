// components/dashboard/UpcomingEvents.tsx
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { CalendarCheck, MapPin, Users, ArrowRight, CalendarX } from "lucide-react";

interface UpcomingEvent {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: Date;
  eventLocation: string;
  guestCount: number;
  budget: number;
}

function getDaysUntil(date: Date) {
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return { label: "Today", color: "text-red-400 bg-red-500/10 border-red-500/20" };
  if (diff === 1) return { label: "Tomorrow", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
  if (diff <= 7) return { label: `${diff}d`, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
  if (diff <= 30) return { label: `${diff}d`, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
  return { label: `${diff}d`, color: "text-white/40 bg-white/5 border-white/10" };
}

export default function UpcomingEvents({ events }: { events: UpcomingEvent[] }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarCheck size={16} className="text-brand-400" />
          <h3 className="font-display font-semibold text-white">Upcoming Events</h3>
        </div>
        <Link
          href="/dashboard/inquiries?status=CONFIRMED"
          className="text-xs text-white/30 hover:text-brand-400 transition-colors flex items-center gap-1"
        >
          View all <ArrowRight size={11} />
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="py-10 text-center">
          <CalendarX size={32} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm font-medium">No upcoming events</p>
          <p className="text-white/20 text-xs mt-1">Confirmed events will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const { label, color } = getDaysUntil(event.eventDate);
            return (
              <Link
                key={event.id}
                href={`/dashboard/inquiries/${event.id}`}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group border border-transparent hover:border-white/[0.06]"
              >
                {/* Countdown badge */}
                <div className={`shrink-0 w-12 h-12 rounded-xl border flex flex-col items-center justify-center ${color}`}>
                  <span className="text-sm font-display font-bold leading-none">{label}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-white leading-snug">{event.clientName}</p>
                      <p className="text-xs text-white/40 mt-0.5">{event.eventType}</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 shrink-0">
                      {formatCurrency(event.budget)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <CalendarCheck size={10} />
                      {formatDate(event.eventDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={10} />
                      {event.guestCount}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin size={10} />
                      <span className="truncate">{event.eventLocation.split(",")[0]}</span>
                    </span>
                  </div>
                </div>
                <ArrowRight size={13} className="text-white/15 group-hover:text-white/40 transition-colors shrink-0 mt-1" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
