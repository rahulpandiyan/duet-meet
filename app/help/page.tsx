import LegalLayout from "@/components/LegalLayout";

export default function HelpPage() {
  return (
    <LegalLayout title="Help Center" updated="October 26, 2026">
      <section><h2 className="text-lg font-semibold text-text-primary">Create a meeting</h2><p>Click "Start a meeting", then share the link or code.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">Join a meeting</h2><p>Enter a meeting code on the Join page, set your name, and join from the lobby.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">Share your screen</h2><p>Click the screen-share button. Grant browser permission when prompted. Multiple participants can share at once.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">Layouts</h2><p>Switch between Grid, Focus, and Wall views in the meeting workspace.</p></section>
      <section><h2 className="text-lg font-semibold text-text-primary">Troubleshooting</h2><p>If screen sharing fails, check browser permissions and try again. Network issues may require a TURN server.</p></section>
    </LegalLayout>
  );
}
