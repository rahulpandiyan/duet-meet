import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo size={26} />
          </Link>
          <Link
            href="/"
            className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <Card className="p-8 sm:p-12 bg-white border border-slate-200 shadow-card">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Legal &amp; Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-2">
            {title}
          </h1>
          <p className="text-xs text-slate-400 mt-2 pb-6 border-b border-slate-100">
            Last modified: {updated}
          </p>

          <div className="mt-6 space-y-5 text-sm text-slate-600 leading-relaxed font-normal">
            {children}
          </div>
        </Card>

        <div className="mt-8 text-center text-xs text-slate-400">
          Duet Meet • Real-time simultaneous screen sharing protocol
        </div>
      </main>
    </div>
  );
}
