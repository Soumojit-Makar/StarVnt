// app/dashboard/analytics/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";
import { BarChart3 } from "lucide-react";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const now = new Date();

  // Last 6 months inquiry counts per month
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [allInquiries, confirmedInquiries, eventTypeBreakdown, monthlyInquiries] =
    await Promise.all([
      prisma.eventInquiry.findMany({
        where: { vendorId: session.user.id },
        select: { status: true, budget: true, createdAt: true, eventDate: true, eventType: true },
      }),
      prisma.eventInquiry.findMany({
        where: { vendorId: session.user.id, status: "CONFIRMED" },
        select: { budget: true, eventDate: true, eventType: true, createdAt: true },
        orderBy: { eventDate: "asc" },
      }),
      prisma.eventInquiry.groupBy({
        by: ["eventType"],
        where: { vendorId: session.user.id },
        _count: { _all: true },
        _sum: { budget: true },
        orderBy: { _count: { eventType: "desc" } },
      }),
      prisma.eventInquiry.findMany({
        where: { vendorId: session.user.id, createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true, status: true, budget: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

  // Build monthly chart data (last 6 months)
  const monthLabels: string[] = [];
  const monthlyData: { month: string; total: number; confirmed: number; revenue: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleString("default", { month: "short" });
    const year = d.getFullYear();
    const month = d.getMonth();
    const inMonth = monthlyInquiries.filter((inq) => {
      const c = new Date(inq.createdAt);
      return c.getMonth() === month && c.getFullYear() === year;
    });
    monthLabels.push(label);
    monthlyData.push({
      month: label,
      total: inMonth.length,
      confirmed: inMonth.filter((i) => i.status === "CONFIRMED").length,
      revenue: inMonth.filter((i) => i.status === "CONFIRMED").reduce((s, i) => s + i.budget, 0),
    });
  }

  const totalRevenue = confirmedInquiries.reduce((s, i) => s + i.budget, 0);
  const avgBudget = confirmedInquiries.length > 0 ? totalRevenue / confirmedInquiries.length : 0;
  const conversionRate =
    allInquiries.length > 0
      ? Math.round((confirmedInquiries.length / allInquiries.length) * 100)
      : 0;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 size={20} className="text-brand-400" />
          Analytics
        </h2>
        <p className="text-white/40 text-sm mt-0.5">Performance overview for your vendor account</p>
      </div>
      <AnalyticsDashboard
        monthlyData={monthlyData}
        eventTypeBreakdown={eventTypeBreakdown}
        totalRevenue={totalRevenue}
        avgBudget={avgBudget}
        conversionRate={conversionRate}
        totalInquiries={allInquiries.length}
        totalConfirmed={confirmedInquiries.length}
      />
    </div>
  );
}
