import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button, Card } from "@/components/ui";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-app-bg flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 text-center">
        <Logo />
        <h1 className="text-2xl font-bold text-text-primary mt-4">Page not found</h1>
        <p className="text-sm text-text-secondary mt-2">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link href="/"><Button>Return home</Button></Link>
        </div>
      </Card>
    </main>
  );
}
