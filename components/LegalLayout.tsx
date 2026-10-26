import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui";

export default function LegalLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-app-bg">
      <header className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/"><Logo /></Link>
        <Link href="/" className="text-sm text-primary hover:underline">Home</Link>
      </header>
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
          <p className="text-xs text-text-secondary mt-2">Last updated: {updated}</p>
          <div className="mt-6 prose prose-sm max-w-none text-text-secondary space-y-4">{children}</div>
        </Card>
        <div className="mt-6 text-center text-sm text-text-secondary">
          <Link href="/" className="hover:text-primary">Return home</Link>
        </div>
      </div>
    </main>
  );
}
