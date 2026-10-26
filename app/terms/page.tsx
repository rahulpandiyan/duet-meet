import LegalLayout from "@/components/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Use" updated="October 26, 2026">
      <section><h2 className="text-lg font-semibold text-text-primary">1. Acceptance of terms</h2><p>By accessing or using Duet, you agree to these Terms of Use. If you do not agree, do not use the service.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">2. Eligibility and accounts</h2><p>You must be able to form a binding agreement. Guest access is supported; display names are user-provided and not verified.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">3. Meeting creation and participation</h2><p>Hosts create meetings and control access. Participants join via links or codes. Private meetings rely on unguessable identifiers.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">4. Screen sharing, audio, video, and chat</h2><p>Participants may share screens independently. Hosts may restrict sharing or remove participants. Content shared is the responsibility of the presenter.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">5. Prohibited use</h2><p>No harassment, unlawful content, unauthorized access, malware, or abuse of meeting or screen-sharing functionality.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">6. Intellectual property</h2><p>Duet and its branding are owned by the operator. User-submitted content remains the user's responsibility.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">7. Service availability</h2><p>The service is provided as-is. Features may change. No uptime guarantee is made unless separately agreed.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">8. Suspension and termination</h2><p>Accounts or meetings may be suspended for misuse or policy violations.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">9. Disclaimers and liability</h2><p>To the maximum extent permitted by law, the service is provided without warranties and liability is limited.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">10. Changes to terms</h2><p>Terms may be updated; continued use constitutes acceptance.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">11. Contact</h2><p>Contact the operator through the Contact page for questions about these terms.</p></section>
    </LegalLayout>
  );
}
