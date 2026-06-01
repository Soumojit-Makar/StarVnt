// app/dashboard/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const profile = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    select: { vendorName: true, imageUrl: true, category: true },
  });

  const vendor = {
    name:     profile?.vendorName || session.user.name || "Vendor",
    email:    session.user.email || "",
    image:    profile?.imageUrl || session.user.image || null,
    category: profile?.category || "Event Management",
    role:     session.user.role || "VENDOR",
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      <Sidebar vendor={vendor} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav vendor={vendor} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7">
          <div className="max-w-7xl mx-auto page-fade">{children}</div>
        </main>
      </div>
    </div>
  );
}
