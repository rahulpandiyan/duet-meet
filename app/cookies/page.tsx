import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Duet Cookie Policy: Understand our minimal, strictly necessary local storage usage with zero third-party advertising cookies.",
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Cookie & Storage Policy" updated="October 30, 2026">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700">
        <strong className="text-slate-900">Zero-Tracking Guarantee:</strong> Duet does not use third-party tracking cookies, advertising pixels, or cross-site fingerprinting technologies. We utilize only strictly necessary HTML5 client storage required for room signaling and active call connection.
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">1. Understanding Web Storage &amp; Cookies</h2>
        <p>
          Cookies are small text files placed on your computer or mobile device by websites that you visit. Modern web applications also utilize HTML5 Web Storage (<code className="text-blue-600 bg-slate-100 px-1.5 py-0.5 rounded text-xs">sessionStorage</code> and <code className="text-blue-600 bg-slate-100 px-1.5 py-0.5 rounded text-xs">localStorage</code>), which provides secure, origin-isolated storage directly within your browser.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. No Third-Party or Advertising Cookies</h2>
        <p>
          Duet does not host advertisements, does not partner with data brokers, and does not install tracking beacons (such as Google Analytics, Meta Pixel, or marketing cookies). Your activity on Duet is never monitored across third-party websites.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">3. Strictly Necessary Storage Inventory</h2>
        <p>
          We employ strictly necessary storage keys strictly to establish and preserve your WebRTC conference call. These items are essential for the operation of the Service:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-900">
              <tr>
                <th className="p-3 border-b border-slate-200">Storage Key</th>
                <th className="p-3 border-b border-slate-200">Type</th>
                <th className="p-3 border-b border-slate-200">Purpose</th>
                <th className="p-3 border-b border-slate-200">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              <tr>
                <td className="p-3 font-mono text-blue-600 font-medium">duet:token:[code]</td>
                <td className="p-3">sessionStorage</td>
                <td className="p-3">Cryptographically signed LiveKit JWT authentication token for room connection.</td>
                <td className="p-3 text-emerald-600 font-semibold">Purged on tab close</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-blue-600 font-medium">duet:url:[code]</td>
                <td className="p-3">sessionStorage</td>
                <td className="p-3">LiveKit SFU signaling endpoint URI.</td>
                <td className="p-3 text-emerald-600 font-semibold">Purged on tab close</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-blue-600 font-medium">duet:name:[code]</td>
                <td className="p-3">sessionStorage</td>
                <td className="p-3">Your chosen display name for participant labeling.</td>
                <td className="p-3 text-emerald-600 font-semibold">Purged on tab close</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-blue-600 font-medium">duet:isHost:[code]</td>
                <td className="p-3">sessionStorage</td>
                <td className="p-3">Verification flag granting meeting host administrative controls.</td>
                <td className="p-3 text-emerald-600 font-semibold">Purged on tab close</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-blue-600 font-medium">duet:audioDevice / duet:videoDevice</td>
                <td className="p-3">localStorage</td>
                <td className="p-3">Stores your last selected microphone, speaker, or webcam device ID so you do not need to reselect on every call.</td>
                <td className="p-3">Persistent until cleared</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">4. Exemption Under EU ePrivacy &amp; GDPR</h2>
        <p>
          Under Article 5(3) of the EU ePrivacy Directive (Directive 2002/58/EC as amended) and guidance from the European Data Protection Board (EDPB), cookies and local storage mechanisms that are &ldquo;strictly necessary in order to provide an information society service explicitly requested by the subscriber or user&rdquo; are exempt from requiring affirmative cookie consent banners.
        </p>
        <p>
          Because Duet utilizes exclusively strictly necessary storage keys to establish and facilitate your active WebRTC call, annoying third-party cookie consent popups are not required.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">5. How to Manage or Clear Browser Storage</h2>
        <p>
          You have full control over your browser storage at any time:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>Session Storage:</strong> Simply close your browser tab or window. All <code className="text-blue-600 bg-slate-100 px-1 py-0.5 rounded text-xs">sessionStorage</code> keys are automatically cleared by your browser immediately.
          </li>
          <li>
            <strong>Clearing Local Storage:</strong> You can clear stored hardware preferences via your browser settings under <em>Privacy &amp; Security &rarr; Clear Browsing Data &rarr; Cookies and Site Data</em>, or via Developer Tools (F12) &rarr; <em>Application &rarr; Storage &rarr; Clear site data</em>.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">6. Questions</h2>
        <p>
          For additional information on our privacy and storage architecture, refer to our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> or reach out via our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
        </p>
      </section>
    </LegalLayout>
  );
}
