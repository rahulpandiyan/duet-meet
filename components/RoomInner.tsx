"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useRoomContext, useLocalParticipant, useParticipants, useTracks,
  useConnectionState, useDataChannel,
} from "@livekit/components-react";
import { Track, RoomEvent, ConnectionState, DataPacket_Kind } from "livekit-client";
import { Logo } from "@/components/Logo";
import { Button, IconButton, Avatar, Badge } from "@/components/ui";
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, Users, MessageSquare,
  LayoutGrid, Maximize2, Columns3, PhoneOff, Copy, Wifi, WifiOff, Lock, Unlock,
  UserX, Shield, X
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
}

export default function RoomInner({ code, name, isHost, hostToken }: Props) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();
  const connState = useConnectionState();
  const router = useRouter();

  const [layout, setLayout] = useState<"grid" | "focus" | "wall">("grid");
  const [focusedSid, setFocusedSid] = useState<string | null>(null);
  const [panel, setPanel] = useState<"participants" | "chat">("participants");
  const [panelOpen, setPanelOpen] = useState(true);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [unread, setUnread] = useState(0);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [shareError, setShareError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [wasConnected, setWasConnected] = useState(false);

  // screen share tracks
  const screenTracks = useTracks(
    [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
    { onlySubscribed: true }
  );

  // camera tracks for participant tiles
  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: false }],
    { onlySubscribed: true }
  );

  // fetch room info
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

  // data channel for chat
  useEffect(() => {
    const handler = (payload: Uint8Array, participant: any) => {
      try {
        const msg = JSON.parse(new TextDecoder().decode(payload));
        if (msg.type === "chat") {
          setChat((prev) => [...prev, { id: msg.id, sender: msg.sender, text: msg.text, ts: msg.ts }]);
          if (panel !== "chat") setUnread((u) => u + 1);
        }
      } catch {}
    };
    room.on(RoomEvent.DataReceived, handler);
    return () => {
      room.off(RoomEvent.DataReceived, handler);
    };
  }, [room, panel]);

  // sync local mic/cam/sharing state
  useEffect(() => {
    setMicOn(localParticipant.isMicrophoneEnabled);
    setCamOn(localParticipant.isCameraEnabled);
    setSharing(localParticipant.isScreenShareEnabled);
  }, [localParticipant.isMicrophoneEnabled, localParticipant.isCameraEnabled, localParticipant.isScreenShareEnabled]);

  const toggleMic = useCallback(async () => {
    try { await localParticipant.setMicrophoneEnabled(!micOn); }
    catch (e: any) { console.error(e); }
  }, [localParticipant, micOn]);

  const toggleCam = useCallback(async () => {
    try { await localParticipant.setCameraEnabled(!camOn); }
    catch (e: any) { console.error(e); }
  }, [localParticipant, camOn]);

  const toggleShare = useCallback(async () => {
    setShareError("");
    if (sharing) {
      try { await localParticipant.setScreenShareEnabled(false); } catch (e: any) { setShareError(e.message); }
      return;
    }
    // checks
    if (roomInfo?.hostOnlyShare && !isHost) {
      setShareError("Only the host can share in this meeting.");
      return;
    }
    if (roomInfo?.blockedSharers?.includes(localParticipant.identity)) {
      setShareError("You are not allowed to share.");
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

  const sendChat = useCallback(async () => {
    if (!chatInput.trim()) return;
    const msg = {
      type: "chat",
      id: Math.random().toString(36).slice(2),
      sender: name,
      text: chatInput.trim(),
      ts: Date.now(),
    };
    try {
      await localParticipant.publishData(new TextEncoder().encode(JSON.stringify(msg)), { reliable: true });
      setChat((prev) => [...prev, { id: msg.id, sender: msg.sender, text: msg.text, ts: msg.ts }]);
    } catch (e) {
      console.error(e);
    }
    setChatInput("");
  }, [chatInput, localParticipant, name]);

  const leave = useCallback(async () => {
    try { await room.disconnect(); } catch {}
    router.push("/ended");
  }, [room, router]);

  const endMeeting = useCallback(async () => {
    if (!hostToken) return;
    try {
      await fetch("/api/host/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, hostToken }),
      });
    } catch {}
    try { await room.disconnect(); } catch {}
    router.push("/ended");
  }, [code, hostToken, room, router]);

  const removeParticipant = useCallback(async (identity: string) => {
    if (!hostToken) return;
    await fetch("/api/host/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, hostToken, identity }),
    });
  }, [code, hostToken]);

  const toggleSharePermission = useCallback(async (identity: string, allow: boolean) => {
    if (!hostToken) return;
    await fetch("/api/host/permissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, hostToken, identity, canShare: allow }),
    });
  }, [code, hostToken]);

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
  }, [code]);

  // focus selected track when clicking
  const focusTrack = (sid: string | null) => {
    setFocusedSid(sid);
    if (sid) setLayout("focus");
  };

  useEffect(() => { if (connState === ConnectionState.Connected) setWasConnected(true); }, [connState]);
  useEffect(() => { if (wasConnected && connState === ConnectionState.Disconnected) router.push("/ended"); }, [wasConnected, connState, router]);
  const connLabel = connState === ConnectionState.Connected ? "Connected" : connState === ConnectionState.Connecting ? "Connecting…" : connState === ConnectionState.Reconnecting ? "Reconnecting…" : "Disconnected";

  // render screen tile
  const renderScreen = (tr: any, compact = false) => {
    const p = tr.participant;
    const label = p?.name || p?.identity || "Participant";
    const sid = tr.publication?.trackSid ;
    return (
      <div
        key={sid}
        className="relative bg-black rounded-2xl overflow-hidden border border-white/5 group"
        onClick={() => focusTrack(sid)}
      >
        <VideoTrackWrapper trackRef={tr} />
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded-lg text-xs text-white flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          {label}
        </div>
        {layout === "focus" && focusedSid === sid && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-lg">Focused</div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-meeting-bg text-gray-100 overflow-hidden">
      {/* Top bar */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-meeting-surface/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <Logo size={24} showText={false} />
          <span className="font-semibold text-sm">Duet</span>
          <Badge className="bg-white/10 text-gray-200">{code}</Badge>
          <span className="text-xs text-gray-400 hidden md:inline">{participants.length + 1} participants</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            {connState === ConnectionState.Connected ? <Wifi size={14} className="text-success" /> : <WifiOff size={14} className="text-danger" />}
            {connLabel}
          </div>
          <Button variant="ghost" size="sm" onClick={copyLink}>
            <Copy size={14} /> Copy link
          </Button>
          {isHost && (
            <>
              <IconButton active={false} onClick={toggleLock} aria-label="Lock meeting">
                {roomInfo?.locked ? <Lock size={16} /> : <Unlock size={16} />}
              </IconButton>
            </>
          )}
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Canvas */}
        <div className="flex-1 flex flex-col min-w-0 p-3 gap-3">
          {/* Layout switcher */}
          <div className="flex items-center gap-2">
            <div className="flex bg-meeting-surface rounded-xl p-1 gap-1">
              <button onClick={() => setLayout("grid")} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${layout === "grid" ? "bg-primary text-white" : "text-gray-300 hover:bg-white/5"}`}>
                <LayoutGrid size={14} /> Grid
              </button>
              <button onClick={() => setLayout("focus")} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${layout === "focus" ? "bg-primary text-white" : "text-gray-300 hover:bg-white/5"}`}>
                <Maximize2 size={14} /> Focus
              </button>
              <button onClick={() => setLayout("wall")} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 ${layout === "wall" ? "bg-primary text-white" : "text-gray-300 hover:bg-white/5"}`}>
                <Columns3 size={14} /> Wall
              </button>
            </div>
            <span className="text-xs text-gray-400">{screenTracks.length} screen{screenTracks.length !== 1 ? "s" : ""} sharing</span>
            {shareError && <span className="text-xs text-danger">{shareError}</span>}
          </div>

          {/* Screens area */}
          <div className="flex-1 min-h-0">
            {screenTracks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <Monitor size={40} className="opacity-40" />
                <p className="text-sm">No screens are being shared yet.</p>
                <p className="text-xs">Click "Share screen" to start presenting.</p>
              </div>
            ) : layout === "focus" ? (
              <div className="h-full flex gap-3">
                <div className="flex-1 min-w-0">
                  {focusedSid
                    ? screenTracks.filter((t) => (t.publication?.trackSid ) === focusedSid).map((t) => renderScreen(t))
                    : screenTracks.slice(0, 1).map((t) => renderScreen(t))}
                </div>
                <div className="w-48 flex flex-col gap-2 overflow-y-auto">
                  {screenTracks
                    .filter((t) => (t.publication?.trackSid ) !== focusedSid)
                    .map((t) => (
                      <div key={t.publication?.trackSid } className="aspect-video">
                        {renderScreen(t, true)}
                      </div>
                    ))}
                  <button
                    onClick={() => { setFocusedSid(null); setLayout("grid"); }}
                    className="text-xs text-gray-300 hover:text-white mt-2"
                  >
                    Back to grid
                  </button>
                </div>
              </div>
            ) : (
              <div className={`h-full grid gap-3 ${screenTracks.length === 1 ? "grid-cols-1" : screenTracks.length === 2 ? "grid-cols-1 sm:grid-cols-2" : screenTracks.length <= 4 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                {screenTracks.map((t) => renderScreen(t))}
              </div>
            )}
          </div>

          {/* Participant camera strip */}
          {cameraTracks.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {cameraTracks.map((tr) => {
                const p = tr.participant;
                const sid = tr.publication?.trackSid ;
                return (
                  <div key={sid} className="h-20 w-28 shrink-0 bg-black rounded-xl overflow-hidden relative border border-white/5">
                    <VideoTrackWrapper trackRef={tr} />
                    <div className="absolute bottom-1 left-1 text-[10px] text-white bg-black/60 px-1.5 rounded">{p?.name || p?.identity}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Side panel */}
        {panelOpen && (
          <aside className="absolute inset-y-0 right-0 w-80 max-w-[85vw] bg-meeting-surface border-l border-white/5 flex flex-col z-30 md:static md:w-80 md:max-w-none">
            <div className="flex border-b border-white/5">
              <button
                onClick={() => { setPanel("participants"); }}
                className={`flex-1 py-3 text-sm flex items-center justify-center gap-2 ${panel === "participants" ? "text-primary border-b-2 border-primary" : "text-gray-400"}`}
              >
                <Users size={14} /> Participants
              </button>
              <button
                onClick={() => { setPanel("chat"); setUnread(0); }}
                className={`flex-1 py-3 text-sm flex items-center justify-center gap-2 ${panel === "chat" ? "text-primary border-b-2 border-primary" : "text-gray-400"}`}
              >
                <MessageSquare size={14} /> Chat
                {unread > 0 && <Badge className="bg-danger text-white">{unread}</Badge>}
              </button>
              <button onClick={() => setPanelOpen(false)} className="px-3 text-gray-400 hover:text-white">
                <X size={14} />
              </button>
            </div>

            {panel === "participants" ? (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {/* local */}
                <ParticipantRow
                  name={name + " (you)"}
                  role={isHost ? "host" : "participant"}
                  micOn={micOn}
                  camOn={camOn}
                  sharing={sharing}
                  isSelf
                />
                {participants.map((p) => {
                  const meta = safeMeta(p.metadata);
                  const pSharing = p.isScreenShareEnabled;
                  const blocked = roomInfo?.blockedSharers?.includes(p.identity);
                  return (
                    <ParticipantRow
                      key={p.identity}
                      name={p.name || p.identity}
                      role={meta.role}
                      micOn={p.isMicrophoneEnabled}
                      camOn={p.isCameraEnabled}
                      sharing={pSharing}
                      isSelf={false}
                      hostActions={isHost ? {
                        onRemove: () => removeParticipant(p.identity),
                        onToggleShare: () => toggleSharePermission(p.identity, !!blocked),
                        shareAllowed: !blocked,
                        onMakeHostOnly: undefined,
                      } : undefined}
                    />
                  );
                })}

                {isHost && (
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase">Host controls</p>
                    <Button variant="secondary" size="sm" className="w-full justify-start" onClick={toggleHostOnlyShare}>
                      <Shield size={14} /> {roomInfo?.hostOnlyShare ? "Allow all to share" : "Host-only sharing"}
                    </Button>
                    <Button variant="danger" size="sm" className="w-full justify-start" onClick={endMeeting}>
                      <PhoneOff size={14} /> End meeting for all
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {chat.length === 0 && <p className="text-xs text-gray-500 text-center mt-8">No messages yet.</p>}
                  {chat.map((m) => (
                    <div key={m.id} className="text-sm">
                      <div className="flex items-center gap-2">
                        <Avatar name={m.sender} className="h-6 w-6 text-[10px]" />
                        <span className="font-medium text-gray-200">{m.sender}</span>
                        <span className="text-[10px] text-gray-500">{new Date(m.ts).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-gray-300 ml-8 mt-0.5 break-words">{m.text}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/5 flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") sendChat(); }}
                    placeholder="Message everyone"
                    className="flex-1 h-10 rounded-xl bg-[#1a1d24] border border-white/10 px-3 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <Button size="sm" onClick={sendChat}>Send</Button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Bottom control bar */}
      <footer className="h-20 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 border-t border-white/5 bg-meeting-surface/80 backdrop-blur flex-wrap">
        {!panelOpen && (
          <IconButton onClick={() => setPanelOpen(true)} aria-label="Open panel">
            <Users size={20} />
          </IconButton>
        )}
        <IconButton active={micOn} onClick={toggleMic} aria-label="Toggle microphone">
          {micOn ? <Mic size={20} /> : <MicOff size={20} />}
        </IconButton>
        <IconButton active={camOn} onClick={toggleCam} aria-label="Toggle camera">
          {camOn ? <Video size={20} /> : <VideoOff size={20} />}
        </IconButton>
        <IconButton active={sharing} onClick={toggleShare} aria-label="Share screen" className={sharing ? "bg-success text-white shadow-clay" : ""}>
          {sharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
        </IconButton>
        <span className="text-xs text-gray-400 hidden sm:inline mx-1">Share</span>
        <IconButton onClick={() => { setPanel("participants"); setPanelOpen(true); }} aria-label="Participants">
          <Users size={20} />
        </IconButton>
        <IconButton onClick={() => { setPanel("chat"); setPanelOpen(true); setUnread(0); }} aria-label="Chat">
          <MessageSquare size={20} />
          {unread > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-danger text-[10px] flex items-center justify-center">{unread}</span>}
        </IconButton>
        <div className="mx-2 h-8 w-px bg-white/10" />
        <Button variant="danger" size="sm" onClick={leave}>
          <PhoneOff size={16} /> Leave
        </Button>
      </footer>
    </div>
  );
}

function safeMeta(m: string | undefined) {
  try { return m ? JSON.parse(m) : {}; } catch { return {}; }
}

function ParticipantRow({
  name, role, micOn, camOn, sharing, isSelf, hostActions,
}: {
  name: string; role: string; micOn: boolean; camOn: boolean; sharing: boolean; isSelf: boolean;
  hostActions?: { onRemove: () => void; onToggleShare: () => void; shareAllowed: boolean; onMakeHostOnly?: () => void };
}) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5">
      <Avatar name={name.replace(" (you)", "")} />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-100 truncate flex items-center gap-1.5">
          {name}
          {role === "host" && <Badge className="bg-primary/20 text-accent text-[10px]">Host</Badge>}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-gray-400">
          {micOn ? <Mic size={12} /> : <MicOff size={12} className="text-danger" />}
          {camOn ? <Video size={12} /> : <VideoOff size={12} />}
          {sharing && <Monitor size={12} className="text-success" />}
        </div>
      </div>
      {hostActions && !isSelf && (
        <div className="flex items-center gap-1">
          <button
            onClick={hostActions.onToggleShare}
            className="text-gray-400 hover:text-white p-1"
            title={hostActions.shareAllowed ? "Block sharing" : "Allow sharing"}
          >
            {hostActions.shareAllowed ? <Shield size={14} /> : <Shield size={14} className="text-danger" />}
          </button>
          <button onClick={hostActions.onRemove} className="text-gray-400 hover:text-danger p-1" title="Remove">
            <UserX size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// VideoTrack wrapper to render a track reference
import { VideoTrack } from "@livekit/components-react";
function VideoTrackWrapper({ trackRef }: { trackRef: any }) {
  if (!trackRef?.publication?.track) return <div className="w-full h-full bg-meeting-bg" />;
  return <VideoTrack trackRef={trackRef} className="w-full h-full object-cover" />;
}
