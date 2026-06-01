// app/dashboard/support/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SupportPanel from "@/components/dashboard/SupportPanel";
import { LifeBuoy } from "lucide-react";

export default async function SupportPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <LifeBuoy size={20} className="text-brand-400" />
          Help & Support
        </h2>
        <p className="text-white/40 text-sm mt-0.5">FAQs, guides, and contact options</p>
      </div>
      <SupportPanel />
    </div>
  );
}
