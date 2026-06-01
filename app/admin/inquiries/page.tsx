// app/admin/inquiries/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import { Inbox, MapPin } from "lucide-react";

export default async function AdminInquiriesPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") redirect("/dashboard");

  const inquiries = await prisma.eventInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      vendor: {
        select: {
          email: true,
          vendorProfile: { select: { vendorName: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <Inbox size={20} className="text-blue-400" />
          All Inquiries
        </h2>
        <p className="text-white/40 text-sm mt-0.5">
          {inquiries.length} most recent platform-wide inquiries
        </p>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full hidden md:table">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {["Client", "Vendor", "Event", "Date", "Budget", "Status"].map((h) => (
                <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5">
                  <p className="text-sm font-semibold text-white">{inq.clientName}</p>
                  <p className="text-xs text-white/35">{inq.clientEmail}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-white/70">{inq.vendor.vendorProfile?.vendorName || "—"}</p>
                  <p className="text-xs text-white/30">{inq.vendor.email}</p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-sm text-white/80">{inq.eventType}</p>
                  <p className="text-xs text-white/30 flex items-center gap-1">
                    <MapPin size={10} />{inq.eventLocation}
                  </p>
                </td>
                <td className="px-5 py-3.5 text-sm text-white/60">{formatDate(inq.eventDate)}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-white">{formatCurrency(inq.budget)}</td>
                <td className="px-5 py-3.5">
                  <span className={`status-badge ${getStatusColor(inq.status)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {getStatusLabel(inq.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-white/[0.05]">
          {inquiries.map((inq) => (
            <div key={inq.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-white">{inq.clientName}</p>
                  <p className="text-xs text-white/40">{inq.eventType}</p>
                </div>
                <span className={`status-badge ${getStatusColor(inq.status)} shrink-0`}>
                  {getStatusLabel(inq.status)}
                </span>
              </div>
              <p className="text-xs text-white/40">Vendor: {inq.vendor.vendorProfile?.vendorName || inq.vendor.email}</p>
              <div className="flex items-center gap-3 text-xs text-white/30">
                <span>{formatDate(inq.eventDate)}</span>
                <span className="text-white/60 font-semibold">{formatCurrency(inq.budget)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
