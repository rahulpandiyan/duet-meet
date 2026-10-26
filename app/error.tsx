"use client";
import { Button, Card } from "@/components/ui";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen bg-app-bg flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Something went wrong</h1>
        <p className="text-sm text-text-secondary mt-2">An unexpected error occurred.</p>
        <div className="mt-6">
          <Button onClick={reset}>Try again</Button>
        </div>
      </Card>
    </main>
  );
}
