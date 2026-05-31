// components/dashboard/InquiriesFilter.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const filters = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "REJECTED", label: "Rejected" },
];

export default function InquiriesFilter({ activeStatus }: { activeStatus: string }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => router.push(`${pathname}?status=${f.value}`)}
          className={cn(
            "px-4 py-1.5 rounded-xl text-sm font-medium border transition-all duration-200",
            activeStatus === f.value
              ? "bg-brand-500/15 text-brand-400 border-brand-500/25"
              : "bg-white/[0.03] text-white/50 border-white/[0.07] hover:bg-white/[0.06] hover:text-white/70"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
