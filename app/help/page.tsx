import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import Link from "next/link";
import { Monitor, Smartphone, Shield, LayoutGrid, Zap, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center & Documentation",
  description:
    "Guides, troubleshooting, FAQs, and setup tips for hosting and joining simultaneous multi-screen meetings with Duet.",
  alternates: {
    canonical: "/help",
  },
};

export default function HelpPage() {
  return (
    <LegalLayout title="Duet Help Center & User Guide" updated="October 30, 2026" badge="Documentation">
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700">
        <strong className="text-slate-900">Quick Help:</strong> Welcome to Duet. Unlike traditional video conferencing tools that restrict screen sharing to one presenter at a time, Duet enables multiple presenters to share simultaneously.
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Monitor className="text-blue-600" size={20} />
          1. Simultaneous Multi-Screen Sharing
        </h2>
        <p>
          Simultaneous screen sharing is the core feature of Duet. Multiple participants can broadcast their displays at the same time without interrupting or overriding one another.
        </p>
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">How to Share</h3>
            <p className="text-slate-600 leading-relaxed">
              Click the <strong>Share Screen</strong> button in the bottom dock. Your browser will prompt you to select an entire screen, an application window (e.g. VS Code, Terminal), or a browser tab. Once shared, your screen appears alongside other active presenters.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Sharing System Audio</h3>
            <p className="text-slate-600 leading-relaxed">
              When prompted by your browser, check the <em>&ldquo;Share audio&rdquo;</em> checkbox in the screen selection dialog to stream sound from video clips, software demos, or audio editors.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Smartphone className="text-blue-600" size={20} />
          2. Mobile Screen Sharing (Android App)
        </h2>
        <p>
          Mobile web browsers (such as Chrome on Android or Safari on iOS) restrict the WebRTC <code className="text-blue-600 bg-slate-100 px-1 py-0.5 rounded text-xs">getDisplayMedia</code> API due to operating system sandboxing. To share your mobile screen:
        </p>
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 text-xs">
          <p className="text-slate-700 font-medium">
            Download the official <strong>Duet Android App (APK)</strong> directly to your mobile device:
          </p>
          <a
            href="/app-arm64-v8a-release.apk"
            download="duet-arm64.apk"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <Download size={14} /> Download Duet APK for Android
          </a>
          <p className="text-slate-500 leading-relaxed pt-1">
            Once installed, you can launch meetings directly or open meeting invite links (via ChottuLink dynamic deep links). Tap the screen share icon, grant Android&apos;s MediaProjection permission, and your mobile screen will stream live to all meeting attendees in 1080p 60 FPS.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <LayoutGrid className="text-blue-600" size={20} />
          3. Layouts: Grid, Focus &amp; Wall
        </h2>
        <p>
          Duet automatically adapts the display layout depending on the number of active screens and user preferences:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
          <li><strong>Grid View:</strong> Equidistant side-by-side tiles. Ideal for 2 presenters comparing code vs design.</li>
          <li><strong>Focus View:</strong> Click any active screen to expand it to the main viewport. Other presenters remain visible in a secondary ribbon.</li>
          <li><strong>Wall View:</strong> Optimized for multi-monitor displays and large conference room displays.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Shield className="text-blue-600" size={20} />
          4. Host Administrative Controls
        </h2>
        <p>
          The meeting creator possesses administrative tools to moderate the call:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
          <li><strong>Lock Room:</strong> Freezes the room to prevent any new participants from entering.</li>
          <li><strong>Host-Only Sharing:</strong> Disables screen sharing for guest attendees, allowing only the host to present.</li>
          <li><strong>Participant Ejection:</strong> Remove disruptive users instantly from the participant roster.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Zap className="text-blue-600" size={20} />
          5. Network &amp; Hardware Troubleshooting
        </h2>
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Corporate Firewalls &amp; VPNs</h3>
            <p className="text-slate-600 leading-relaxed">
              Duet uses standard WebRTC UDP ports (typically 50000–60000) and TCP/TLS fallback on port 443 via TURN servers. If you experience connection timeouts, ensure your corporate network allows outbound UDP traffic or disconnect from high-latency proxy VPNs.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Browser Permissions Denied</h3>
            <p className="text-slate-600 leading-relaxed">
              If your microphone or camera fails to activate, check your browser address bar. Click the lock or settings icon next to the URL, verify that Camera and Microphone permissions are set to &ldquo;Allow&rdquo;, and refresh the tab.
            </p>
          </div>
        </div>
      </section>
    </LegalLayout>
  );
}
