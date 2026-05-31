// components/dashboard/InquiriesTable.tsx
import Link from "next/link";
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import { ChevronRight, Inbox, Users, Calendar, MapPin } from "lucide-react";
import TablePagination from "@/components/dashboard/TablePagination";

interface Inquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  eventType: string;
  eventDate: Date;
  eventLocation: string;
  guestCount: number;
  budget: number;
  status: string;
  createdAt: Date;
}

interface Props {
  inquiries: Inquiry[];
  currentPage: number;
  totalPages: number;
  status: string;
}

export default function InquiriesTable({ inquiries, currentPage, totalPages, status }: Props) {
  if (inquiries.length === 0) {
    return (
      <div className="card py-20 text-center">
        <Inbox size={40} className="text-white/10 mx-auto mb-3" />
        <p className="text-white/40 font-medium">No inquiries found</p>
        <p className="text-white/20 text-sm mt-1">
          {status !== "ALL" ? `No ${status.toLowerCase()} inquiries yet` : "Inquiries will appear here"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="card overflow-hidden hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.05]">
              <th className="text-left px-5 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Client</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Event</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Date</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Guests</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Budget</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-white/30 uppercase tracking-wider">Status</th>
              <th className="px-5 py-4" />
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq, i) => (
              <tr
                key={inq.id}
                className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-white">{inq.clientName}</p>
                  <p className="text-xs text-white/35 mt-0.5">{inq.clientEmail}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-white/80">{inq.eventType}</p>
                  <p className="text-xs text-white/35 mt-0.5 flex items-center gap-1">
                    <MapPin size={10} />
                    {inq.eventLocation}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-white/70">{formatDate(inq.eventDate)}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm text-white/70">{inq.guestCount.toLocaleString()}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-white">{formatCurrency(inq.budget)}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`status-badge ${getStatusColor(inq.status)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {getStatusLabel(inq.status)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/dashboard/inquiries/${inq.id}`}
                    className="flex items-center gap-1 text-xs text-white/30 hover:text-brand-400 transition-colors group-hover:text-white/50"
                  >
                    View <ChevronRight size={13} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {inquiries.map((inq) => (
          <Link
            key={inq.id}
            href={`/dashboard/inquiries/${inq.id}`}
            className="card p-4 flex flex-col gap-3 active:scale-[0.99] transition-transform"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white text-sm">{inq.clientName}</p>
                <p className="text-xs text-white/40">{inq.eventType}</p>
              </div>
              <span className={`status-badge ${getStatusColor(inq.status)} shrink-0`}>
                {getStatusLabel(inq.status)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(inq.eventDate)}</span>
              <span className="flex items-center gap-1"><Users size={11} />{inq.guestCount}</span>
              <span className="font-semibold text-white/60">{formatCurrency(inq.budget)}</span>
            </div>
          </Link>
        ))}
      </div>

      <TablePagination currentPage={currentPage} totalPages={totalPages} status={status} />
    </div>
  );
}
