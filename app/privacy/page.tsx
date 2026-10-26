import LegalLayout from "@/components/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="October 26, 2026">
      <p>Duet is a real-time meeting and screen-sharing platform. This policy describes data practices based on the current implementation.</p>
      <section><h2 className="text-lg font-semibold text-text-primary">Information collected</h2><p>Display names, meeting codes, participant metadata, and basic technical logs. No account registration is required for the MVP.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">Meeting media and chat</h2><p>Audio, video, screen-share streams, and chat messages are transmitted in real time via the LiveKit SFU. They are not recorded or stored by default.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">Third-party infrastructure</h2><p>Real-time media is routed through LiveKit. Hosting and networking providers may process connection data.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">Retention and deletion</h2><p>Room metadata is kept in server memory for the active session and removed when the meeting ends or the server restarts. No persistent user profiles are stored in the MVP.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">Security</h2><p>Transport encryption is used for signaling and media. Access controls are enforced for private meetings and host actions.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">Your rights</h2><p>Use the Contact page for privacy requests. Account-deletion workflows apply only if accounts are implemented.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">Contact</h2><p>See the Contact page for support and privacy inquiries.</p></section>
    </LegalLayout>
  );
}
