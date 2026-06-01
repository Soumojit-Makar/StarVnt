// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardStats, getVendorProfile } from "@/lib/actions";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import InquiryStatusBreakdown from "@/components/dashboard/InquiryStatusBreakdown";
import RevenueCard from "@/components/dashboard/RevenueCard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [stats, { profile }] = await Promise.all([
    getDashboardStats(session.user.id),
    getVendorProfile(session.user.id),
  ]);

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <WelcomeBanner name={profile?.vendorName || session.user.name || "Vendor"} />

      {/* 4 stat cards */}
      <StatsGrid stats={stats} />

      {/* Row 2: Revenue + Breakdown + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <RevenueCard totalRevenue={stats.totalRevenue} confirmed={stats.confirmed} />
        <InquiryStatusBreakdown stats={stats} />
        <QuickActions />
      </div>

      {/* Row 3: Upcoming Events + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <UpcomingEvents events={stats.upcomingEvents} />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity activities={stats.recent} />
        </div>
      </div>
    </div>
  );
}
