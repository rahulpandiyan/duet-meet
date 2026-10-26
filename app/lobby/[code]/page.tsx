"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button, Card, IconButton } from "@/components/ui";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

export default function LobbyPage() {
  const params = useParams();
  const code = String(params.code);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [error, setError] = useState("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!mounted) return;
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        const devs = await navigator.mediaDevices.enumerateDevices();
        setDevices(devs);
      } catch (e: any) {
        setError("Camera/microphone permission denied or unavailable. You can still join with limited functionality.");
      }
    })();
    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }, [micOn]);
  useEffect(() => {
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = camOn));
  }, [camOn]);

  function join() {
    router.push(`/room/${code}`);
  }

  return (
    <main className="min-h-screen bg-app-bg flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl p-6">
        <div className="flex items-center justify-between">
          <Logo />
          <span className="text-sm text-text-secondary">Lobby · {code}</span>
        </div>
        <h1 className="text-xl font-bold text-text-primary mt-4">Check your setup</h1>
        <div className="mt-4 aspect-video bg-meeting-bg rounded-2xl overflow-hidden flex items-center justify-center">
          <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          {!camOn && <div className="absolute text-gray-400">Camera off</div>}
        </div>
        {error && <p className="text-sm text-amber-600 mt-3">{error}</p>}
        <div className="mt-4 flex items-center justify-center gap-3">
          <IconButton active={micOn} onClick={() => setMicOn(!micOn)} aria-label="Toggle mic">
            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
          </IconButton>
          <IconButton active={camOn} onClick={() => setCamOn(!camOn)} aria-label="Toggle camera">
            {camOn ? <Video size={20} /> : <VideoOff size={20} />}
          </IconButton>
        </div>
        <div className="mt-6 flex gap-3">
          <Button className="flex-1" onClick={join}>Join meeting</Button>
        </div>
        <p className="text-xs text-text-secondary mt-3">
          Devices detected: {devices.filter((d) => d.kind === "videoinput").length} camera(s), {devices.filter((d) => d.kind === "audioinput").length} mic(s).
        </p>
      </Card>
    </main>
  );
}
