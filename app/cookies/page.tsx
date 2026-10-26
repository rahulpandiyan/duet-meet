import LegalLayout from "@/components/LegalLayout";

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie Policy" updated="October 26, 2026">
      <p>Duet uses essential session storage (such as browser sessionStorage) to keep meeting tokens and preferences during a session. No third-party tracking cookies are used in the current implementation.</p>
      <section><h2 className="text-lg font-semibold text-text-primary">Essential storage</h2><p>Session data is required for joining and participating in meetings.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">Analytics</h2><p>No analytics cookies are used unless explicitly added and documented.</p></section>
    </LegalLayout>
  );
}
