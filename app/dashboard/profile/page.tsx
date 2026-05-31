// app/dashboard/profile/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getVendorProfile } from "@/lib/actions";
import ProfileForm from "@/components/dashboard/ProfileForm";
import ProfileCard from "@/components/dashboard/ProfileCard";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { user, profile } = await getVendorProfile(session.user.id);

  const defaults = {
    vendorName: profile?.vendorName || session.user.name || "",
    category: profile?.category || "",
    location: profile?.location || "",
    email: user?.email || session.user.email || "",
    phone: profile?.phone || "",
    description: profile?.description || "",
    imageUrl: profile?.imageUrl || "",
    rating: profile?.rating || 0,
    totalEvents: profile?.totalEvents || 0,
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="font-display text-xl font-bold text-white">Vendor Profile</h2>
        <p className="text-white/40 text-sm mt-0.5">Manage your public profile and business information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <ProfileCard profile={defaults} />
        </div>
        <div className="lg:col-span-2">
          <ProfileForm defaults={defaults} />
        </div>
      </div>
    </div>
  );
}
