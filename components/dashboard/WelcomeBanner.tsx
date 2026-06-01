// components/dashboard/WelcomeBanner.tsx
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function WelcomeBanner({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const day = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500/12 via-brand-600/5 to-transparent border border-brand-500/15 p-5 md:p-6">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-violet-500/5 rounded-full translate-y-1/2 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={13} className="text-brand-400" />
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">{day}</span>
          </div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-white">
            {greeting}, {name.split(" ")[0]} 👋
          </h2>
          <p className="text-white/40 text-sm mt-1">
            Here&apos;s a snapshot of your business today.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/dashboard/inquiries?status=NEW"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500/15 border border-brand-500/25 text-brand-400 text-xs font-semibold hover:bg-brand-500/25 transition-all">
            New Inquiries <ArrowRight size={12} />
          </Link>
          <Link href="/dashboard/analytics"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/60 text-xs font-semibold hover:text-white hover:bg-white/[0.08] transition-all">
            Analytics <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
