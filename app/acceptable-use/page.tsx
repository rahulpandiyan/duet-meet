import LegalLayout from "@/components/LegalLayout";

export default function AcceptableUsePage() {
  return (
    <LegalLayout title="Acceptable Use Policy" updated="October 26, 2026">
      <p>Users must not misuse Duet's meeting, chat, or screen-sharing features.</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>No harassment, hate speech, or abuse.</li>
        <li>No unlawful, infringing, or malicious content.</li>
        <li>No unauthorized access or exploitation of the service.</li>
        <li>No disrupting meetings or other participants.</li>
        <li>No sharing content that violates privacy or confidentiality without consent.</li>
      </ul>
    </LegalLayout>
  );
}
