import LegalLayout from "@/components/LegalLayout";
import Link from "next/link";

export default function SecurityPage() {
  return (
    <LegalLayout title="Security & Cryptographic Architecture" updated="October 30, 2026" badge="Security Whitepaper">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700">
        <strong className="text-slate-900">Security Philosophy:</strong> Duet is engineered from the ground up on zero-trust principles. We utilize military-grade WebRTC encryption, ephemeral token authentication, in-memory selective packet forwarding, and hardware-accelerated sandboxed screen capture APIs.
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">1. Architectural Overview</h2>
        <p>
          Duet delivers real-time simultaneous multi-screen sharing without compromising participant privacy or enterprise security. Our infrastructure enforces complete isolation between meetings, requires cryptographically signed tokens for room entry, and operates on an in-memory routing model that eliminates disk storage for real-time media.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Media Encryption &amp; Transport Standards</h2>
        <p>
          All audio, video, and screen sharing streams transmitted across Duet are encrypted in transit using industry-standard WebRTC security protocols:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
            <div className="font-semibold text-slate-900 text-sm flex items-center justify-between">
              <span>DTLS Handshake</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">TLS 1.3 / 1.2</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Datagram Transport Layer Security (DTLS) negotiates symmetric encryption keys between peers and the SFU using Ephemeral Elliptic Curve Diffie-Hellman (ECDHE), guaranteeing <strong>Perfect Forward Secrecy (PFS)</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2">
            <div className="font-semibold text-slate-900 text-sm flex items-center justify-between">
              <span>SRTP Media Cipher</span>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">AES-128 / 256-GCM</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              All simultaneous video, audio, and high-framerate screen sharing frames are encapsulated inside Secure Real-time Transport Protocol (SRTP) packets encrypted via AES-GCM or AES-CTR with message authentication.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">3. Ephemeral Authentication &amp; Token Security</h2>
        <p>
          To prevent unauthorized access and meeting hijacking, room entry relies on server-minted JSON Web Tokens (JWT):
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>HMAC-SHA256 Signing:</strong> Tokens are signed using high-entropy server secrets that are never exposed to client browsers.
          </li>
          <li>
            <strong>Strict Time-To-Live (TTL):</strong> Join tokens carry short expiration windows, minimizing token replay risks.
          </li>
          <li>
            <strong>Scoped Permissions:</strong> Host permissions (room locking, muting, ejecting) are cryptographically enforced within the token payload and verified by the SFU before any administrative action executes.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">4. Screen Capture Sandboxing &amp; User Consent</h2>
        <p>
          Capturing computer displays or mobile screens is subject to rigorous operating system and browser sandboxes:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>Browser Sandboxing (Web):</strong> WebRTC <code className="text-blue-600 bg-slate-100 px-1 py-0.5 rounded text-xs">getDisplayMedia</code> requires explicit, user-initiated interaction. Browsers present a native modal allowing users to select an entire screen, application window, or browser tab. Duet cannot initiate screen capture without affirmative user consent.
          </li>
          <li>
            <strong>Mobile Sandboxing (Android):</strong> The Duet Android application utilizes Android&apos;s native <code className="text-blue-600 bg-slate-100 px-1 py-0.5 rounded text-xs">MediaProjection</code> API. A prominent system prompt is shown to the user, and an ongoing, persistent notification is maintained in the Android status bar throughout the entire capture session.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">5. In-Memory Selective Forwarding Unit (SFU) Isolation</h2>
        <p>
          Duet routes real-time streams through LiveKit SFU instances operating in RAM. Unlike legacy media servers that record streams to disk or transcode video through heavy intermediate storage, our SFU functions as an intelligent packet forwarder:
        </p>
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2 text-xs text-slate-600">
          <p>
            &bull; Packets are inspected only for routing headers (SSRC, payload type, sequence numbers) to determine recipient subscriptions.
          </p>
          <p>
            &bull; When a meeting ends and participants disconnect, all associated room queues, peer descriptors, and memory buffers are freed and overwritten immediately.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">6. Infrastructure Hardening &amp; DDoS Resilience</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong>Edge Web-Application Firewall (WAF):</strong> Rate limiting and bot mitigation protect signaling endpoints against brute-force attacks and token harvesting.</li>
          <li><strong>High-Entropy Meeting Identifiers:</strong> Meeting codes are generated using cryptographically secure pseudorandom number generators (CSPRNG), preventing collision or guessing.</li>
          <li><strong>Locking Mechanism:</strong> Hosts can lock a room at any time, instantly rejecting all subsequent connection handshakes.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">7. Vulnerability Disclosure &amp; Bug Bounty</h2>
        <p>
          We welcome coordinated security vulnerability disclosures from independent researchers. If you identify a potential security vulnerability in Duet, please contact our security team through our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>. We commit to acknowledging receipt within 48 hours and will not pursue legal action against researchers acting in good faith under coordinated disclosure practices.
        </p>
      </section>
    </LegalLayout>
  );
}
