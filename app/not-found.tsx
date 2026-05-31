// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-8xl font-display font-bold text-white/5 mb-2">404</p>
        <h1 className="font-display text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-white/40 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
