// app/admin/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopNav from "@/components/admin/AdminTopNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const admin = {
    name: session.user.name || "Admin",
    email: session.user.email || "",
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      <AdminSidebar admin={admin} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopNav admin={admin} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7">
          <div className="max-w-7xl mx-auto page-fade">{children}</div>
        </main>
      </div>
    </div>
  );
}
