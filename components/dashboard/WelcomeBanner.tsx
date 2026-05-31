// components/dashboard/WelcomeBanner.tsx
import { Sparkles } from "lucide-react";

export default function WelcomeBanner({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500/10 via-brand-600/5 to-transparent border border-brand-500/15 p-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-brand-400" />
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">Dashboard</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            {greeting}, {name.split(" ")[0]} 👋
          </h2>
          <p className="text-white/45 text-sm mt-1">
            Here&apos;s what&apos;s happening with your bookings today.
          </p>
        </div>
      </div>
    </div>
  );
}
