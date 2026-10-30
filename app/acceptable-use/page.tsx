import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description:
    "Guidelines and rules governing conduct, multi-screen sharing, and media transmission across the Duet platform.",
  alternates: {
    canonical: "/acceptable-use",
  },
};

export default function AcceptableUsePage() {
  return (
    <LegalLayout title="Acceptable Use Policy (AUP)" updated="October 30, 2026">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700">
        <strong className="text-slate-900">AUP Core Mandate:</strong> Duet is engineered for high-performance software engineering, product design, and professional team collaboration. Misuse, harassment, unauthorized broadcasting, or attacks against meeting integrity will result in immediate termination of access and potential law enforcement referral.
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">1. Purpose &amp; Scope</h2>
        <p>
          This Acceptable Use Policy (&ldquo;AUP&rdquo;) defines the acceptable and unacceptable conduct of all users accessing the Duet web platform, mobile applications, and WebRTC streaming infrastructure. Compliance with this policy is a condition of use under our <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Zero-Tolerance Violations (Immediate Blacklisting)</h2>
        <p>
          Duet enforces an uncompromising zero-tolerance standard against severe harms. Any detection or verified report will trigger immediate room termination, IP blocklisting, and notification to appropriate civil and criminal authorities:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>Child Exploitation (CSAM/CSAE):</strong> Transmitting, displaying, or facilitating child sexual abuse material or exploitation. All incidents are reported directly to the National Center for Missing &amp; Exploited Children (NCMEC) and relevant police agencies.
          </li>
          <li>
            <strong>Violent Extremism &amp; Terrorism:</strong> Promoting or organizing violent extremist groups, terrorism, mass violence, or weapons manufacturing.
          </li>
          <li>
            <strong>Suicide &amp; Self-Harm:</strong> Displaying or encouraging self-harm, suicide, or severe bodily violence.
          </li>
          <li>
            <strong>Non-Consensual Intimate Imagery:</strong> Transmitting or presenting sexually explicit or intimate imagery without affirmative consent.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">3. Screen Sharing &amp; Presentation Standards</h2>
        <p>
          Because Duet supports concurrent, high-resolution (up to 4K / 60 FPS) screen streaming, presenters are held to strict standards:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>Copyright &amp; Commercial Broadcasting:</strong> You may not use Duet to broadcast commercial movies, television broadcasts, live athletic events, or pay-per-view media without written authorization from rights holders.
          </li>
          <li>
            <strong>Photosensitive Epilepsy Protections:</strong> You must not broadcast rapidly flashing, high-contrast strobe visual patterns designed or likely to induce epileptic seizures or harm attendees.
          </li>
          <li>
            <strong>Unauthorized PII &amp; Doxxing:</strong> You may not share screens displaying private personal information (home addresses, credit card numbers, government IDs, unredacted health records) without explicit authorization from the subject.
          </li>
          <li>
            <strong>Malicious Software Demos:</strong> You may not broadcast live exploit payloads, malware command-and-control interfaces, or actively compromised systems for malicious purposes.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">4. Meeting Harassment &amp; Disruption (&ldquo;Meeting Bombing&rdquo;)</h2>
        <p>
          Participating in bad-faith disruption of meetings is strictly prohibited:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>Unauthorized Entry (&ldquo;Meeting Bombing&rdquo;):</strong> Entering meetings where you were not invited by the host or authorized attendees.
          </li>
          <li>
            <strong>Bypassing Host Controls:</strong> Circumventing room locks, spoofing host tokens, or attempting to unmute or re-enter after being ejected.
          </li>
          <li>
            <strong>Chat &amp; Audio Flooding:</strong> Using bots or automated tools to flood in-meeting chat channels or blast disruptive audio.
          </li>
          <li>
            <strong>Harassment &amp; Hate Speech:</strong> Directing derogatory, racist, sexist, homophobic, or threatening remarks at call participants.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">5. Infrastructure &amp; Technical Integrity</h2>
        <p>
          You agree not to compromise the stability or security of our services:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            Do not conduct denial-of-service (DoS/DDoS) attacks against our signaling servers, TURN relays, or LiveKit SFU clusters.
          </li>
          <li>
            Do not run automated crawlers, brute-force algorithms, or dictionary scripts against meeting code generation endpoints.
          </li>
          <li>
            Do not reverse engineer, decompile, or extract proprietary audio/video codecs or signaling protocols.
          </li>
          <li>
            Do not conduct uncoordinated vulnerability scanning or penetration testing against production systems without prior written authorization.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">6. Host Moderation Tools &amp; Incident Reporting</h2>
        <p>
          Duet equips hosts with real-time controls to maintain order:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong>Lock Room:</strong> Instantly prevents any new participants from joining.</li>
          <li><strong>Host-Only Sharing:</strong> Restricts screen sharing capabilities to the meeting creator.</li>
          <li><strong>Participant Ejection:</strong> Eject disruptive individuals from the session with one click.</li>
        </ul>
        <p className="mt-3">
          To report malicious behavior, abuse of our platform, or illegal content, email us immediately or file a report through our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>. Include the meeting code, timestamp, and relevant evidence.
        </p>
      </section>
    </LegalLayout>
  );
}
