"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button, Card, Input } from "@/components/ui";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function join() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name: name || "Guest" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      sessionStorage.setItem(`duet:token:${data.code}`, data.token);
      sessionStorage.setItem(`duet:url:${data.code}`, data.url);
      sessionStorage.setItem(`duet:name:${data.code}`, name || "Guest");
      if (data.isHost) sessionStorage.setItem(`duet:host:${data.code}`, "1");
      router.push(`/lobby/${data.code}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-app-bg flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8">
        <Logo />
        <h1 className="text-2xl font-bold text-text-primary mt-4">Join a meeting</h1>
        <p className="text-sm text-text-secondary mt-1">Enter a meeting code to join.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-text-primary">Meeting code</label>
            <Input className="mt-1 uppercase" value={code} onChange={(e) => setCode(e.target.value)} placeholder="ABC-DEF-GHI" />
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary">Your name</label>
            <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Guest" />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button className="w-full" onClick={join} disabled={loading || !code.trim()}>
            {loading ? "Joining..." : "Join meeting"}
          </Button>
          <a href="/create" className="block text-center text-sm text-primary hover:underline">Create a new meeting</a>
        </div>
      </Card>
    </main>
  );
}
