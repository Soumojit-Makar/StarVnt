// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardStats, getVendorProfile } from "@/lib/actions";
import StatsGrid from "@/components/dashboard/StatsGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [stats, { profile }] = await Promise.all([
    getDashboardStats(session.user.id),
    getVendorProfile(session.user.id),
  ]);

  return (
    <div className="space-y-6">
      <WelcomeBanner name={profile?.vendorName || session.user.name || "Vendor"} />
      <StatsGrid stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentActivity activities={stats.recent} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
