import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Shield, FileText, Lock, Cookie, UserX, HelpCircle, Mail, Activity } from "lucide-react";

const POLICY_LINKS = [
  { href: "/terms", label: "Terms of Service", icon: FileText },
  { href: "/privacy", label: "Privacy Policy", icon: Shield },
  { href: "/acceptable-use", label: "Acceptable Use", icon: Lock },
  { href: "/cookies", label: "Cookie & Storage", icon: Cookie },
  { href: "/account-deletion", label: "Account & Data Erasure", icon: UserX },
  { href: "/security", label: "Security & Encryption", icon: Shield },
  { href: "/help", label: "Help Center", icon: HelpCircle },
  { href: "/contact", label: "Contact & Legal Inquiries", icon: Mail },
];

export default function LegalLayout({
  title,
  updated,
  badge = "Legal & Compliance",
  children,
}: {
  title: string;
  updated: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo size={26} />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors"
            >
              <ArrowLeft size={14} /> Back to home
            </Link>
            <Link
              href="/create"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              Start meeting
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-slate-200/80 shadow-sm rounded-xl p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5 block">
                Compliance &amp; Legal
              </span>
              <nav className="space-y-1">
                {POLICY_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <Icon size={14} className="text-blue-600 shrink-0" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 mt-4 border-t border-slate-100 px-3">
                <div className="text-[11px] text-slate-400">
                  Certified WebRTC standard compliance for real-time simultaneous streams.
                </div>
              </div>
            </div>
          </aside>

          {/* Main Legal Content Article */}
          <main className="lg:col-span-3">
            <article className="bg-white border border-slate-200/80 shadow-sm rounded-xl p-8 sm:p-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 mb-3">
                <Shield size={12} />
                <span>{badge}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mt-1">
                {title}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 pb-6 border-b border-slate-100">
                <span>Effective Date: {updated}</span>
                <span>•</span>
                <span>Version 2.4.0 (Global Edition)</span>
              </div>

              <div className="mt-8 space-y-8 text-sm text-slate-600 leading-relaxed font-normal">
                {children}
              </div>
            </article>

            {/* Footer Attribution & Trust */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 px-2">
              <div>
                Duet Meet • Zero-storage encrypted peer signaling architecture
              </div>
              <div className="font-medium text-slate-500">
                Made with ❤️ by Rahul Pandiyan
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
