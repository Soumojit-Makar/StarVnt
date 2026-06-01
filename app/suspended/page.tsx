// app/suspended/page.tsx
import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import { ShieldAlert, Mail } from "lucide-react";

export default async function SuspendedPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldAlert size={28} className="text-red-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Account Suspended</h1>
          <p className="text-white/45 text-sm mt-3 leading-relaxed">
            Your vendor account has been suspended by an administrator. Please contact
            support to resolve this issue.
          </p>
          {session?.user?.email && (
            <p className="text-white/30 text-xs mt-2">Signed in as {session.user.email}</p>
          )}
        </div>

        <div className="card p-5 text-left">
          <div className="flex items-center gap-3 mb-3">
            <Mail size={15} className="text-brand-400" />
            <p className="text-sm font-semibold text-white">Contact Support</p>
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            Email us at{" "}
            <a href="mailto:support@starvnt.com" className="text-brand-400 hover:text-brand-300 transition-colors">
              support@starvnt.com
            </a>{" "}
            with your account email and a brief description of your situation.
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit" className="btn-secondary w-full justify-center">
            Sign Out
          </button>
        </form>
      </div>
    </main>
  );
}
