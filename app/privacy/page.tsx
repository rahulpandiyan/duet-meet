import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Duet Privacy Policy: Learn how our zero-storage, peer-to-peer WebRTC architecture preserves your privacy without tracking or recording.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="October 30, 2026">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700">
        <strong className="text-slate-900">Our Privacy Commitment:</strong> Duet operates on a strict zero-storage, memory-only media architecture. We do not require account registration, we do not record or archive your audio, video, or screen sharing streams, and we do not sell or monetize personal data.
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">1. Overview &amp; Privacy by Design</h2>
        <p>
          Duet (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) builds real-time communication tools engineered around the principle of data minimization. This Privacy Policy details how we handle technical and operational data when you visit our website, connect via browser WebRTC, join or host meetings, or utilize our mobile applications.
        </p>
        <p>
          Because Duet does not operate persistent user accounts, we do not maintain longitudinal profiles, track your browsing across external websites, or compile marketing dossiers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Information We Handle</h2>
        <div className="space-y-4 text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h3 className="font-semibold text-slate-900 text-base">A. Real-Time Media &amp; Screen Streams (Zero Storage)</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              When you enable microphone, camera, or screen sharing, your audio and visual data are packetized and streamed using WebRTC DTLS-SRTP encryption to an in-memory Selective Forwarding Unit (SFU). These media packets are routed directly to authorized room participants and are <strong>never recorded, stored on persistent disk, transcribed, or inspected</strong> by Duet.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h3 className="font-semibold text-slate-900 text-base">B. Ephemeral Room Metadata</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              To facilitate room coordination, our signaling servers maintain ephemeral session state:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-600">
              <li>Meeting code (randomly generated token)</li>
              <li>Participant display name (user-supplied; guest identifier)</li>
              <li>Connection timestamps and active stream track count</li>
              <li>Host token and administrative permissions</li>
            </ul>
            <p className="mt-2 text-xs text-emerald-600 font-medium">
              ✓ This metadata is maintained purely in memory and is automatically destroyed when the meeting concludes and all participants depart.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h3 className="font-semibold text-slate-900 text-base">C. In-Call Chat Messages</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              Chat messages sent during a meeting are distributed in real-time to active participants via WebRTC data channels. Chat messages are not saved to a persistent database; once you leave or refresh the page, your chat history is permanently wiped.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h3 className="font-semibold text-slate-900 text-base">D. Network Telemetry &amp; Diagnostics</h3>
            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
              During active WebRTC connections, client browsers negotiate peer candidates via STUN/TURN servers. We receive client IP addresses to establish peer routing, adjust dynamic bitrates, and detect network congestion. Telemetry (framerate, packet loss, jitter) is computed locally on your device and discarded when the call ends.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">3. Legal Bases for Processing (GDPR &amp; UK Data Protection)</h2>
        <p>
          For individuals located in the European Economic Area (EEA), the United Kingdom, or Switzerland, our processing of technical connection data is governed by the following legal bases under Article 6 of the General Data Protection Regulation (GDPR):
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>Performance of Contract (Art. 6(1)(b)):</strong> Processing ephemeral media and signaling packets is necessary to establish peer connections and deliver the real-time meeting service requested by you.
          </li>
          <li>
            <strong>Legitimate Interests (Art. 6(1)(f)):</strong> Processing transient IP addresses and security tokens to protect our platform against DDoS attacks, enforce host room locks, and prevent abuse.
          </li>
          <li>
            <strong>Compliance with Legal Obligations (Art. 6(1)(c)):</strong> Retaining standard web-server access logs where required by mandatory telecommunications or statutory laws.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">4. Third-Party Service Providers &amp; Infrastructure</h2>
        <p>
          We partner with select tier-1 cloud and media routing infrastructure providers under strict Data Processing Agreements (DPAs):
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>LiveKit SFU Cloud / Self-Hosted:</strong> Powers real-time selective packet forwarding for simultaneous audio, video, and screen tracks under DTLS-SRTP encryption.
          </li>
          <li>
            <strong>Edge Network &amp; Hosting (Vercel / Cloudflare):</strong> Provides global edge caching, DNS routing, and DDoS mitigation.
          </li>
          <li>
            <strong>ChottuLink:</strong> Provides dynamic deep-linking redirection for mobile Android app handoffs.
          </li>
        </ul>
        <p className="text-xs text-slate-500">
          We never sell, rent, or trade your personal information to third-party data brokers or advertising networks.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">5. Data Retention &amp; Auto-Purge Policy</h2>
        <p>
          We adhere to an automated zero-retention schedule:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-900">
              <tr>
                <th className="p-3 border-b border-slate-200">Data Category</th>
                <th className="p-3 border-b border-slate-200">Storage Medium</th>
                <th className="p-3 border-b border-slate-200">Retention Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              <tr>
                <td className="p-3 font-semibold text-slate-900">Screen Streams &amp; Audio/Video</td>
                <td className="p-3">In-Memory RAM only</td>
                <td className="p-3 text-emerald-600 font-semibold">0 seconds (Wiped upon transmission)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Meeting Chat Messages</td>
                <td className="p-3">Client Browser &amp; WebRTC RAM</td>
                <td className="p-3 text-emerald-600 font-semibold">Expunged when room closes</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Meeting Code &amp; Display Names</td>
                <td className="p-3">Signaling Server RAM</td>
                <td className="p-3 text-emerald-600 font-semibold">Auto-purged upon last departure</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Session Storage Tokens</td>
                <td className="p-3">Browser sessionStorage</td>
                <td className="p-3 text-emerald-600 font-semibold">Cleared on tab close</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">6. Your Data Rights (GDPR &amp; CCPA / CPRA)</h2>
        <p>
          Depending on your residence, you possess specific statutory rights regarding personal data:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong>Right of Access &amp; Portability:</strong> The right to request copies of any personal data we hold.</li>
          <li><strong>Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong> The right to demand deletion of stored information. Because Duet operates accountless sessions, our systems automatically delete ephemeral session records.</li>
          <li><strong>Right to Restrict or Object:</strong> The right to restrict certain forms of data processing.</li>
          <li><strong>California Privacy (CCPA/CPRA):</strong> We do not sell personal information or share it for cross-context behavioral advertising (&ldquo;Do Not Sell or Share My Personal Information&rdquo;). We do not discriminate against users who exercise their rights.</li>
        </ul>
        <p>
          To submit a formal privacy request, consult our <Link href="/account-deletion" className="text-blue-600 hover:underline">Account &amp; Data Erasure Portal</Link> or <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">7. Children&apos;s Privacy (COPPA &amp; GDPR-K)</h2>
        <p>
          The Service is not directed to individuals under the age of 13 (or under 16 in the EEA). We do not knowingly solicit or collect personal information from children. If we discover that a child has accessed the Service in violation of this policy, we will take immediate steps to terminate the session and expunge any corresponding metadata.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">8. International Data Transfers</h2>
        <p>
          If you access Duet from outside the United States, your media packets and signaling requests may be routed through globally distributed SFU servers in your region or the United States. We implement Standard Contractual Clauses (SCCs) to ensure equivalent protection across international boundaries.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">9. Security Safeguards</h2>
        <p>
          We employ military-grade WebRTC security standards: DTLS encryption for cryptographic handshake verification and SRTP with AES-128 / AES-256 cipher suites for real-time video, audio, and screen sharing streams.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">10. Policy Updates &amp; Contact</h2>
        <p>
          We may revise this Privacy Policy periodically. Continued use of Duet represents agreement to any updated terms. For privacy inquiries or legal correspondence, reach out via our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
        </p>
      </section>
    </LegalLayout>
  );
}
