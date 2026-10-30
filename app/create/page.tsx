"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button, Card, Input } from "@/components/ui";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function CreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function create(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostName: name.trim() || "Host" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create meeting");
      sessionStorage.setItem(`duet:host:${data.code}`, data.hostToken);
      sessionStorage.setItem(`duet:token:${data.code}`, data.token);
      sessionStorage.setItem(`duet:url:${data.code}`, data.url);
      sessionStorage.setItem(`duet:name:${data.code}`, name.trim() || "Host");
      router.push(`/lobby/${data.code}`);
    } catch (e: any) {
      setError(e.message || "Failed to create meeting");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-4 sm:p-6">
      <header className="max-w-md mx-auto w-full flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors py-1">
          <ArrowLeft size={14} /> Back to home
        </Link>
      </header>

      <div className="w-full max-w-md mx-auto my-auto py-4">
        <Card className="p-6 sm:p-8 bg-white border border-slate-200/90 shadow-card rounded-2xl">
          <div className="flex items-center justify-between">
            <Logo size={28} />
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Host</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mt-6 tracking-tight">Create a meeting</h1>
          <p className="text-sm text-slate-500 mt-1">
            Start an instant room with multi-screen sharing enabled.
          </p>

          <form onSubmit={create} className="mt-6 space-y-4">
            <div>
              <label htmlFor="host-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Display Name
              </label>
              <Input
                id="host-name"
                autoFocus
                className="h-10 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex (Host)"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-10 mt-2" disabled={loading} loading={loading}>
              {loading ? "Starting room..." : "Start instant meeting"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Have a meeting code?{" "}
              <Link href="/join" className="font-medium text-blue-600 hover:underline">
                Join an existing meeting
              </Link>
            </p>
          </div>
        </Card>
      </div>

      <footer className="text-center text-xs text-slate-400 py-4">
        Protected by end-to-end WebRTC peer encryption.
      </footer>
    </main>
  );
}
