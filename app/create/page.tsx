"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button, Card, Input } from "@/components/ui";

export default function CreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function create() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostName: name || "Host" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      sessionStorage.setItem(`duet:host:${data.code}`, data.hostToken);
      sessionStorage.setItem(`duet:token:${data.code}`, data.token);
      sessionStorage.setItem(`duet:url:${data.code}`, data.url);
      sessionStorage.setItem(`duet:name:${data.code}`, name || "Host");
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
        <h1 className="text-2xl font-bold text-text-primary mt-4">Create a meeting</h1>
        <p className="text-sm text-text-secondary mt-1">Start an instant Duet meeting.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-text-primary">Your name</label>
            <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Host" />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button className="w-full" onClick={create} disabled={loading}>
            {loading ? "Creating..." : "Create meeting"}
          </Button>
          <a href="/join" className="block text-center text-sm text-primary hover:underline">Join existing meeting</a>
        </div>
      </Card>
    </main>
  );
}
