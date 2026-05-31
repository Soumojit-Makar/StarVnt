// app/login/page.tsx
import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login — StarVnt Vendor Portal",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-100 pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 page-fade">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-500/10 border border-brand-500/20 rounded-2xl mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="#f97316"
                stroke="#f97316"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">StarVnt</h1>
          <p className="text-white/40 text-sm mt-2 font-medium">Vendor Management Portal</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <div className="mb-7">
            <h2 className="font-display text-xl font-semibold text-white">Welcome back</h2>
            <p className="text-white/40 text-sm mt-1">Sign in to manage your bookings</p>
          </div>
          <LoginForm />
          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <p className="text-xs text-white/30 text-center">
              Demo credentials —{" "}
              <span className="text-white/50 font-mono">vendor@starvnt.com</span> /{" "}
              <span className="text-white/50 font-mono">Vendor@123</span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
