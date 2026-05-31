// app/dashboard/inquiries/[id]/page.tsx
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getInquiryById } from "@/lib/actions";
import InquiryDetail from "@/components/dashboard/InquiryDetail";

interface Props {
  params: { id: string };
}

export default async function InquiryDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const inquiry = await getInquiryById(params.id, session.user.id);
  if (!inquiry) notFound();

  return <InquiryDetail inquiry={inquiry} />;
}
