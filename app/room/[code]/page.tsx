"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import { Logo } from "@/components/Logo";
import { Button, IconButton, Avatar, Badge } from "@/components/ui";
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, Users, MessageSquare,
  LayoutGrid, Maximize2, Columns3, PhoneOff, MoreHorizontal, Copy, Wifi, WifiOff,
  Settings, Lock, Unlock, UserX, Shield
} from "lucide-react";
import RoomInner from "@/components/RoomInner";

export default function RoomPage() {
  const params = useParams();
  const code = String(params.code).toUpperCase();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");
  const [name, setName] = useState("Guest");
  const [hostToken, setHostToken] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    const t = sessionStorage.getItem(`duet:token:${code}`);
    const u = sessionStorage.getItem(`duet:url:${code}`);
    const n = sessionStorage.getItem(`duet:name:${code}`);
    const h = sessionStorage.getItem(`duet:host:${code}`);
    if (!t) {
      router.replace("/join");
      return;
    }
    setToken(t);
    setUrl(u || "ws://localhost:7880");
    if (n) setName(n);
    if (h) {
      setIsHost(true);
      // hostToken may be stored as actual token (create) or "1" (join with hostToken? not). Handle:
      const ht = sessionStorage.getItem(`duet:hostToken:${code}`);
      if (ht) setHostToken(ht);
    }
    // If created, hostToken stored under duet:host:<code> as actual token string
    const maybeHostToken = sessionStorage.getItem(`duet:host:${code}`);
    if (maybeHostToken && maybeHostToken !== "1") setHostToken(maybeHostToken);
  }, [code, router]);

  if (!token) {
    return <div className="min-h-screen bg-app-bg flex items-center justify-center text-text-secondary">Loading meeting…</div>;
  }

  return (
    <LiveKitRoom
      video={false}
      audio={false}
      token={token}
      serverUrl={url}
      connect={true}
      options={{ adaptiveStream: true, dynacast: true }}
    >
      <RoomInner code={code} name={name} isHost={isHost} hostToken={hostToken} />
    </LiveKitRoom>
  );
}
