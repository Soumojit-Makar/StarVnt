// app/admin/vendors/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllVendors } from "@/lib/actions";
import AdminVendorTable from "@/components/admin/AdminVendorTable";
import { Users } from "lucide-react";

export default async function AdminVendorsPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") redirect("/dashboard");

  const vendors = await getAllVendors();
  const active    = vendors.filter((v) => v.accountStatus === "ACTIVE").length;
  const suspended = vendors.filter((v) => v.accountStatus === "SUSPENDED").length;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Users size={20} className="text-violet-400" />
            Vendor Management
          </h2>
          <p className="text-white/40 text-sm mt-0.5">
            {vendors.length} total &middot; {active} active &middot; {suspended} suspended
          </p>
        </div>
      </div>
      <AdminVendorTable vendors={vendors} />
    </div>
  );
}
