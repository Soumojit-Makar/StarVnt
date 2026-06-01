// app/dashboard/calendar/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getManualEvents } from "@/lib/actions";
import CalendarView from "@/components/dashboard/CalendarView";
import { CalendarDays, Plus } from "lucide-react";

export default async function CalendarPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [confirmed, pending, manualEvents] = await Promise.all([
    prisma.eventInquiry.findMany({
      where: { vendorId: session.user.id, status: "CONFIRMED" },
      orderBy: { eventDate: "asc" },
      select: { id: true, clientName: true, eventType: true, eventDate: true, eventLocation: true, guestCount: true, budget: true, status: true },
    }),
    prisma.eventInquiry.findMany({
      where: { vendorId: session.user.id, status: { in: ["NEW", "CONTACTED"] }, eventDate: { gte: new Date() } },
      orderBy: { eventDate: "asc" },
      select: { id: true, clientName: true, eventType: true, eventDate: true, eventLocation: true, guestCount: true, budget: true, status: true },
    }),
    getManualEvents(session.user.id),
  ]);

  const totalEvents = confirmed.length + pending.length + manualEvents.length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <CalendarDays size={20} className="text-brand-400" />
            Event Calendar
          </h2>
          <p className="text-white/40 text-sm mt-0.5">
            {confirmed.length} confirmed &middot; {pending.length} pending &middot; {manualEvents.length} manual
          </p>
        </div>
      </div>
      <CalendarView confirmed={confirmed} pending={pending} manualEvents={manualEvents} />
    </div>
  );
}
