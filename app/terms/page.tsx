import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service for Duet, including usage guidelines, accountless guest access, and user responsibilities.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="October 30, 2026">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700">
        <strong className="text-slate-900">Summary for fast reading:</strong> Duet is a real-time collaboration tool designed for simultaneous multi-screen sharing. We do not require accounts, we do not record your meetings on our servers, and we never sell your data. You are solely responsible for the content you present or stream, and you must comply with two-party consent laws if you use local recording software.
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">1. Acceptance of Terms &amp; Scope</h2>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;Host&rdquo;, or &ldquo;Participant&rdquo;) and Duet (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) concerning your access to and use of the Duet web application, mobile applications, APIs, and associated services (collectively, the &ldquo;Service&rdquo;).
        </p>
        <p>
          By accessing the website, initiating a meeting room, joining via a meeting code or link, or downloading the Duet Android APK, you acknowledge that you have read, understood, and agreed to be bound by these Terms. If you do not agree, you must immediately terminate use of the Service.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Eligibility &amp; Accountless Guest Access</h2>
        <p>
          You must be at least 13 years old (or 16 years old in the European Economic Area / UK) to access the Service. If you are using Duet on behalf of a corporation, partnership, or other legal entity, you represent and warrant that you possess full corporate authority to bind that entity to these Terms.
        </p>
        <p>
          Duet operates on a privacy-preserving, accountless guest architecture. You are not required to create a permanent username or password. When entering a room, you supply an ephemeral display name. You understand that display names are not verified identities, and you are responsible for validating the identity of external attendees before sharing sensitive proprietary materials.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">3. Meeting Creation, Access Control &amp; Host Rights</h2>
        <p>
          Any user can generate an instant meeting room (&ldquo;Host&rdquo;). Duet rooms utilize cryptographically random, high-entropy meeting identifiers.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>Link Distribution:</strong> Meeting links and codes are private by default. The Host is solely responsible for determining who receives invitation URLs or dynamic deep links.
          </li>
          <li>
            <strong>Host Moderation Controls:</strong> Hosts possess administrative powers including locking the room to prevent new entrants, restricting screen-sharing privileges to host-only, muting audio streams, and terminating or ejecting participants from the session.
          </li>
          <li>
            <strong>Ephemeral Room Lifecycle:</strong> Meeting rooms exist only while active participants remain connected. Once empty, rooms are automatically purged from memory.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">4. Simultaneous Multi-Screen Sharing &amp; Presenter Obligations</h2>
        <p>
          Duet is architected to permit two or more participants to stream their computer monitors, specific application windows, or mobile screens simultaneously via independent WebRTC tracks.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>Screen Content Responsibility:</strong> You retain sole ownership of and full legal liability for any code, designs, documents, personal data, or audio transmitted across your screen shares.
          </li>
          <li>
            <strong>System Audio &amp; Tab Audio:</strong> When capturing system audio alongside your screen share, you warrant that you have obtained appropriate broadcast and public performance rights for any media played.
          </li>
          <li>
            <strong>Confidentiality Safeguards:</strong> Because multiple screens can be viewed concurrently by all room attendees, presenters must take precautions to minimize accidental disclosure of passwords, API keys, personal identification numbers, or confidential customer records.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">5. Wiretapping, Call Recording &amp; Consent Regulations</h2>
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <strong>Notice Regarding Recording:</strong> Duet servers do NOT record, log, or persist audio, video, or screen sharing tracks.
        </div>
        <p>
          If any participant utilizes local screen-recording software (e.g., OBS, QuickTime, Windows Game Bar, or third-party capture cards) or AI transcription software during a Duet call, that participant is strictly and solely responsible for:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            Providing conspicuous verbal or written notice to all call attendees prior to beginning any recording or automated transcription.
          </li>
          <li>
            Complying with all applicable multi-party consent, wiretap, and electronic eavesdropping laws in their jurisdiction and the jurisdictions of all call participants (including, without limitation, California Penal Code § 632, the federal Electronic Communications Privacy Act, and GDPR Article 6).
          </li>
          <li>
            Indemnifying Duet against any legal claims, fines, or damages arising from unauthorized recordings made by participants on their local devices.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">6. Prohibited Activities &amp; Acceptable Use</h2>
        <p>
          You agree not to engage in any of the following prohibited behaviors:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>Transmitting or displaying Child Sexual Abuse Material (CSAM/CSAE) — any detection will trigger immediate termination and mandatory reports to NCMEC and international law enforcement.</li>
          <li>Broadcasting hate speech, violent threats, defamatory material, or non-consensual sexually explicit content.</li>
          <li>Disseminating software viruses, malware, trojans, ransomware, or malicious keyloggers.</li>
          <li>Interfering with, overloading, or launching distributed denial-of-service (DDoS) attacks against our Selective Forwarding Unit (SFU) or signaling infrastructure.</li>
          <li>Attempting to bypass meeting room locks, reverse engineer proprietary signaling tokens, or spoof host credentials.</li>
          <li>Using Duet for automated spamming, bot dialing, or mass unsolicited video broadcasts.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">7. Intellectual Property &amp; User Content</h2>
        <p>
          <strong>Your Content:</strong> You retain all copyright, patent, trademark, and intellectual property rights in and to the content you stream, display, or chat within Duet. We claim zero ownership over your shared screens, code repositories, or media streams. You grant Duet only the narrow, non-exclusive, royalty-free license to transmit your media tracks transiently through our infrastructure for the sole purpose of real-time peer routing.
        </p>
        <p>
          <strong>Duet IP:</strong> The Duet website, mobile applications, interface designs, trade secrets, logos, and algorithms are the exclusive property of Duet and its licensors. You may not decompile, disassemble, or reverse-engineer the Service except where permitted by applicable statutory law.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">8. Telecommunications, Bandwidth &amp; Network Quality</h2>
        <p>
          Duet relies upon public internet connectivity, WebRTC protocol handshakes, and STUN/TURN traversal servers. We do not guarantee uninterrupted, jitter-free, or artifact-free transmission. Real-time video quality depends upon participant network bandwidth, ISP peering, device CPU utilization, and hardware acceleration capabilities.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">9. Warranty Disclaimer (&ldquo;AS IS&rdquo;)</h2>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, ERROR-FREE, OR VIRUS-FREE.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">10. Limitation of Liability</h2>
        <p className="text-xs uppercase tracking-wide text-slate-500">
          IN NO EVENT SHALL DUET, ITS DIRECTORS, EMPLOYEES, CONTRACTORS, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES (INCLUDING LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR WORK STOPPAGE) ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE SERVICE, REGARDLESS OF THE LEGAL THEORY (TORT, CONTRACT, OR OTHERWISE), EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>
        <p className="text-xs text-slate-500">
          IN JURISDICTIONS THAT DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES, OUR AGGREGATE LIABILITY SHALL BE LIMITED TO THE GREATEST EXTENT PERMITTED BY LAW OR ONE HUNDRED UNITED STATES DOLLARS ($100.00 USD), WHICHEVER IS LESS.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">11. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless Duet, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising out of or relating to your violation of these Terms, your presentation of infringing content, or your violation of any third-party privacy, publicity, or intellectual property rights.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">12. Governing Law &amp; Dispute Resolution</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles. Any legal suit, action, or proceeding arising out of or related to these Terms or the Service shall be instituted exclusively in federal or state courts located in Delaware.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">13. Revisions to Terms &amp; Inquiries</h2>
        <p>
          We reserve the right to amend or update these Terms periodically. Any updates will be reflected with a revised &ldquo;Effective Date&rdquo; at the top of this document. Continued use of the Service following notice of such updates signifies your binding acceptance. For questions regarding these Terms, visit our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
        </p>
      </section>
    </LegalLayout>
  );
}
