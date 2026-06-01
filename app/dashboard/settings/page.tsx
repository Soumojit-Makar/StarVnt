// app/dashboard/settings/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsPanel from "@/components/dashboard/SettingsPanel";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true, createdAt: true },
  });

  const profile = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    select: { vendorName: true, category: true, location: true },
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <Settings size={20} className="text-brand-400" />
          Settings
        </h2>
        <p className="text-white/40 text-sm mt-0.5">Manage your account preferences and security</p>
      </div>
      <SettingsPanel
        email={user?.email || ""}
        name={user?.name || ""}
        vendorName={profile?.vendorName || ""}
        memberSince={user?.createdAt || new Date()}
      />
    </div>
  );
}
