// components/dashboard/TablePagination.tsx
"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentPage: number;
  totalPages: number;
  status: string;
}

export default function TablePagination({ currentPage, totalPages, status }: Props) {
  const router = useRouter();

  if (totalPages <= 1) return null;

  function navigate(page: number) {
    router.push(`/dashboard/inquiries?status=${status}&page=${page}`);
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-white/30">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all",
            currentPage === 1
              ? "border-white/[0.05] text-white/20 cursor-not-allowed"
              : "border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.06]"
          )}
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={() => navigate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all",
            currentPage === totalPages
              ? "border-white/[0.05] text-white/20 cursor-not-allowed"
              : "border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.06]"
          )}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
