"use client";
import { Logo } from "@/components/Logo";
import { Monitor, Mic, Video, MessageSquare, Users, PhoneOff, Circle, Folder, FileCode2, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroPreview() {
  return (
    <motion.div className="relative w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
      <div className="absolute -top-3 right-3 z-10 text-[10px] font-medium text-text-secondary bg-white/90 backdrop-blur px-2 py-1 rounded-full border border-gray-200 shadow-sm">
        Product preview
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-clay-soft overflow-hidden">
        {/* Meeting header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-[#F8FAFD]">
          <div className="flex items-center gap-2">
            <Logo size={18} showText={false} />
            <span className="text-xs font-semibold text-text-primary">Duet</span>
            <span className="text-[10px] text-text-secondary bg-gray-100 px-2 py-0.5 rounded-full">ABCD-EFGH</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-success font-medium">
              <Circle size={7} fill="currentColor" /> 2 presenters sharing
            </span>
            <span className="flex items-center gap-1 text-text-secondary">
              <Users size={12} /> 4
            </span>
          </div>
        </div>

        {/* Screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-meeting-bg">
          <BrowserWindow title="VS Code — api/routes.ts" accent="blue">
            <CodeEditor />
          </BrowserWindow>
          <BrowserWindow title="localhost:3000 — Dashboard" accent="emerald">
            <RunningApp />
          </BrowserWindow>
        </div>

        {/* Presenter labels */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-white text-[11px]">
          <span className="flex items-center gap-1.5 text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Alex · Sharing screen
          </span>
          <span className="flex items-center gap-1.5 text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Sam · Sharing screen
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-center gap-2 py-2.5 border-t border-gray-100 bg-[#F8FAFD]">
          <ToolIcon icon={<Mic size={14} />} active />
          <ToolIcon icon={<Video size={14} />} active />
          <ToolIcon icon={<Monitor size={14} />} active primary />
          <ToolIcon icon={<MessageSquare size={14} />} />
          <ToolIcon icon={<Users size={14} />} />
          <span className="mx-1 h-5 w-px bg-gray-200" />
          <span className="h-7 px-3 rounded-lg bg-danger text-white text-[11px] font-medium flex items-center gap-1">
            <PhoneOff size={12} /> Leave
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function BrowserWindow({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  const dot = accent === "blue" ? "bg-blue-500" : "bg-emerald-500";
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white shadow-sm">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border-b border-gray-200">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 text-[10px] text-text-secondary truncate bg-white rounded px-2 py-0.5 border border-gray-200">
          {title}
        </div>
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      </div>
      <div className="bg-white">{children}</div>
    </div>
  );
}

function CodeEditor() {
  return (
    <div className="flex text-[9px] font-mono">
      {/* Sidebar */}
      <div className="w-24 shrink-0 border-r border-gray-200 bg-[#F6F8FC] p-2 space-y-1">
        <div className="flex items-center gap-1 text-text-secondary">
          <Folder size={9} /> src
        </div>
        <div className="pl-3 flex items-center gap-1 text-text-secondary">
          <Folder size={9} /> api
        </div>
        <div className="pl-6 flex items-center gap-1 text-primary font-medium">
          <FileCode2 size={9} /> routes.ts
        </div>
        <div className="pl-3 flex items-center gap-1 text-text-secondary">
          <Folder size={9} /> components
        </div>
        <div className="pl-3 flex items-center gap-1 text-text-secondary">
          <FileCode2 size={9} /> page.tsx
        </div>
      </div>
      {/* Code */}
      <div className="flex-1 p-2 space-y-0.5 overflow-hidden">
        <CodeLine n={1} text="import { NextResponse } from 'next/server';" />
        <CodeLine n={2} text="import { AccessToken } from 'livekit-server-sdk';" />
        <CodeLine n={3} text="" />
        <CodeLine n={4} text="export async function POST(req: Request) {" />
        <CodeLine n={5} text="  const body = await req.json();" />
        <CodeLine n={6} text="  const room = genCode();" />
        <CodeLine n={7} text="  const token = await issueToken(room);" />
        <CodeLine n={8} text="  return NextResponse.json({ room, token });" />
        <CodeLine n={9} text="}" />
        <CodeLine n={10} text="" />
        <CodeLine n={11} text="// screen share track published" />
        <CodeLine n={12} text="await participant.setScreenShareEnabled(true);" />
      </div>
    </div>
  );
}

function CodeLine({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex gap-2 leading-4">
      <span className="w-4 text-right text-gray-300 select-none">{n}</span>
      <span className="text-text-primary truncate">{text || "\u00A0"}</span>
    </div>
  );
}

function RunningApp() {
  return (
    <div className="p-3 space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold text-text-primary">Analytics dashboard</span>
      <span className="text-[9px] px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">Live</span>
    </div>
    {/* Chart area */}
    <div className="h-16 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 flex items-end px-2 pb-2 gap-1">
      {[40, 65, 30, 80, 55, 90, 45, 70].map((h, i) => (
        <div key={i} className="flex-1 bg-primary/70 rounded-t" style={{ height: `${h}%` }} />
      ))}
    </div>
    {/* Stats row */}
    <div className="grid grid-cols-3 gap-1.5">
      <Stat label="Users" value="1,284" />
      <Stat label="Sessions" value="342" />
      <Stat label="Uptime" value="99.9%" />
    </div>
    {/* Table */}
    <div className="space-y-1">
      <div className="flex justify-between text-[9px] text-text-secondary border-b border-gray-100 pb-0.5">
        <span>Event</span>
        <span>Status</span>
      </div>
      {["Deploy succeeded", "Build passed", "Tests green"].map((t, i) => (
        <div key={i} className="flex justify-between text-[9px]">
          <span className="text-text-primary">{t}</span>
          <span className="text-success">OK</span>
        </div>
      ))}
    </div>
    <div className="flex items-center gap-1.5 pt-1">
      <span className="text-[9px] px-2 py-1 rounded bg-primary text-white font-medium flex items-center gap-1">
        <Play size={8} /> Run demo
      </span>
    </div>
  </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-[#F8FAFD] px-2 py-1.5 text-center">
      <div className="text-[10px] font-bold text-text-primary">{value}</div>
      <div className="text-[8px] text-text-secondary">{label}</div>
    </div>
  );
}

function ToolIcon({ icon, active, primary }: { icon: React.ReactNode; active?: boolean; primary?: boolean }) {
  return (
    <span
      className={`h-7 w-7 rounded-lg flex items-center justify-center ${
        primary ? "bg-primary text-white" : active ? "bg-gray-200 text-text-primary" : "bg-gray-100 text-text-secondary"
      }`}
    >
      {icon}
    </span>
  );
}
