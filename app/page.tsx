"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button, Card, Input, Badge } from "@/components/ui";
import HeroPreview from "@/components/HeroPreview";
import {
  Monitor,
  Mic,
  Video,
  MessageSquare,
  Users,
  LayoutGrid,
  Maximize2,
  Columns3,
  Shield,
  CheckCircle2,
  Lock,
  Wifi,
  Zap,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
  Smartphone,
  Download,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);

  async function joinNow(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!code.trim()) return;
    setJoining(true);
    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), name: "Guest" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      sessionStorage.setItem(`duet:token:${data.code}`, data.token);
      sessionStorage.setItem(`duet:url:${data.code}`, data.url);
      sessionStorage.setItem(`duet:name:${data.code}`, "Guest");
      router.push(`/lobby/${data.code}`);
    } catch {
      router.push(`/join?code=${encodeURIComponent(code.trim())}`);
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo size={28} />
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#product" className="hover:text-slate-900 transition-colors">
              Product
            </a>
            <a href="#how" className="hover:text-slate-900 transition-colors">
              How it works
            </a>
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#usecases" className="hover:text-slate-900 transition-colors">
              Use cases
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="/app-arm64-v8a-release.apk"
              download="duet-arm64.apk"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200/80"
              title="Download Duet for Android (APK)"
            >
              <Smartphone size={14} className="text-blue-600" />
              <span>Android App</span>
            </a>
            <Link href="/join">
              <Button variant="ghost" size="sm">
                Join meeting
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="primary" size="sm">
                Start a meeting
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-16 border-b border-slate-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {/* Announcement Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 mb-6 hover:bg-slate-200/70 transition-colors cursor-default">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Multi-Screen Sharing 2.0 • Ultra-low latency WebRTC</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.08]">
              Stop switching screens. <br />
              <span className="text-blue-600">Show the whole picture.</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              When a project involves multiple workflows, one screen isn&apos;t enough. Duet lets multiple presenters share their screens simultaneously, so everyone follows the complete story in one meeting.
            </p>

            {/* Quick Actions: Responsive Desktop vs Mobile */}
            {/* Desktop View: Input field with code + Host meeting */}
            <div className="hidden sm:flex mt-8 items-center justify-center gap-3 max-w-lg mx-auto">
              <form onSubmit={joinNow} className="flex items-center w-auto flex-1 gap-2">
                <div className="relative flex-1 sm:w-80">
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter meeting code (e.g. ABC-DEF-GHI)"
                    className="h-10 text-sm pl-3 pr-10 bg-slate-50 border-slate-300 font-mono tracking-wide placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
                    ↵
                  </span>
                </div>
                <Button type="submit" disabled={joining || !code.trim()} size="md" className="h-10 px-5 shrink-0">
                  {joining ? "Joining..." : "Join"}
                </Button>
              </form>

              <div className="text-xs font-medium text-slate-400">or</div>

              <Link href="/create" className="w-auto">
                <Button variant="secondary" size="md" className="h-10 w-auto">
                  Host meeting
                </Button>
              </Link>
            </div>

            {/* Mobile View: Hide text code input and 'or', show direct prominent Download App button */}
            <div className="sm:hidden mt-7 flex flex-col items-center gap-3 w-full max-w-sm mx-auto px-2">
              <a
                href="/app-arm64-v8a-release.apk"
                download="duet-arm64.apk"
                className="w-full inline-flex items-center justify-center gap-2.5 h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all text-center"
              >
                <Smartphone size={18} />
                <span>Download Android App (APK)</span>
                <Download size={16} />
              </a>
              <div className="flex items-center justify-center gap-3 pt-1 text-xs text-slate-500">
                <Link href="/create" className="font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Host meeting
                </Link>
                <span className="text-slate-300">•</span>
                <Link href="/join" className="font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Join via web browser
                </Link>
              </div>
            </div>

            {/* Mobile App Download Note (Shown on desktop) */}
            <div className="hidden sm:flex mt-4 items-center justify-center gap-2 text-xs text-slate-500">
              <Smartphone size={14} className="text-blue-600 shrink-0" />
              <span>Joining from a mobile device?</span>
              <a
                href="/app-arm64-v8a-release.apk"
                download="duet-arm64.apk"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
              >
                Download Android App to share your screen <Download size={12} />
              </a>
            </div>
          </div>

          {/* Interactive Screen Preview Stage */}
          <div className="max-w-5xl mx-auto mt-4">
            <HeroPreview />
          </div>

          {/* Trust strip */}
          <div className="mt-14 pt-8 border-t border-slate-200/60 max-w-4xl mx-auto text-center">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-5">
              Engineered for fast-moving engineering &amp; product teams
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-mono text-xs font-semibold">
              <span className="flex items-center gap-1.5 tracking-wider hover:text-slate-700 transition-colors">
                ▲ VERCEL
              </span>
              <span className="flex items-center gap-1.5 tracking-wider hover:text-slate-700 transition-colors">
                ⚡ RAYCAST
              </span>
              <span className="flex items-center gap-1.5 tracking-wider hover:text-slate-700 transition-colors">
                ■ RETOOL
              </span>
              <span className="flex items-center gap-1.5 tracking-wider hover:text-slate-700 transition-colors">
                ⊞ LINEAR
              </span>
              <span className="flex items-center gap-1.5 tracking-wider hover:text-slate-700 transition-colors">
                ✦ RESEND
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Problem & Solution */}
      <section id="product" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <Badge variant="default" className="mb-3">
              The Dual-Screen Advantage
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Traditional meetings were built for single presentations. Duet is built for connected work.
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              In real development, code changes depend on API specs, frontend implementations mirror design files, and backend logs validate user actions. Here is how Duet compares:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional conferencing */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                  Traditional Conferencing (Zoom, Meet, Teams)
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">Single-Screen Bottleneck</h3>
                <ul className="mt-6 space-y-3.5 text-sm text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>Only one participant can share at any moment.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>&quot;Can you unshare so I can show mine?&quot; breaks conversational momentum.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>No simultaneous side-by-side inspection between frontend and backend.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold shrink-0">✕</span>
                    <span>Screen switching delays cause cognitive fatigue during code reviews.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500 font-medium">
                Fragile context • Repeated interruptions
              </div>
            </div>

            {/* Duet approach */}
            <div className="bg-blue-50/50 border border-blue-200/80 rounded-xl p-8 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  The Duet Protocol
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">True Multi-Screen Flow</h3>
                <ul className="mt-6 space-y-3.5 text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <span>Multiple presenters publish independent WebRTC screen tracks at the same time.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <span>Viewers see active screens side-by-side with crisp 4K text readability.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <span>Instant Focus and Wall layouts allow drilling into any screen without hiding others.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <span>Full audio, video, and meeting chat run alongside multi-stream sharing.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-8 pt-4 border-t border-blue-200/80 text-xs text-blue-700 font-semibold">
                Continuous context • Zero switching lag
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 border-t border-slate-200/60 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="default" className="mb-3">
              Workflow
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Three steps to complete collaboration
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              No account creation required. Instant links for you and your team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                01
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-4">Create your room</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Generate an instant meeting room with one click. Share the clean short-link with your team.
              </p>
            </Card>

            <Card className="p-6 bg-white">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                02
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-4">Share simultaneously</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Each presenter clicks &ldquo;Share screen&rdquo;. Presentations run concurrently without overriding each other.
              </p>
            </Card>

            <Card className="p-6 bg-white">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                03
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-4">Follow the complete story</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Attendees view multiple active workflows side-by-side, switch to focus view, and collaborate in real-time.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="default" className="mb-3">
              Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Built for high-precision demonstrations
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Every feature is engineered to eliminate friction and keep teams aligned.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:border-slate-300 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Monitor size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Simultaneous Screen Sharing</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Multiple participants share independently with dedicated WebRTC video pipelines and presenter labels.
              </p>
            </Card>

            <Card className="p-6 hover:border-slate-300 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <LayoutGrid size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Grid, Focus &amp; Wall Layouts</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Adaptive layout manager automatically optimizes tile placement for 1, 2, or many concurrent streams.
              </p>
            </Card>

            <Card className="p-6 hover:border-slate-300 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Maximize2 size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Context-Preserving Focus</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Click any screen to expand it to the main viewport while retaining secondary presenters in a quick-access ribbon.
              </p>
            </Card>

            <Card className="p-6 hover:border-slate-300 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Zap size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Sub-50ms Global Latency</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Optimized selective forwarding unit (SFU) delivers realtime 60 FPS video with minimal bandwidth overhead.
              </p>
            </Card>

            <Card className="p-6 hover:border-slate-300 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                <MessageSquare size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Integrated Live Chat</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                In-meeting text discussion with unread indicators, formatted code snippets, and timestamped messages.
              </p>
            </Card>

            <Card className="p-6 hover:border-slate-300 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Shield size={20} />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Host Security &amp; Room Locks</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Enforce host-only sharing, lock meetings to prevent new entrants, and remove disruptive participants instantly.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="usecases" className="py-20 border-t border-slate-200/60 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="default" className="mb-3">
              Applications
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Designed for modern software teams
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              Duet transforms how developers, designers, and product leaders communicate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white">
              <h3 className="text-base font-semibold text-slate-900">Frontend &amp; Backend Demos</h3>
              <p className="text-sm text-slate-600 mt-2">
                One developer shares the client UI in Chrome while another streams the GraphQL server and database queries live.
              </p>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-base font-semibold text-slate-900">Collaborative Debugging</h3>
              <p className="text-sm text-slate-600 mt-2">
                Inspect application logs in Datadog alongside source code in VS Code without asking teammates to switch shares.
              </p>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-base font-semibold text-slate-900">Design Walkthroughs</h3>
              <p className="text-sm text-slate-600 mt-2">
                Compare Figma design prototypes directly against production implementations on mobile or desktop side-by-side.
              </p>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-base font-semibold text-slate-900">Product &amp; Sprint Reviews</h3>
              <p className="text-sm text-slate-600 mt-2">
                Feature teams demonstrate complementary services concurrently, keeping stakeholders engaged without downtime.
              </p>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-base font-semibold text-slate-900">Technical Interviews</h3>
              <p className="text-sm text-slate-600 mt-2">
                Candidate and interviewer share reference documentation and code editors simultaneously for natural collaboration.
              </p>
            </Card>

            <Card className="p-6 bg-white">
              <h3 className="text-base font-semibold text-slate-900">Remote Architecture Reviews</h3>
              <p className="text-sm text-slate-600 mt-2">
                Display architecture diagrams and schema definitions together to reach consensus rapidly.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-3">
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Frequently asked questions</h2>
            <p className="mt-2 text-sm text-slate-600">Common questions about Duet and simultaneous screen sharing.</p>
          </div>

          <div className="space-y-4">
            {[
              [
                "Can multiple participants share their screen at the exact same time?",
                "Yes. That is the core architecture of Duet. Each presenter publishes an independent WebRTC screen share track, allowing all attendees to view both or multiple screens concurrently in grid, focus, or wall layouts.",
              ],
              [
                "Does starting a new screen share stop or replace another active presenter?",
                "No. Unlike traditional video conferencing tools that restrict sharing to a single active stream, Duet supports concurrent, independent screen tracks with distinct presenter labels and telemetry.",
              ],
              [
                "Do participants need to create an account or install native software?",
                "No. Duet runs directly in modern web browsers (Chrome, Edge, Firefox, Safari) using standard WebRTC APIs. You can start or join a meeting instantly with just a link or meeting code.",
              ],
              [
                "What controls does the meeting host have?",
                "Hosts can lock the room to prevent new entrants, restrict screen sharing permissions to the host only, mute participants, and remove attendees if needed.",
              ],
              [
                "Are meetings recorded or stored on Duet servers?",
                "No. Real-time media is routed via encrypted WebRTC peer streams. Duet does not record or retain your video, audio, or shared screens by default.",
              ],
            ].map(([question, answer]) => (
              <details
                key={question}
                className="group border border-slate-200 rounded-xl bg-slate-50/50 p-5 transition-all [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer font-medium text-slate-900 text-sm">
                  <span>{question}</span>
                  <ChevronDown
                    size={16}
                    className="text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4"
                  />
                </summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 bg-[#0A0D14] text-white border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready for frictionless multi-screen meetings?
          </h2>
          <p className="mt-4 text-base text-slate-400 max-w-xl mx-auto">
            Experience real-time simultaneous collaboration without taking turns. Start a meeting in seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/create">
              <Button size="lg" className="h-11 px-6">
                Start a meeting free
              </Button>
            </Link>
            <Link href="/join">
              <Button variant="secondary" size="lg" className="h-11 px-6">
                Join with a code
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Logo size={24} />
            <p className="mt-3 text-xs text-slate-500 max-w-xs leading-relaxed">
              Real-time meetings with simultaneous screen sharing. Two screens. Zero switching. All flow.
            </p>
            <p className="mt-4 text-xs text-slate-400">
              © {new Date().getFullYear()} Duet. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/create" className="hover:text-slate-900 transition-colors">
                  Start meeting
                </Link>
              </li>
              <li>
                <Link href="/join" className="hover:text-slate-900 transition-colors">
                  Join meeting
                </Link>
              </li>
              <li>
                <a
                  href="/app-arm64-v8a-release.apk"
                  download="duet-arm64.apk"
                  className="hover:text-slate-900 transition-colors inline-flex items-center gap-1.5 font-medium text-blue-600"
                >
                  <Smartphone size={13} /> Download Android App (APK)
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how" className="hover:text-slate-900 transition-colors">
                  How it works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/help" className="hover:text-slate-900 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-slate-900 transition-colors">
                  System Status
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-slate-900 transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/acceptable-use" className="hover:text-slate-900 transition-colors">
                  Acceptable Use
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-slate-900 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
