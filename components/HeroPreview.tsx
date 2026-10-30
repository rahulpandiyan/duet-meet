"use client";

import React from "react";
import {
  Mic,
  Video,
  Monitor,
  MessageSquare,
  Users,
  PhoneOff,
  Terminal,
  Circle,
  Wifi,
  Zap,
  Maximize2,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";

export default function HeroPreview() {
  return (
    <motion.div
      className="relative w-full rounded-xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-[#0A0D14] shadow-2xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Telemetry Header */}
      <div className="px-4 py-2.5 bg-[#121620] border-b border-white/8 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Session</span>
          </div>
          <span className="text-slate-600 dark:text-slate-500">•</span>
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
            <Monitor size={13} />
            <span>2 Presenters Sharing</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <Zap size={11} className="text-emerald-400" />
            60 FPS
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Wifi size={11} />
            18ms
          </span>
          <span className="hidden sm:inline-block text-slate-700">•</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-300">
            WebRTC Mesh
          </span>
        </div>
      </div>

      {/* Side-by-Side Dual Presenter Canvas */}
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#0A0D14] min-h-[380px]">
        {/* Presenter 1: Alex M. (Backend API & Stream Orchestrator) */}
        <div className="bg-[#121620] border border-emerald-500/40 rounded-lg overflow-hidden flex flex-col relative group shadow-lg">
          {/* Editor Header */}
          <div className="bg-[#161B26] px-3 py-1.5 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-slate-400 font-mono text-[10px] ml-1.5">
                stream_orchestrator.ts
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 font-mono text-[10px] text-slate-400">
              TypeScript
            </span>
          </div>

          {/* Code Body */}
          <div className="p-3.5 font-mono text-[10.5px] leading-relaxed flex-1 bg-[#0D111A] text-slate-300 overflow-x-auto select-none">
            <div className="space-y-1">
              <div>
                <span className="text-slate-600 mr-2.5 select-none">01</span>
                <span className="text-blue-400">import</span> &#123; WebRTCStreamHub &#125;{" "}
                <span className="text-blue-400">from</span>{" "}
                <span className="text-emerald-300">&quot;@duet/mesh&quot;</span>;
              </div>
              <div>
                <span className="text-slate-600 mr-2.5 select-none">02</span>
                <span className="text-slate-500 italic">&#47;&#47; Simultaneous dual pipeline</span>
              </div>
              <div>
                <span className="text-slate-600 mr-2.5 select-none">03</span>
                <span className="text-blue-400">export async function</span>{" "}
                <span className="text-amber-300">lockStreams</span>(session) &#123;
              </div>
              <div>
                <span className="text-slate-600 mr-2.5 select-none">04</span>
                &nbsp;&nbsp;<span className="text-blue-400">const</span> hub ={" "}
                <span className="text-blue-400">await</span> WebRTCStreamHub.connect(&#123;
              </div>
              <div>
                <span className="text-slate-600 mr-2.5 select-none">05</span>
                &nbsp;&nbsp;&nbsp;&nbsp;peers: [<span className="text-emerald-300">&quot;alex.m&quot;</span>,{" "}
                <span className="text-emerald-300">&quot;sarah.k&quot;</span>],
              </div>
              <div>
                <span className="text-slate-600 mr-2.5 select-none">06</span>
                &nbsp;&nbsp;&nbsp;&nbsp;targetFps: <span className="text-emerald-400">60</span>,
              </div>
              <div>
                <span className="text-slate-600 mr-2.5 select-none">07</span>
                &nbsp;&nbsp;&nbsp;&nbsp;maxBitrateKbps: <span className="text-emerald-400">18500</span>
              </div>
              <div>
                <span className="text-slate-600 mr-2.5 select-none">08</span>
                &nbsp;&nbsp;&#125;);
              </div>
              <div>
                <span className="text-slate-600 mr-2.5 select-none">09</span>
                &nbsp;&nbsp;<span className="text-blue-400">return</span> hub.syncLatency(&quot;18ms&quot;);
              </div>
              <div>
                <span className="text-slate-600 mr-2.5 select-none">10</span>
                &#125;
              </div>
            </div>
          </div>

          {/* Terminal Status Strip */}
          <div className="border-t border-white/8 bg-[#161B26] px-3 py-1.5 font-mono text-[10px] flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Terminal size={11} />
              bun dev --turbo (port :8080)
            </span>
            <span className="text-slate-500">4K • 60 FPS</span>
          </div>

          {/* Presenter Label */}
          <div className="absolute bottom-9 left-2.5 flex items-center gap-2 px-2.5 py-1 rounded bg-[#0A0D14]/95 border border-emerald-500/50 shadow-md backdrop-blur">
            <div className="h-4 w-4 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center">
              AM
            </div>
            <span className="text-xs font-medium text-slate-200">Alex M. (Screen 1 — API)</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Presenter 2: Sarah K. (Figma & Live App Simulator) */}
        <div className="bg-[#121620] border border-blue-500/40 rounded-lg overflow-hidden flex flex-col relative group shadow-lg">
          {/* Simulator Header */}
          <div className="bg-[#161B26] px-3 py-1.5 border-b border-white/8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-slate-400 font-mono text-[10px] ml-1.5">
                Duet Mobile App — Live Simulator
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 font-mono text-[10px] text-slate-400">
              iOS Simulator
            </span>
          </div>

          {/* Visual Workspace Canvas */}
          <div className="p-3.5 flex-1 bg-[#0D111A] flex gap-3 items-center justify-center select-none">
            {/* Mini Figma Frame */}
            <div className="flex-1 h-full bg-[#151922] border border-white/8 rounded p-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-white/8 mb-2">
                  <span className="text-[10px] font-medium text-slate-400">Canvas • 100%</span>
                  <div className="flex -space-x-1">
                    <span className="h-3.5 w-3.5 rounded-full bg-amber-500 text-[8px] text-white flex items-center justify-center font-bold">
                      SK
                    </span>
                    <span className="h-3.5 w-3.5 rounded-full bg-blue-500 text-[8px] text-white flex items-center justify-center font-bold">
                      AM
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 bg-white/10 rounded w-3/4" />
                  <div className="h-10 bg-white/5 rounded border border-white/5 flex items-center justify-center text-[9px] text-slate-400">
                    Dual Video Stream Grid
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="h-6 bg-white/5 rounded border border-white/5" />
                    <div className="h-6 bg-white/5 rounded border border-white/5" />
                  </div>
                </div>
              </div>
              <div className="text-[9px] text-slate-500 flex justify-between pt-2">
                <span>Vector Synced</span>
                <span className="text-blue-400 font-mono">Ready</span>
              </div>
            </div>

            {/* Simulated iPhone Frame */}
            <div className="w-28 sm:w-32 bg-[#0A0D14] border-2 border-white/15 rounded-xl p-2 flex flex-col justify-between shadow-xl">
              <div className="w-10 h-2 bg-white/20 rounded-full mx-auto mb-1" />
              <div className="bg-[#151922] p-2 rounded text-center my-1">
                <div className="h-6 w-6 rounded-full bg-blue-600 text-white mx-auto mb-1 flex items-center justify-center">
                  <Monitor size={11} />
                </div>
                <div className="text-[9px] font-semibold text-slate-200">Duet Session</div>
                <div className="text-[8px] text-emerald-400">Connected</div>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 bg-white/10 rounded w-full" />
                <div className="h-1.5 bg-white/10 rounded w-4/5" />
              </div>
              <div className="w-8 h-0.5 bg-white/20 rounded-full mx-auto mt-2" />
            </div>
          </div>

          {/* Footer Status */}
          <div className="border-t border-white/8 bg-[#161B26] px-3 py-1.5 font-mono text-[10px] flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Maximize2 size={11} />
              Direct Mirroring Active
            </span>
            <span className="text-slate-500">1080p • 60 FPS</span>
          </div>

          {/* Presenter Label */}
          <div className="absolute bottom-9 left-2.5 flex items-center gap-2 px-2.5 py-1 rounded bg-[#0A0D14]/95 border border-blue-500/50 shadow-md backdrop-blur">
            <div className="h-4 w-4 rounded-full bg-amber-600 text-white font-bold text-[9px] flex items-center justify-center">
              SK
            </div>
            <span className="text-xs font-medium text-slate-200">Sarah K. (Screen 2 — UI)</span>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Floating Bottom Toolbar */}
      <div className="p-2 sm:p-2.5 bg-[#121620] border-t border-white/8 flex items-center justify-center gap-1.5 sm:gap-2">
        <button
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 flex items-center justify-center transition-colors shrink-0"
          title="Microphone On"
        >
          <Mic size={13} className="sm:w-3.5 sm:h-3.5" />
        </button>
        <button
          className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 flex items-center justify-center transition-colors shrink-0"
          title="Camera On"
        >
          <Video size={13} className="sm:w-3.5 sm:h-3.5" />
        </button>
        <div className="h-3.5 w-px bg-white/10 mx-0.5 sm:mx-1" />
        <button
          className="h-7 px-2 sm:h-8 sm:px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1 sm:gap-1.5 shadow-sm transition-colors shrink-0"
          title="Share Screen"
        >
          <Monitor size={13} className="sm:w-3.5 sm:h-3.5" />
          <span className="hidden xs:inline sm:inline">Sharing Screen</span>
          <span className="inline xs:hidden sm:hidden">Share</span>
        </button>
        <button
          className="h-7 px-2 sm:h-8 sm:px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1 sm:gap-1.5 transition-colors shrink-0"
          title="Meeting Chat"
        >
          <MessageSquare size={12} className="sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Chat</span>
        </button>
        <button
          className="h-7 px-1.5 sm:h-8 sm:px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs flex items-center gap-1 sm:gap-1.5 transition-colors shrink-0"
          title="Participants"
        >
          <Users size={12} className="sm:w-3.5 sm:h-3.5" />
          <span>4</span>
        </button>
        <div className="h-3.5 w-px bg-white/10 mx-0.5 sm:mx-1" />
        <button
          className="h-7 px-2.5 sm:h-8 sm:px-3 rounded-lg bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition-all shrink-0"
          title="Leave Meeting"
        >
          <PhoneOff size={12} className="sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Leave</span>
        </button>
      </div>
    </motion.div>
  );
}
