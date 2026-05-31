// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    NEW: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    CONTACTED: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    CONFIRMED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/15 text-red-400 border-red-500/20",
  };
  return colors[status] || "bg-gray-500/15 text-gray-400 border-gray-500/20";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    NEW: "New",
    CONTACTED: "Contacted",
    CONFIRMED: "Confirmed",
    REJECTED: "Rejected",
  };
  return labels[status] || status;
}
