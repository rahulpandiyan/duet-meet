import LegalLayout from "@/components/LegalLayout";

export default function SecurityPage() {
  return (
    <LegalLayout title="Security" updated="October 26, 2026">
      <p>Duet uses secure transport (HTTPS/WSS) for signaling and media. Room access is controlled by meeting codes and host tokens. Host permissions are enforced on the server.</p>
      <p>Screen and device permissions are requested explicitly by the browser. Meetings are not recorded by default.</p>
    </LegalLayout>
  );
}
