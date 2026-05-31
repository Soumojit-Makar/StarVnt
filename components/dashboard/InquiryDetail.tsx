// components/dashboard/InquiryDetail.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { updateInquiryStatus } from "@/lib/actions";
import { formatDate, formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Users,
  Wallet,
  MessageSquare,
  Tag,
  RefreshCw,
  Loader2,
} from "lucide-react";

const statusOptions = [
  { value: "NEW", label: "New", desc: "Inquiry just received" },
  { value: "CONTACTED", label: "Contacted", desc: "Client has been contacted" },
  { value: "CONFIRMED", label: "Confirmed", desc: "Booking is confirmed" },
  { value: "REJECTED", label: "Rejected", desc: "Inquiry rejected" },
];

interface Inquiry {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  eventType: string;
  eventDate: Date;
  eventLocation: string;
  guestCount: number;
  budget: number;
  message: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function InquiryDetail({ inquiry }: { inquiry: Inquiry }) {
  const [status, setStatus] = useState(inquiry.status);
  const [selectedStatus, setSelectedStatus] = useState(inquiry.status);
  const [isPending, startTransition] = useTransition();

  function handleStatusUpdate() {
    const fd = new FormData();
    fd.append("status", selectedStatus);

    startTransition(async () => {
      const res = await updateInquiryStatus(inquiry.id, fd);
      if (res.error) {
        toast.error(res.error);
      } else {
        setStatus(selectedStatus);
        toast.success("Status updated successfully");
      }
    });
  }

  const detailItems = [
    { icon: User, label: "Client Name", value: inquiry.clientName },
    { icon: Mail, label: "Email", value: inquiry.clientEmail },
    { icon: Phone, label: "Phone", value: inquiry.clientPhone || "Not provided" },
    { icon: Tag, label: "Event Type", value: inquiry.eventType },
    { icon: Calendar, label: "Event Date", value: formatDate(inquiry.eventDate) },
    { icon: MapPin, label: "Location", value: inquiry.eventLocation },
    { icon: Users, label: "Guest Count", value: inquiry.guestCount.toLocaleString() },
    { icon: Wallet, label: "Budget", value: formatCurrency(inquiry.budget) },
  ];

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Back + header */}
      <div className="flex items-start gap-4">
        <Link href="/dashboard/inquiries" className="btn-ghost mt-0.5 shrink-0">
          <ArrowLeft size={14} />
          Back
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-display text-xl font-bold text-white">{inquiry.clientName}</h2>
            <span className={`status-badge ${getStatusColor(status)}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {getStatusLabel(status)}
            </span>
          </div>
          <p className="text-white/40 text-sm mt-0.5">
            {inquiry.eventType} · Received {formatDate(inquiry.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Details */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-display font-semibold text-white mb-5">Inquiry Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {detailItems.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white/[0.04] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon size={13} className="text-white/40" />
                </div>
                <div>
                  <p className="text-xs text-white/30 font-medium">{item.label}</p>
                  <p className="text-sm text-white/80 mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {inquiry.message && (
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={14} className="text-white/40" />
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider">Client Message</p>
              </div>
              <p className="text-sm text-white/70 leading-relaxed bg-white/[0.02] rounded-xl p-4 border border-white/[0.05]">
                {inquiry.message}
              </p>
            </div>
          )}
        </div>

        {/* Status Update */}
        <div className="card p-6 h-fit">
          <div className="flex items-center gap-2 mb-5">
            <RefreshCw size={14} className="text-brand-400" />
            <h3 className="font-display font-semibold text-white">Update Status</h3>
          </div>

          <div className="space-y-2 mb-5">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedStatus(opt.value)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedStatus === opt.value
                    ? "border-brand-500/40 bg-brand-500/10"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                      selectedStatus === opt.value ? "border-brand-500" : "border-white/20"
                    }`}
                  >
                    {selectedStatus === opt.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${selectedStatus === opt.value ? "text-white" : "text-white/60"}`}>
                    {opt.label}
                  </span>
                </div>
                <p className="text-xs text-white/30 mt-1 ml-5">{opt.desc}</p>
              </button>
            ))}
          </div>

          <button
            onClick={handleStatusUpdate}
            disabled={isPending || selectedStatus === status}
            className="btn-primary w-full justify-center"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Updating…
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                Save Status
              </>
            )}
          </button>

          {selectedStatus === status && (
            <p className="text-xs text-white/25 text-center mt-2">Current status is already selected</p>
          )}

          <div className="mt-5 pt-5 border-t border-white/[0.06]">
            <p className="text-xs text-white/25 text-center">
              Last updated {formatDate(inquiry.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
