// components/dashboard/SupportPanel.tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  ChevronDown, ChevronUp, Mail, MessageCircle,
  BookOpen, Video, ExternalLink, Send, Loader2,
} from "lucide-react";

const faqs = [
  { q: "How do I confirm an inquiry?", a: "Go to Inquiries → click any inquiry → use the Status panel on the right to select 'Confirmed' and click Save Status. The client and your dashboard will reflect the change immediately." },
  { q: "Can I edit an inquiry after it's confirmed?", a: "You can update the status of any inquiry at any time. For full inquiry edits (dates, guest count, budget), please contact StarVnt support as these affect billing and contracts." },
  { q: "How do I update my vendor profile?", a: "Navigate to Profile in the sidebar. You can update your business name, category, location, contact details, and description. Changes are saved immediately to the database." },
  { q: "Why are some events not showing in the calendar?", a: "The calendar shows all CONFIRMED events plus pending (NEW/CONTACTED) future events. Rejected or past events without confirmed status are not shown by default." },
  { q: "How is my revenue calculated?", a: "Revenue is calculated as the sum of the 'Budget' field across all CONFIRMED inquiries. It represents the potential contract value, not actual payments received." },
  { q: "Can I have multiple vendor accounts?", a: "Currently one account per email is supported. If you manage multiple businesses, contact support for a multi-profile setup." },
  { q: "How do I change my password?", a: "Go to Settings → Password & Security section → fill in your current and new password and click Update Password." },
  { q: "Is my data secure?", a: "Yes. Passwords are hashed with bcrypt (12 salt rounds), sessions are JWT-based with server-side validation, and all routes are protected by middleware authentication." },
];

const resources = [
  { icon: BookOpen, label: "Vendor Handbook", desc: "Complete guide to using the portal", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { icon: Video, label: "Video Tutorials", desc: "Step-by-step walkthrough videos", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { icon: MessageCircle, label: "Community Forum", desc: "Connect with other vendors", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
];

export default function SupportPanel() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Support ticket submitted! We'll reply within 24 hours.");
    setForm({ subject: "", message: "" });
    setSending(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-5xl">
      {/* FAQs + Contact */}
      <div className="lg:col-span-2 space-y-5">
        {/* FAQ accordion */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-white mb-5">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/[0.06] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <span className={`text-sm font-medium ${openFaq === i ? "text-white" : "text-white/70"}`}>
                    {faq.q}
                  </span>
                  {openFaq === i
                    ? <ChevronUp size={15} className="text-brand-400 shrink-0 ml-3" />
                    : <ChevronDown size={15} className="text-white/30 shrink-0 ml-3" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 border-t border-white/[0.05]">
                    <p className="text-sm text-white/55 leading-relaxed pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center justify-center">
              <Mail size={15} className="text-brand-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-white">Contact Support</h3>
              <p className="text-xs text-white/35">We respond within 24 hours on business days</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Subject</label>
              <input
                type="text"
                className="input"
                placeholder="Briefly describe your issue"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea
                className="input resize-none"
                rows={5}
                placeholder="Describe your issue in detail — include inquiry IDs if relevant…"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
              />
            </div>
            <button type="submit" disabled={sending} className="btn-primary">
              {sending
                ? <><Loader2 size={14} className="animate-spin" />Sending…</>
                : <><Send size={14} />Send Message</>}
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Quick contact */}
        <div className="card p-5">
          <h4 className="font-display font-semibold text-white text-sm mb-4">Quick Contact</h4>
          <div className="space-y-3">
            <a
              href="mailto:support@starvnt.com"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all group"
            >
              <div className="w-8 h-8 bg-brand-500/10 border border-brand-500/20 rounded-lg flex items-center justify-center">
                <Mail size={13} className="text-brand-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Email Support</p>
                <p className="text-[10px] text-white/35">support@starvnt.com</p>
              </div>
              <ExternalLink size={11} className="text-white/20 group-hover:text-white/50 ml-auto transition-colors" />
            </a>
            <a
              href="https://wa.me/919876543210"
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all group"
            >
              <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                <MessageCircle size={13} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">WhatsApp</p>
                <p className="text-[10px] text-white/35">+91 98765 43210</p>
              </div>
              <ExternalLink size={11} className="text-white/20 group-hover:text-white/50 ml-auto transition-colors" />
            </a>
          </div>
        </div>

        {/* Resources */}
        <div className="card p-5">
          <h4 className="font-display font-semibold text-white text-sm mb-4">Resources</h4>
          <div className="space-y-2">
            {resources.map((r) => (
              <button
                key={r.label}
                onClick={() => toast("Coming soon!", { icon: "📚" })}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all text-left group"
              >
                <div className={`w-8 h-8 ${r.bg} border ${r.border} rounded-lg flex items-center justify-center shrink-0`}>
                  <r.icon size={13} className={r.color} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{r.label}</p>
                  <p className="text-[10px] text-white/35">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Status indicator */}
        <div className="card p-5">
          <h4 className="font-display font-semibold text-white text-sm mb-3">System Status</h4>
          <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-semibold">All systems operational</span>
          </div>
          <p className="text-[10px] text-white/25 mt-2 text-center">Last checked: just now</p>
        </div>
      </div>
    </div>
  );
}
