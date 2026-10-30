import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button, Card } from "@/components/ui";
import { CheckCircle2, Home, Plus } from "lucide-react";

export default function EndedPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-6">
      <header className="max-w-md mx-auto w-full flex items-center justify-center pt-4">
        <Logo size={28} />
      </header>

      <div className="w-full max-w-md mx-auto my-auto">
        <Card className="p-8 bg-white border border-slate-200/90 shadow-card text-center">
          <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 size={24} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">You left the meeting</h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Thank you for using Duet. Your session has ended and all media tracks have been securely disconnected.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link href="/create">
              <Button size="lg" className="w-full h-10 gap-2">
                <Plus size={15} />
                <span>Start a new meeting</span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="lg" className="w-full h-10 gap-2">
                <Home size={15} />
                <span>Return to home</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <footer className="text-center text-xs text-slate-400 py-4">
        Duet Meet • Simultaneous screen sharing engine
      </footer>
    </main>
  );
}
