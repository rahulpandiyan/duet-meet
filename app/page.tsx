"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button, Card, Input } from "@/components/ui";
import HeroPreview from "@/components/HeroPreview";
import {
  Monitor, Mic, Video, MessageSquare, Users, LayoutGrid, Maximize2, Columns3,
  Shield, CheckCircle2, Heart, ChevronDown, Play, Lock, Wifi, Zap, Eye,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);

  async function joinNow() {
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
      router.push("/join");
    } finally {
      setJoining(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-text-primary">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
            <a href="#product" className="hover:text-text-primary">Product</a>
            <a href="#how" className="hover:text-text-primary">How it works</a>
            <a href="#usecases" className="hover:text-text-primary">Use cases</a>
            <a href="#faq" className="hover:text-text-primary">FAQ</a>
          </nav>
          <Link href="/create">
            <Button size="sm" className="rounded-full px-6">Start a meeting</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-semibold tracking-widest text-primary mb-3">BUILT FOR BETTER DEMONSTRATIONS</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Stop switching screens. Show the whole picture.
          </h1>
          <p className="mt-5 text-lg text-text-secondary max-w-xl leading-relaxed">
            When a project involves multiple workflows, one screen isn't enough. Duet lets multiple presenters share their screens simultaneously, so everyone can follow the complete story in one meeting.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/create">
              <Button size="lg" className="rounded-full px-8">Start a meeting</Button>
            </Link>
            <a href="#how">
              <Button variant="secondary" size="lg" className="rounded-full px-8">See how it works</Button>
            </a>
          </div>
          <p className="mt-4 text-sm text-text-secondary">Multiple presenters. Multiple screens. One conversation.</p>
        </div>

        <div>
          <HeroPreview />
        </div>
      </section>

      {/* Join now */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-4 justify-between">
          <div>
            <h3 className="text-xl font-bold">Join a meeting now</h3>
            <p className="text-sm text-text-secondary mt-1">Enter the code at the end of your meeting link. It'll look something like this: abc-defg-hjk</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="abc-defg-hjk" className="md:w-48 rounded-full" />
            <Button onClick={joinNow} disabled={joining} className="rounded-full px-6">{joining ? "Joining..." : "Join"}</Button>
          </div>
        </Card>
      </section>

      {/* Product */}
      <section id="product" className="bg-app-bg py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Multiple screens, visible together</h2>
            <p className="mt-4 text-text-secondary text-lg">
              Duet keeps every presentation on screen at the same time. No more taking turns, no more lost context.
            </p>
            <ul className="mt-6 space-y-3 text-text-secondary">
              <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-success" /> Share simultaneously</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-success" /> Side-by-side viewing</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-success" /> Focus any screen without losing others</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-success" /> Audio, video, and chat included</li>
            </ul>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* Feature sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">See every screen clearly</h2>
            <p className="mt-4 text-text-secondary text-lg">
              Shared screens stay sharp and readable. Switch to focus or wall view when you need a closer look at one workflow.
            </p>
            <ul className="mt-6 space-y-3 text-text-secondary">
              <li className="flex items-center gap-2"><Eye size={18} className="text-primary" /> Grid, focus, and wall layouts</li>
              <li className="flex items-center gap-2"><Eye size={18} className="text-primary" /> Resizable panels</li>
              <li className="flex items-center gap-2"><Eye size={18} className="text-primary" /> Clear presenter labels</li>
            </ul>
          </div>
          <Illustration icon={<Monitor size={64} className="text-primary/30" />} label="Code editor sharing" />
        </div>
      </section>

      <section className="py-20 bg-app-bg">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Illustration icon={<LayoutGrid size={64} className="text-primary/30" />} label="Side-by-side screens" />
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Stay in sync</h2>
            <p className="mt-4 text-text-secondary text-lg">
              Talk through your demo with live audio, video, and chat while screens stay visible.
            </p>
            <ul className="mt-6 space-y-3 text-text-secondary">
              <li className="flex items-center gap-2"><Mic size={18} className="text-primary" /> Microphone and camera controls</li>
              <li className="flex items-center gap-2"><MessageSquare size={18} className="text-primary" /> Meeting-wide chat</li>
              <li className="flex items-center gap-2"><Zap size={18} className="text-primary" /> Active sharing indicators</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Keep presentations engaging</h2>
            <p className="mt-4 text-text-secondary text-lg">
              Focus on one screen without hiding the rest. Everyone follows along at their own pace.
            </p>
            <ul className="mt-6 space-y-3 text-text-secondary">
              <li className="flex items-center gap-2"><Maximize2 size={18} className="text-primary" /> Expand a screen on demand</li>
              <li className="flex items-center gap-2"><Columns3 size={18} className="text-primary" /> Wall view for many shares</li>
              <li className="flex items-center gap-2"><Play size={18} className="text-primary" /> Live previews, no permissions needed</li>
            </ul>
          </div>
          <Illustration icon={<Maximize2 size={64} className="text-primary/30" />} label="Focus view" />
        </div>
      </section>

      <section className="py-20 bg-app-bg">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <Illustration icon={<Shield size={64} className="text-success/30" />} label="Secure meeting" />
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Secure by default</h2>
            <p className="mt-4 text-text-secondary text-lg">
              Meetings are private by default. Hosts control who can share, lock rooms, and remove participants.
            </p>
            <ul className="mt-6 space-y-3 text-text-secondary">
              <li className="flex items-center gap-2"><Lock size={18} className="text-primary" /> Host-only sharing option</li>
              <li className="flex items-center gap-2"><Shield size={18} className="text-primary" /> Server-enforced permissions</li>
              <li className="flex items-center gap-2"><Wifi size={18} className="text-primary" /> Reconnection handling</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">How Duet works</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Step n="01" title="Create a meeting" desc="Start a meeting and invite your teammates." />
            <Step n="02" title="Share your screens" desc="Each participant shares their own screen without replacing another active presentation." />
            <Step n="03" title="See the full picture" desc="The audience views multiple active screens together and follows the complete workflow." />
          </div>
        </div>
      </section>

      {/* Features bento */}
      <section id="product" className="py-20 bg-app-bg">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Features built for demonstrations</h2>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Feature icon={<Monitor size={20} />} title="Simultaneous sharing" desc="Multiple participants present independently." />
            <Feature icon={<LayoutGrid size={20} />} title="Grid, focus & wall" desc="Choose the layout that fits your demo." />
            <Feature icon={<Maximize2 size={20} />} title="Focus without losing context" desc="Expand one screen, keep others in a strip." />
            <Feature icon={<MessageSquare size={20} />} title="Live chat" desc="Discuss without interrupting shares." />
            <Feature icon={<Users size={20} />} title="Participant management" desc="See who's sharing and who's connected." />
            <Feature icon={<Shield size={20} />} title="Host controls" desc="Restrict sharing, lock, or end the meeting." />
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="usecases" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Use cases</h2>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <UseCase title="Software demos" desc="Show frontend and backend together." />
            <UseCase title="Collaborative debugging" desc="Examine multiple tools and logs." />
            <UseCase title="Project reviews" desc="Compare interfaces and workflows." />
            <UseCase title="Design walkthroughs" desc="Review designs alongside implementation." />
            <UseCase title="Remote teaching" desc="Demonstrate multiple applications." />
            <UseCase title="Team presentations" desc="Present connected stories together." />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-app-bg">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {[
              ["Can multiple people share at the same time?", "Yes. Each participant publishes an independent screen share."],
              ["Does starting a share stop another?", "No. Shares are independent."],
              ["What browsers are supported?", "Modern desktop browsers supporting WebRTC and getDisplayMedia."],
              ["Do I need an account?", "No. Guest access is supported."],
              ["Is the meeting recorded?", "No. Meetings are not recorded by default."],
            ].map(([q, a]) => (
              <details key={q} className="group rounded-xl border border-gray-200 bg-white p-4">
                <summary className="cursor-pointer font-medium text-text-primary flex items-center justify-between">
                  {q}
                  <ChevronDown className="text-text-secondary group-open:rotate-180 transition-transform" size={16} />
                </summary>
                <p className="mt-2 text-sm text-text-secondary">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Your next demo deserves the full picture.</h2>
          <p className="mt-3 text-white/80">Bring your teammates together and show every important part of your project in one meeting.</p>
          <div className="mt-8">
            <Link href="/create">
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full px-8">Start a meeting</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-surface py-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3"><Logo size={20} /></div>
            <p className="text-text-secondary text-xs">Multiple presenters. Multiple screens. One conversation.</p>
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-2">Product</div>
            <ul className="space-y-1 text-text-secondary">
              <li><a href="#product" className="hover:text-primary">Features</a></li>
              <li><a href="#how" className="hover:text-primary">How it works</a></li>
              <li><a href="#usecases" className="hover:text-primary">Use cases</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-2">Resources</div>
            <ul className="space-y-1 text-text-secondary">
              <li><Link href="/help" className="hover:text-primary">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/security" className="hover:text-primary">Security</Link></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-2">Legal</div>
            <ul className="space-y-1 text-text-secondary">
              <li><Link href="/terms" className="hover:text-primary">Terms of Use</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-primary">Cookie Policy</Link></li>
              <li><Link href="/acceptable-use" className="hover:text-primary">Acceptable Use</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-gray-200 flex flex-col items-center gap-2 text-center">
          <Logo size={28} />
          <span className="text-sm font-semibold text-text-primary tracking-tight">Two screens. Zero switching. All flow.</span>
          <p className="text-xs text-text-secondary">Built different. Built by Rahul Pandiyan.</p>
        </div>
      </footer>
    </main>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <Card className="p-6">
      <div className="text-sm font-bold text-primary">{n}</div>
      <div className="font-semibold text-text-primary mt-2">{title}</div>
      <div className="text-sm text-text-secondary mt-1">{desc}</div>
    </Card>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="p-5 flex gap-4">
      <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center">{icon}</div>
      <div>
        <div className="font-semibold text-text-primary">{title}</div>
        <div className="text-sm text-text-secondary mt-1">{desc}</div>
      </div>
    </Card>
  );
}

function UseCase({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="p-5">
      <div className="font-semibold text-text-primary">{title}</div>
      <div className="text-sm text-text-secondary mt-1">{desc}</div>
    </Card>
  );
}

function Illustration({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-primary/5 to-accent/10 p-12 flex flex-col items-center justify-center min-h-[280px]">
      {icon}
      <p className="mt-4 text-sm text-text-secondary font-medium">{label}</p>
    </div>
  );
}
