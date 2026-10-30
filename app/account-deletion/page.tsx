import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Retention & Account Deletion",
  description:
    "Information regarding Duet's ephemeral zero-retention data lifecycle and local session clearing.",
  alternates: {
    canonical: "/account-deletion",
  },
};

export default function AccountDeletionPage() {
  return (
    <LegalLayout title="Account Deletion & Data Erasure" updated="October 30, 2026">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700">
        <strong className="text-slate-900">Accountless Architecture Notice:</strong> Duet does not create permanent user accounts or password-protected user databases. We operate an ephemeral guest model. As a result, there is no persistent account profile to &ldquo;delete&rdquo;&mdash;your session data is destroyed automatically when your meeting concludes.
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">1. How Data Lifecycles Work on Duet</h2>
        <p>
          Duet is designed from the ground up for maximum privacy and zero data persistence:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li>
            <strong>Audio, Video, and Screen Streams:</strong> Forwarded in real time via in-memory WebRTC packets. They are <strong>never stored on persistent disks</strong> and vanish instantly upon delivery.
          </li>
          <li>
            <strong>Meeting Rooms &amp; Display Names:</strong> When all participants depart a room, the signaling server executes an immediate garbage collection cycle, expunging the meeting identifier, tokens, and display names from server RAM.
          </li>
          <li>
            <strong>Chat Messages:</strong> In-meeting text messages are transient and exist solely in the browser memory of active participants. Wiped on tab closure.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Client-Side Data Erasure (Immediate)</h2>
        <p>
          If you wish to purge all local evidence of your Duet sessions from your browser or device:
        </p>
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Step 1: Close Active Call Tabs</h3>
            <p className="text-slate-600 leading-relaxed">
              Closing the browser tab terminates the WebRTC peer connection and automatically purges all <code className="text-blue-600 bg-slate-100 px-1 py-0.5 rounded">sessionStorage</code> keys (including room tokens and display names).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Step 2: Clear Local Hardware Preferences</h3>
            <p className="text-slate-600 leading-relaxed">
              To clear remembered camera, microphone, and speaker selections:
            </p>
            <ul className="list-disc pl-5 mt-1.5 space-y-1 text-slate-600">
              <li><strong>Chrome / Edge / Brave:</strong> Settings &rarr; Privacy and security &rarr; Clear browsing data &rarr; Select &ldquo;Cookies and other site data&rdquo; &rarr; Clear data.</li>
              <li><strong>Firefox:</strong> Settings &rarr; Privacy &amp; Security &rarr; Cookies and Site Data &rarr; Clear Data.</li>
              <li><strong>Safari:</strong> Settings &rarr; Privacy &rarr; Manage Website Data &rarr; Search &ldquo;duet&rdquo; &rarr; Remove.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Step 3: Android Mobile App Data Reset</h3>
            <p className="text-slate-600 leading-relaxed">
              If you installed the Duet Android APK: Navigate to <em>Android Settings &rarr; Apps &rarr; Duet &rarr; Storage &amp; Cache &rarr; Clear Storage</em>. This resets all application state.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">3. Formal GDPR / CCPA Data Subject Erasure Requests</h2>
        <p>
          Under Article 17 of the GDPR (&ldquo;Right to Erasure&rdquo;) and California Civil Code § 1798.105 (CCPA), you are entitled to request the deletion of any personal data maintained by an organization.
        </p>
        <p>
          Because Duet maintains zero user account records, our primary retained records consist only of transient edge web-server access logs (containing client IP addresses and HTTP request timestamps), which are automatically rotated and purged in accordance with standard infrastructure security schedules (typically within 14 to 30 days).
        </p>
        <p>
          To submit a formal request for log review or data verification:
        </p>
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2 text-xs">
          <p className="text-slate-700">
            <strong>Email:</strong> Submit your request through our <Link href="/contact" className="text-blue-600 hover:underline">Contact Portal</Link> with the subject line <em>&ldquo;GDPR/CCPA Data Erasure Request&rdquo;</em>.
          </p>
          <p className="text-slate-700">
            <strong>Required Details:</strong> Provide the approximate date, time, and meeting code of the session, as well as your public IP address at the time of connection (so our security engineers can identify and expunge relevant network access logs).
          </p>
          <p className="text-slate-500">
            <strong>Response SLA:</strong> We acknowledge requests within 5 business days and complete verification and purge within 30 days as mandated by GDPR / 45 days under CCPA.
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}
