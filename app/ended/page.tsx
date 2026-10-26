import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button, Card } from "@/components/ui";

export default function EndedPage() {
  return (
    <main className="min-h-screen bg-app-bg flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 text-center">
        <Logo />
        <h1 className="text-2xl font-bold text-text-primary mt-4">Meeting ended</h1>
        <p className="text-sm text-text-secondary mt-2">The host has ended this meeting for everyone.</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/create"><Button className="w-full">Create new meeting</Button></Link>
          <Link href="/"><Button variant="secondary" className="w-full">Return home</Button></Link>
        </div>
      </Card>
    </main>
  );
}
