// components/dashboard/ProfileCard.tsx
import { MapPin, Tag, Star, CalendarCheck } from "lucide-react";

interface ProfileCardProps {
  profile: {
    vendorName: string;
    category: string;
    location: string;
    rating: number;
    totalEvents: number;
    imageUrl: string;
  };
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="card p-6 text-center">
      {/* Avatar */}
      <div className="relative inline-flex mx-auto mb-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500/30 to-brand-600/10 border border-brand-500/25 flex items-center justify-center text-3xl font-display font-bold text-brand-400">
          {profile.vendorName?.charAt(0)?.toUpperCase() || "V"}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#111]" />
      </div>

      <h3 className="font-display font-bold text-white text-lg">{profile.vendorName || "Your Name"}</h3>

      <div className="flex items-center justify-center gap-1.5 mt-1.5 text-white/40 text-sm">
        <Tag size={12} />
        <span>{profile.category || "Event Management"}</span>
      </div>

      {profile.location && (
        <div className="flex items-center justify-center gap-1.5 mt-1 text-white/30 text-xs">
          <MapPin size={11} />
          <span>{profile.location}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-white/[0.06]">
        <div className="bg-white/[0.03] rounded-xl p-3">
          <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
            <Star size={12} fill="currentColor" />
            <span className="text-base font-display font-bold text-white">{profile.rating?.toFixed(1)}</span>
          </div>
          <p className="text-xs text-white/30">Rating</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-3">
          <div className="flex items-center justify-center gap-1 text-brand-400 mb-1">
            <CalendarCheck size={12} />
            <span className="text-base font-display font-bold text-white">{profile.totalEvents}</span>
          </div>
          <p className="text-xs text-white/30">Events</p>
        </div>
      </div>

      <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Active Vendor
      </div>
    </div>
  );
}
