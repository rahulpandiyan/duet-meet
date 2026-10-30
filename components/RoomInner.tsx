"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  useRoomContext,
  useLocalParticipant,
  useParticipants,
  useTracks,
  useConnectionState,
  VideoTrack,
} from "@livekit/components-react";
import { Track, RoomEvent, ConnectionState } from "livekit-client";
import { Logo } from "@/components/Logo";
import { Avatar, Badge, Dialog } from "@/components/ui";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Users,
  MessageSquare,
  LayoutGrid,
  Maximize2,
  Columns3,
  PhoneOff,
  Copy,
  Check,
  Lock,
  Unlock,
  UserX,
  Shield,
  X,
  Send,
  Info,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface Props {
  code: string;
  name: string;
  isHost: boolean;
  hostToken: string | null;
}

interface ChatMsg {
  id: string;
  sender: string;
  text: string;
  ts: number;
  isSelf?: boolean;
}

export default function RoomInner({ code, name, isHost, hostToken }: Props) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const connState = useConnectionState();
  const router = useRouter();

  const [layout, setLayout] = useState<"grid" | "focus" | "wall">("grid");
  const [focusedSid, setFocusedSid] = useState<string | null>(null);
  const [panel, setPanel] = useState<"chat" | "people" | "info" | null>(null);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [unread, setUnread] = useState(0);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [shareError, setShareError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [wasConnected, setWasConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [showHostLeaveDialog, setShowHostLeaveDialog] = useState(false);
  const [showHostSettings, setShowHostSettings] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Screen share tracks
  const screenTracks = useTracks(
    [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
    { onlySubscribed: true }
  );

  // Camera tracks for video feeds
  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: false }],
    { onlySubscribed: true }
  );

  // Fetch room settings periodically
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`/api/rooms/${code}`);
        if (res.ok) setRoomInfo(await res.json());
      } catch {}
    };
    fetchInfo();
    const iv = setInterval(fetchInfo, 5000);
    return () => clearInterval(iv);
  }, [code]);

  // Read initial user preferences from lobby
  useEffect(() => {
    const prefMic = sessionStorage.getItem(`duet:pref:mic:${code}`);
    const prefCam = sessionStorage.getItem(`duet:pref:cam:${code}`);
    if (prefMic === "0") {
      localParticipant.setMicrophoneEnabled(false);
    } else {
      localParticipant.setMicrophoneEnabled(true);
    }
    if (prefCam === "1") {
      localParticipant.setCameraEnabled(true);
    } else {
      localParticipant.setCameraEnabled(false);
    }
  }, [code, localParticipant]);

  // Data channel for real-time chat
  useEffect(() => {
    const handler = (payload: Uint8Array) => {
      try {
        const msg = JSON.parse(new TextDecoder().decode(payload));
        if (msg.type === "chat") {
          setChat((prev) => [
            ...prev,
            { id: msg.id, sender: msg.sender, text: msg.text, ts: msg.ts, isSelf: false },
          ]);
          if (panel !== "chat") {
            setUnread((u) => u + 1);
          }
        }
      } catch {}
    };
    room.on(RoomEvent.DataReceived, handler);
    return () => {
      room.off(RoomEvent.DataReceived, handler);
    };
  }, [room, panel]);

  // Sync local mic/cam/share status
  useEffect(() => {
    setMicOn(localParticipant.isMicrophoneEnabled);
    setCamOn(localParticipant.isCameraEnabled);
    setSharing(localParticipant.isScreenShareEnabled);
  }, [
    localParticipant.isMicrophoneEnabled,
    localParticipant.isCameraEnabled,
    localParticipant.isScreenShareEnabled,
  ]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (panel === "chat") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, panel]);

  const toggleMic = useCallback(async () => {
    try {
      await localParticipant.setMicrophoneEnabled(!micOn);
    } catch (e: any) {
      console.error(e);
    }
  }, [localParticipant, micOn]);

  const toggleCam = useCallback(async () => {
    try {
      await localParticipant.setCameraEnabled(!camOn);
    } catch (e: any) {
      console.error(e);
    }
  }, [localParticipant, camOn]);

  const toggleShare = useCallback(async () => {
    setShareError("");
    if (sharing) {
      try {
        await localParticipant.setScreenShareEnabled(false);
      } catch (e: any) {
        setShareError(e?.message || "Failed to stop screen share");
      }
      return;
    }
    if (roomInfo?.hostOnlyShare && !isHost) {
      setShareError("Only the host is permitted to share in this session.");
      return;
    }
    if (roomInfo?.blockedSharers?.includes(localParticipant.identity)) {
      setShareError("Your screen sharing permission has been restricted by the host.");
      return;
    }
    const max = roomInfo?.maxShares ?? 8;
    if (screenTracks.length >= max) {
      setShareError(`Maximum of ${max} simultaneous shares reached.`);
      return;
    }
    try {
      await localParticipant.setScreenShareEnabled(true);
    } catch (e: any) {
      setShareError(e?.message || "Failed to start screen share.");
    }
  }, [sharing, localParticipant, roomInfo, isHost, screenTracks.length]);

  const sendChat = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!chatInput.trim()) return;
      const msg = {
        type: "chat",
        id: Math.random().toString(36).slice(2),
        sender: name,
        text: chatInput.trim(),
        ts: Date.now(),
      };
      try {
        await localParticipant.publishData(new TextEncoder().encode(JSON.stringify(msg)), {
          reliable: true,
        });
        setChat((prev) => [
          ...prev,
          { id: msg.id, sender: msg.sender, text: msg.text, ts: msg.ts, isSelf: true },
        ]);
      } catch (e) {
        console.error(e);
      }
      setChatInput("");
    },
    [chatInput, localParticipant, name]
  );

  const leaveCallDirectly = useCallback(async () => {
    try {
      await room.disconnect();
    } catch {}
    router.push("/ended");
  }, [room, router]);

  const handleLeaveClick = () => {
    if (isHost) {
      setShowHostLeaveDialog(true);
    } else {
      leaveCallDirectly();
    }
  };

  const endMeetingForEveryone = useCallback(async () => {
    if (!hostToken) return;
    try {
      await fetch("/api/host/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, hostToken }),
      });
    } catch {}
    try {
      await room.disconnect();
    } catch {}
    router.push("/ended");
  }, [code, hostToken, room, router]);

  const removeParticipant = useCallback(
    async (identity: string) => {
      if (!hostToken) return;
      await fetch("/api/host/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, hostToken, identity }),
      });
    },
    [code, hostToken]
  );

  const toggleSharePermission = useCallback(
    async (identity: string, allow: boolean) => {
      if (!hostToken) return;
      await fetch("/api/host/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, hostToken, identity, canShare: allow }),
      });
    },
    [code, hostToken]
  );

  const toggleLock = useCallback(async () => {
    if (!hostToken || !roomInfo) return;
    await fetch("/api/host/lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, hostToken, locked: !roomInfo.locked }),
    });
    setRoomInfo((r: any) => ({ ...r, locked: !r.locked }));
  }, [code, hostToken, roomInfo]);

  const toggleHostOnlyShare = useCallback(async () => {
    if (!hostToken || !roomInfo) return;
    await fetch("/api/host/lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, hostToken, hostOnlyShare: !roomInfo.hostOnlyShare }),
    });
    setRoomInfo((r: any) => ({ ...r, hostOnlyShare: !r.hostOnlyShare }));
  }, [code, hostToken, roomInfo]);

  const copyLink = useCallback(() => {
    const link = `${window.location.origin}/join?code=${code}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const focusTrack = (sid: string | null) => {
    setFocusedSid(sid);
    if (sid) setLayout("focus");
  };

  useEffect(() => {
    if (connState === ConnectionState.Connected) setWasConnected(true);
  }, [connState]);

  useEffect(() => {
    if (wasConnected && connState === ConnectionState.Disconnected) {
      router.push("/ended");
    }
  }, [wasConnected, connState, router]);

  // Render individual screen tile
  const renderScreen = (tr: any, compact = false) => {
    const p = tr.participant;
    const label = p?.name || p?.identity || "Presenter";
    const sid = tr.publication?.trackSid;
    const isLocal = p?.isLocal;
    const isFocused = layout === "focus" && focusedSid === sid;

    return (
      <div
        key={sid || Math.random()}
        className={`relative bg-[#131314] rounded-2xl overflow-hidden border transition-all group flex flex-col ${
          isFocused
            ? "border-[#8AB4F8] shadow-2xl ring-2 ring-[#8AB4F8]/40"
            : "border-[#3C4043] hover:border-[#5F6368] shadow-lg"
        } ${compact ? "h-full" : "h-full min-h-0"}`}
        onClick={() => focusTrack(sid)}
      >
        <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-black">
          <VideoTrackWrapper trackRef={tr} />

          {/* Google Meet style Presenter pill */}
          <div className="absolute bottom-3 left-3 bg-[#202124]/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white flex items-center gap-2 shadow-lg pointer-events-none border border-white/10">
            <span className="h-2 w-2 rounded-full bg-[#8AB4F8] animate-pulse" />
            <span className="font-medium text-xs truncate max-w-[200px]">
              {label} {isLocal && "(You)"}
            </span>
          </div>

          {/* Quick Focus Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              focusTrack(isFocused ? null : sid);
              if (isFocused) setLayout("grid");
            }}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-[#202124]/80 hover:bg-[#3C4043] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 shadow-md border border-white/10"
            title={isFocused ? "Return to grid" : "Expand screen"}
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  // Render participant tile when no screens are shared (Google Meet standard)
  const renderParticipantTile = (pName: string, isSelf: boolean, isMic: boolean, isCam: boolean, trackRef?: any) => {
    return (
      <div
        key={pName}
        className="relative bg-[#3C4043] rounded-3xl overflow-hidden border border-[#5F6368]/30 flex items-center justify-center shadow-2xl min-h-[180px] sm:min-h-[240px] flex-1 group"
      >
        {isCam && trackRef ? (
          <VideoTrackWrapper trackRef={trackRef} />
        ) : (
          <div className="flex flex-col items-center justify-center">
            {/* Google Meet Circular Avatar with DiceBear Critters */}
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden flex items-center justify-center shadow-lg border border-white/10 select-none transition-transform group-hover:scale-105 duration-200 bg-[#28292A]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.dicebear.com/10.x/critters/svg?seed=${encodeURIComponent(pName.trim() || "Guest")}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                alt={pName}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        )}

        {/* Top-right Mic Muted Indicator (Google Meet style) */}
        {!isMic && (
          <div className="absolute top-3.5 right-3.5 h-8 w-8 rounded-full bg-[#202124]/90 backdrop-blur-md text-[#8AB4F8] flex items-center justify-center shadow border border-white/10">
            <MicOff size={15} className="text-[#8AB4F8]" />
          </div>
        )}

        {/* Bottom-left Name (Google Meet style) */}
        <div className="absolute bottom-3.5 left-4">
          <span className="font-medium text-xs sm:text-sm text-white drop-shadow-md select-none tracking-wide">
            {pName} {isSelf && "(You)"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#202124] text-white overflow-hidden select-none font-sans relative">
      {/* Top Bar (Exact Google Meet Header matching user's reference) */}
      <header className="h-12 shrink-0 flex items-center justify-between px-4 sm:px-6 bg-[#202124] z-20">
        {/* Left: Time | code ⓘ */}
        <div className="flex items-center gap-2.5 text-sm">
          <span className="font-bold text-white tracking-wide">{currentTime}</span>
          <span className="text-white/30">|</span>
          <span className="font-sans font-medium text-white/90">{code.toLowerCase()}</span>
          <button
            onClick={() => setPanel(panel === "info" ? null : "info")}
            className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors ml-0.5"
            title="Meeting details"
          >
            <Info size={16} />
          </button>
        </div>

        {/* Right: People counter with DiceBear Critters Avatar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPanel(panel === "people" ? null : "people")}
            className="h-8 px-2.5 rounded-full bg-[#3C4043]/80 hover:bg-[#3C4043] flex items-center gap-2 text-xs font-semibold text-white transition-colors border border-white/10"
            title="People in call"
          >
            <div className="h-5 w-5 rounded-full overflow-hidden flex items-center justify-center border border-white/10 bg-[#28292A] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.dicebear.com/10.x/critters/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span>{participants.length + 1}</span>
          </button>
        </div>
      </header>

      {/* Main Canvas & Side Drawer */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Stage Viewport */}
        <div className="flex-1 flex flex-col min-w-0 p-3 sm:p-4 relative">
          {shareError && (
            <div className="mb-3 px-4 py-2.5 rounded-xl bg-[#EA4335]/20 border border-[#EA4335]/50 text-white text-xs flex items-center justify-between shadow-lg">
              <span>{shareError}</span>
              <button onClick={() => setShareError("")} className="p-1 hover:text-white/80">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Screen Presentation or Participant Grid */}
          <div className="flex-1 min-h-0 relative">
            {screenTracks.length === 0 ? (
              /* When no screen is shared, show Google Meet participant tiles! */
              <div className="h-full flex flex-col justify-between">
                <div
                  className={`flex-1 grid gap-4 ${
                    participants.length === 0
                      ? "grid-cols-1 max-w-xl mx-auto w-full my-auto max-h-[420px]"
                      : participants.length === 1
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {/* Local participant */}
                  {renderParticipantTile(
                    name,
                    true,
                    micOn,
                    camOn,
                    cameraTracks.find((t) => t.participant.isLocal)
                  )}

                  {/* Remote participants */}
                  {participants.map((p) => {
                    const pName = p.name || p.identity;
                    const cTrack = cameraTracks.find((t) => t.participant.identity === p.identity);
                    return renderParticipantTile(
                      pName,
                      false,
                      p.isMicrophoneEnabled,
                      p.isCameraEnabled,
                      cTrack
                    );
                  })}
                </div>
              </div>
            ) : layout === "focus" ? (
              /* Focus mode: 1 main screen with secondary carousel */
              <div className="h-full flex gap-3">
                <div className="flex-1 min-w-0 h-full">
                  {focusedSid
                    ? screenTracks
                        .filter((t) => t.publication?.trackSid === focusedSid)
                        .map((t) => renderScreen(t))
                    : screenTracks.slice(0, 1).map((t) => renderScreen(t))}
                </div>
                {screenTracks.length > 1 && (
                  <div className="w-64 shrink-0 flex flex-col gap-3 overflow-y-auto pr-1">
                    <span className="text-xs font-medium text-[#9AA0A6] px-1">
                      Other screens ({screenTracks.length - 1})
                    </span>
                    {screenTracks
                      .filter((t) => t.publication?.trackSid !== (focusedSid || screenTracks[0]?.publication?.trackSid))
                      .map((t) => (
                        <div key={t.publication?.trackSid} className="h-36 shrink-0">
                          {renderScreen(t, true)}
                        </div>
                      ))}
                    <button
                      onClick={() => {
                        setFocusedSid(null);
                        setLayout("grid");
                      }}
                      className="text-xs text-[#8AB4F8] hover:underline text-left px-1 py-1"
                    >
                      ← Back to grid view
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Grid mode: Side-by-side or responsive grid */
              <div
                className={`h-full grid gap-4 ${
                  screenTracks.length === 1
                    ? "grid-cols-1"
                    : screenTracks.length === 2
                    ? "grid-cols-1 md:grid-cols-2"
                    : screenTracks.length <= 4
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {screenTracks.map((t) => renderScreen(t))}
              </div>
            )}
          </div>
        </div>

        {/* Right Drawer (Google Meet styled In-Call Chat & People) */}
        {panel && (
          <aside className="fixed inset-0 sm:static sm:w-96 bg-[#202124] border-l border-[#3C4043] flex flex-col z-50 sm:z-30 shadow-2xl">
            {/* Drawer Header */}
            <div className="h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between border-b border-[#3C4043]">
              <h3 className="text-lg font-medium text-white">
                {panel === "chat"
                  ? "In-call messages"
                  : panel === "people"
                  ? `People (${participants.length + 1})`
                  : "Meeting details"}
              </h3>
              <button
                onClick={() => setPanel(null)}
                className="p-2 text-[#9AA0A6] hover:text-white hover:bg-[#3C4043] rounded-full transition-colors"
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Drawer Content */}
            {panel === "chat" && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Google Meet informational banner */}
                <div className="p-4 mx-4 mt-4 rounded-xl bg-[#28292A] border border-[#3C4043] text-xs text-[#9AA0A6] leading-relaxed">
                  Messages can be seen only by people in the call and are deleted when the call ends.
                </div>

                {/* Messages stream */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {chat.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-[#9AA0A6] py-12">
                      <MessageSquare size={32} className="opacity-40 mb-2" />
                      <p className="font-medium text-white/80">No messages yet</p>
                      <p className="text-xs text-[#9AA0A6] mt-1">Send a message to everyone</p>
                    </div>
                  ) : (
                    chat.map((msg) => (
                      <div key={msg.id} className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-medium text-white">
                            {msg.sender} {msg.isSelf && "(You)"}
                          </span>
                          <span className="text-[11px] text-[#9AA0A6]">
                            {new Date(msg.ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className="text-sm text-[#E8EAED] leading-relaxed break-words">
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Google Meet styled Chat Input */}
                <form
                  onSubmit={sendChat}
                  className="p-4 border-t border-[#3C4043] flex items-center gap-2"
                >
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Send a message"
                    className="flex-1 h-11 px-4 rounded-full bg-[#3C4043] border-none text-sm text-white placeholder:text-[#9AA0A6] focus:outline-none focus:ring-2 focus:ring-[#8AB4F8]"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="h-11 w-11 rounded-full bg-transparent hover:bg-[#3C4043] text-[#8AB4F8] disabled:text-white/30 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Send"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            )}

            {/* People Drawer Content */}
            {panel === "people" && (
              <div className="flex-1 p-4 overflow-y-auto space-y-2">
                {/* Local user row */}
                <ParticipantRowGoogleMeet
                  name={`${name} (You)`}
                  isHost={isHost}
                  micOn={micOn}
                  camOn={camOn}
                  sharing={sharing}
                  isSelf={true}
                />

                {/* Remote participants */}
                {participants.map((p) => {
                  const pName = p.name || p.identity;
                  const isBlocked = roomInfo?.blockedSharers?.includes(p.identity);
                  return (
                    <ParticipantRowGoogleMeet
                      key={p.sid}
                      name={pName}
                      isHost={p.metadata === "host"}
                      micOn={p.isMicrophoneEnabled}
                      camOn={p.isCameraEnabled}
                      sharing={p.isScreenShareEnabled}
                      isSelf={false}
                      hostActions={
                        isHost
                          ? {
                              onRemove: () => removeParticipant(p.identity),
                              onToggleShare: () => toggleSharePermission(p.identity, !!isBlocked),
                              shareAllowed: !isBlocked,
                            }
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            )}

            {/* Meeting Details Drawer */}
            {panel === "info" && (
              <div className="flex-1 p-6 space-y-5">
                <div>
                  <h4 className="text-xs font-semibold text-[#9AA0A6] uppercase tracking-wider">
                    Joining info
                  </h4>
                  <p className="text-sm font-mono text-white mt-1 break-all">
                    {typeof window !== "undefined" ? `${window.location.origin}/join?code=${code}` : code}
                  </p>
                  <button
                    onClick={copyLink}
                    className="mt-3 px-4 py-2 rounded-full bg-[#8AB4F8] hover:bg-[#A8C7FA] text-[#202124] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? "Link copied" : "Copy joining info"}</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-[#3C4043] text-xs text-[#9AA0A6] space-y-2">
                  <p>Duet Meet multi-screen sharing protocol.</p>
                  <p>WebRTC SFU encrypted real-time connection.</p>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Google Meet Iconic Floating Bottom Control Bar */}
      <footer className="h-18 sm:h-20 shrink-0 bg-[#202124] px-4 sm:px-6 flex items-center justify-between z-30 relative">
        {/* Left Spacer to keep dock centered */}
        <div className="w-24 sm:w-32 hidden sm:block" />

        {/* Center: Sleek Google Meet Media Controls Dock */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#1E1F20]/90 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border border-white/10 shadow-2xl mx-auto">
          {/* Microphone */}
          <button
            onClick={toggleMic}
            className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer shadow-md active:scale-95 ${
              micOn
                ? "bg-[#3C4043] hover:bg-[#4A4E52] text-white"
                : "bg-[#EA4335] hover:bg-[#D93025] text-white"
            }`}
            title={micOn ? "Turn off microphone" : "Turn on microphone"}
            aria-label="Microphone"
          >
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Camera */}
          <button
            onClick={toggleCam}
            className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer shadow-md active:scale-95 ${
              camOn
                ? "bg-[#3C4043] hover:bg-[#4A4E52] text-white"
                : "bg-[#EA4335] hover:bg-[#D93025] text-white"
            }`}
            title={camOn ? "Turn off camera" : "Turn on camera"}
            aria-label="Camera"
          >
            {camOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* Screen Share / Present now */}
          <button
            onClick={toggleShare}
            className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer shadow-md active:scale-95 ${
              sharing
                ? "bg-[#8AB4F8] hover:bg-[#A8C7FA] text-[#202124]"
                : "bg-[#3C4043] hover:bg-[#4A4E52] text-white"
            }`}
            title={sharing ? "Stop presenting" : "Present now (Screen Share)"}
            aria-label="Share screen"
          >
            <Monitor size={20} />
          </button>

          {/* Leave Call (Google Meet Iconic Red Pill) */}
          <button
            onClick={handleLeaveClick}
            className="h-11 px-5 sm:h-12 sm:px-7 rounded-full bg-[#EA4335] hover:bg-[#D93025] text-white font-medium flex items-center justify-center transition-all duration-150 cursor-pointer shadow-md active:scale-95 ml-1"
            title="Leave call"
            aria-label="Leave call"
          >
            <PhoneOff size={20} />
          </button>
        </div>

        {/* Right: Clean Google Meet Utility Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Chat */}
          <button
            onClick={() => {
              setPanel(panel === "chat" ? null : "chat");
              setUnread(0);
            }}
            className={`h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center transition-colors relative ${
              panel === "chat" ? "bg-[#8AB4F8] text-[#202124]" : "text-white hover:bg-[#3C4043]"
            }`}
            title="Chat with everyone"
            aria-label="Chat"
          >
            <MessageSquare size={19} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-[#EA4335] text-white text-[11px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {/* Layout / Activities Switcher (Grid / Wall / Focus) */}
          <button
            onClick={() => {
              setLayout(layout === "grid" ? "wall" : layout === "wall" ? "focus" : "grid");
            }}
            className={`h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center transition-colors ${
              layout !== "grid" ? "bg-[#8AB4F8] text-[#202124]" : "text-white hover:bg-[#3C4043]"
            }`}
            title={`Current: ${layout} view (click to change layout)`}
            aria-label="Change layout"
          >
            {layout === "grid" && <LayoutGrid size={19} />}
            {layout === "focus" && <Maximize2 size={19} />}
            {layout === "wall" && <Columns3 size={19} />}
          </button>

          {/* Host Tools (If Host) */}
          {isHost && (
            <button
              onClick={() => setShowHostSettings(true)}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center text-[#8AB4F8] hover:bg-[#3C4043] transition-colors"
              title="Host controls"
              aria-label="Host controls"
            >
              <Shield size={19} />
            </button>
          )}
        </div>
      </footer>

      {/* Google Meet Authentic Leave Call Dialog for Host */}
      <Dialog
        open={showHostLeaveDialog}
        onClose={() => setShowHostLeaveDialog(false)}
        title="Leave call?"
        description="Choose whether to leave the call yourself or end it for everyone in the room."
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={endMeetingForEveryone}
            className="w-full py-3.5 px-6 rounded-full bg-[#EA4335] hover:bg-[#D93025] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <PhoneOff size={16} />
            <span>End the call for everyone</span>
          </button>

          <button
            onClick={leaveCallDirectly}
            className="w-full py-3.5 px-6 rounded-full bg-[#3C4043] hover:bg-[#4A4E52] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>Just leave the call</span>
          </button>

          <button
            onClick={() => setShowHostLeaveDialog(false)}
            className="w-full py-2.5 text-[#8AB4F8] hover:bg-[#8AB4F8]/10 rounded-full text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </Dialog>

      {/* Google Meet Authentic Host Settings Dialog */}
      <Dialog
        open={showHostSettings}
        onClose={() => setShowHostSettings(false)}
        title="Host controls"
        description="Meeting settings apply to everyone in this session."
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 text-sm">
          {/* Lock Meeting Switch */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#28292A] border border-[#3C4043]">
            <div className="pr-4">
              <div className="font-medium text-white">Meeting lock</div>
              <div className="text-xs text-[#9AA0A6] mt-0.5">
                When locked, no one can join this call even with the link.
              </div>
            </div>
            <button
              onClick={toggleLock}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                roomInfo?.locked
                  ? "bg-[#EA4335] text-white"
                  : "bg-[#3C4043] text-white hover:bg-[#4A4E52]"
              }`}
            >
              {roomInfo?.locked ? <Lock size={14} /> : <Unlock size={14} />}
              <span>{roomInfo?.locked ? "Locked" : "Unlocked"}</span>
            </button>
          </div>

          {/* Host-only screen share */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#28292A] border border-[#3C4043]">
            <div className="pr-4">
              <div className="font-medium text-white">Share their screen</div>
              <div className="text-xs text-[#9AA0A6] mt-0.5">
                Let participants present their screen simultaneously.
              </div>
            </div>
            <button
              onClick={toggleHostOnlyShare}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                roomInfo?.hostOnlyShare
                  ? "bg-[#3C4043] text-white hover:bg-[#4A4E52]"
                  : "bg-[#8AB4F8] text-[#202124]"
              }`}
            >
              <span>{roomInfo?.hostOnlyShare ? "Host only" : "Everyone"}</span>
            </button>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              onClick={() => setShowHostSettings(false)}
              className="px-6 py-2.5 rounded-full bg-[#8AB4F8] hover:bg-[#A8C7FA] text-[#202124] text-sm font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function ParticipantRowGoogleMeet({
  name,
  isHost,
  micOn,
  camOn,
  sharing,
  isSelf,
  hostActions,
}: {
  name: string;
  isHost: boolean;
  micOn: boolean;
  camOn: boolean;
  sharing: boolean;
  isSelf: boolean;
  hostActions?: {
    onRemove: () => void;
    onToggleShare: () => void;
    shareAllowed: boolean;
  };
}) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#3C4043]/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar name={name.replace(" (You)", "")} className="h-9 w-9 text-xs" />
        <div className="min-w-0">
          <div className="text-sm font-medium text-white truncate flex items-center gap-2">
            <span>{name}</span>
            {isHost && (
              <span className="px-2 py-0.5 rounded-full bg-[#8AB4F8]/15 text-[#8AB4F8] text-[10px] font-semibold">
                Host
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#9AA0A6]">
            {sharing && <span className="text-[#8AB4F8]">Sharing screen</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {micOn ? (
          <Mic size={16} className="text-[#8AB4F8]" />
        ) : (
          <MicOff size={16} className="text-[#EA4335]" />
        )}

        {hostActions && !isSelf && (
          <button
            onClick={hostActions.onRemove}
            className="p-1.5 text-[#9AA0A6] hover:text-[#EA4335] rounded-full hover:bg-white/10 transition-colors"
            title="Remove from meeting"
          >
            <UserX size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function VideoTrackWrapper({ trackRef }: { trackRef: any }) {
  if (!trackRef?.publication?.track) {
    return <div className="w-full h-full bg-[#131314]" />;
  }
  return <VideoTrack trackRef={trackRef} className="w-full h-full object-contain" />;
}
