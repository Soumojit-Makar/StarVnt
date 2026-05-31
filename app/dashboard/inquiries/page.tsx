// app/dashboard/inquiries/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getInquiries } from "@/lib/actions";
import InquiriesTable from "@/components/dashboard/InquiriesTable";
import InquiriesFilter from "@/components/dashboard/InquiriesFilter";
import { Inbox } from "lucide-react";

interface Props {
  searchParams: { status?: string; page?: string };
}

export default async function InquiriesPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const status = searchParams.status || "ALL";
  const page = parseInt(searchParams.page || "1");
  const { inquiries, total, pages } = await getInquiries(session.user.id, page, status);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Inbox size={20} className="text-brand-400" />
            Event Inquiries
          </h2>
          <p className="text-white/40 text-sm mt-0.5">{total} total inquiries</p>
        </div>
      </div>

      <InquiriesFilter activeStatus={status} />
      <InquiriesTable inquiries={inquiries} currentPage={page} totalPages={pages} status={status} />
    </div>
  );
}
