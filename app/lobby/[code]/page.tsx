"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Copy,
  Check,
  ArrowLeft,
  Settings,
  ShieldCheck,
  Volume2,
  Sliders,
  ChevronDown,
} from "lucide-react";

export default function LobbyPage() {
  const params = useParams();
  const code = String(params.code).toUpperCase();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("Guest");
  const [isEditingName, setIsEditingName] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Available devices
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioId, setSelectedAudioId] = useState<string>("");
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");

  // Start media stream
  const startMedia = useCallback(
    async (audioId?: string, videoId?: string) => {
      // Stop old tracks first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }

      try {
        const constraints: MediaStreamConstraints = {
          audio: audioId ? { deviceId: { exact: audioId } } : true,
          video: videoId
            ? { deviceId: { exact: videoId }, width: { ideal: 1280 }, height: { ideal: 720 } }
            : { width: { ideal: 1280 }, height: { ideal: 720 } },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Apply toggle states
        stream.getAudioTracks().forEach((t) => (t.enabled = micOn));
        stream.getVideoTracks().forEach((t) => (t.enabled = camOn));
        setError("");

        // Populate device lists
        const allDevs = await navigator.mediaDevices.enumerateDevices();
        const audios = allDevs.filter((d) => d.kind === "audioinput");
        const videos = allDevs.filter((d) => d.kind === "videoinput");
        setAudioDevices(audios);
        setVideoDevices(videos);

        if (!selectedAudioId && audios[0]) setSelectedAudioId(audios[0].deviceId);
        if (!selectedVideoId && videos[0]) setSelectedVideoId(videos[0].deviceId);
      } catch (err: any) {
        console.warn("Media access warning:", err);
        setError("Camera or microphone is unavailable. You can still enter the meeting room.");
      }
    },
    [micOn, camOn, selectedAudioId, selectedVideoId]
  );

  useEffect(() => {
    const savedName = sessionStorage.getItem(`duet:name:${code}`);
    if (savedName) setName(savedName);

    startMedia();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [code, startMedia]);

  // Handle mic toggle
  const toggleMic = () => {
    const next = !micOn;
    setMicOn(next);
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = next));
  };

  // Handle cam toggle
  const toggleCam = () => {
    const next = !camOn;
    setCamOn(next);
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = next));
  };

  // Join meeting room
  function join() {
    sessionStorage.setItem(`duet:name:${code}`, name.trim() || "Guest");
    sessionStorage.setItem(`duet:pref:mic:${code}`, micOn ? "1" : "0");
    sessionStorage.setItem(`duet:pref:cam:${code}`, camOn ? "1" : "0");
    router.push(`/room/${code}`);
  }

  function copyInviteLink() {
    const link = `${window.location.origin}/join?code=${code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-[#202124] text-white flex flex-col justify-between p-4 sm:p-6 select-none font-sans">
      {/* Header Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#9AA0A6] hover:text-white transition-colors py-1.5 px-2.5 rounded-full hover:bg-white/5"
        >
          <ArrowLeft size={16} />
          <span>Leave lobby</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3C4043]/60 border border-white/10 text-xs font-mono tracking-wider text-white">
            <span>{code}</span>
            <button
              onClick={copyInviteLink}
              className="p-1 text-[#9AA0A6] hover:text-white transition-colors"
              title="Copy meeting link"
            >
              {copied ? <Check size={13} className="text-[#8AB4F8]" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Google Meet Green Room Area */}
      <div className="max-w-5xl mx-auto w-full my-auto py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Viewfinder Stage (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-center w-full">
            <div className="w-full relative aspect-video bg-[#131314] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#3C4043] shadow-2xl flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  camOn ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Camera Off Avatar Overlay */}
              {!camOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#9AA0A6] gap-3">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden flex items-center justify-center shadow-lg border border-white/10 select-none bg-[#28292A]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/10.x/critters/svg?seed=${encodeURIComponent(name.trim() || "Guest")}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-[#9AA0A6] font-medium tracking-wide">
                    Camera is off
                  </span>
                </div>
              )}

              {/* In-viewfinder Bottom Action Controls (Google Meet Standard) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
                {/* Microphone Button */}
                <button
                  onClick={toggleMic}
                  className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-150 shadow-lg active:scale-95 cursor-pointer ${
                    micOn
                      ? "bg-[#3C4043] hover:bg-[#4A4E52] text-white border border-white/10"
                      : "bg-[#EA4335] hover:bg-[#D93025] text-white"
                  }`}
                  aria-label={micOn ? "Turn microphone off" : "Turn microphone on"}
                  title={micOn ? "Turn microphone off" : "Turn microphone on"}
                >
                  {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>

                {/* Camera Button */}
                <button
                  onClick={toggleCam}
                  className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-150 shadow-lg active:scale-95 cursor-pointer ${
                    camOn
                      ? "bg-[#3C4043] hover:bg-[#4A4E52] text-white border border-white/10"
                      : "bg-[#EA4335] hover:bg-[#D93025] text-white"
                  }`}
                  aria-label={camOn ? "Turn camera off" : "Turn camera on"}
                  title={camOn ? "Turn camera off" : "Turn camera on"}
                >
                  {camOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>
              </div>
            </div>

            {/* Error banner if device permission blocked */}
            {error && (
              <div className="mt-3 w-full p-3 rounded-xl bg-[#EA4335]/20 border border-[#EA4335]/40 text-xs text-white/90 text-center">
                {error}
              </div>
            )}
          </div>

          {/* Right Action & Info Panel (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Ready to join?
              </h1>

              {/* Editable Name Display */}
              <div className="mt-2 text-sm text-[#9AA0A6] flex items-center justify-center lg:justify-start gap-1.5">
                <span>Joining as</span>
                {isEditingName ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                    autoFocus
                    className="bg-[#3C4043] text-white text-xs px-2 py-0.5 rounded border border-[#8AB4F8] outline-none font-medium max-w-[150px]"
                  />
                ) : (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="font-semibold text-white hover:text-[#8AB4F8] transition-colors underline decoration-dotted underline-offset-4"
                    title="Click to change your display name"
                  >
                    {name}
                  </button>
                )}
              </div>
            </div>

            {/* Enter Meeting Button */}
            <div className="space-y-3">
              <button
                onClick={join}
                className="w-full h-12 rounded-full bg-[#8AB4F8] hover:bg-[#A8C7FA] active:scale-[0.98] text-[#202124] text-sm font-semibold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter meeting room</span>
              </button>

              <button
                onClick={copyInviteLink}
                className="w-full h-10 rounded-full bg-[#3C4043]/60 hover:bg-[#3C4043] text-white/80 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-white/5"
              >
                {copied ? <Check size={14} className="text-[#8AB4F8]" /> : <Copy size={14} />}
                <span>{copied ? "Meeting link copied" : "Share invite link"}</span>
              </button>
            </div>

            {/* Professional Device Status Chips (NO confusing 3 camera 4 mic counts!) */}
            <div className="pt-2 border-t border-[#3C4043]/60 space-y-2.5 text-xs text-[#9AA0A6]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      micOn ? "bg-emerald-400" : "bg-[#EA4335]"
                    }`}
                  />
                  <span>{micOn ? "Microphone ready" : "Microphone muted"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      camOn ? "bg-emerald-400" : "bg-[#EA4335]"
                    }`}
                  />
                  <span>{camOn ? "Camera ready" : "Camera off"}</span>
                </div>
              </div>

              {/* Device Selector Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#131314] hover:bg-[#28292A] border border-[#3C4043]/60 transition-colors text-[11px] text-[#9AA0A6] hover:text-white"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders size={13} className="text-[#8AB4F8]" />
                  Audio & video settings
                </span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${showSettings ? "rotate-180" : ""}`}
                />
              </button>

              {/* Expandable Device Selectors */}
              {showSettings && (
                <div className="p-3 rounded-xl bg-[#131314] border border-[#3C4043] space-y-3 text-left animate-in fade-in duration-150">
                  {/* Microphone selection */}
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#9AA0A6] tracking-wider block mb-1">
                      Microphone
                    </label>
                    <select
                      value={selectedAudioId}
                      onChange={(e) => {
                        setSelectedAudioId(e.target.value);
                        startMedia(e.target.value, selectedVideoId);
                      }}
                      className="w-full bg-[#202124] text-white text-xs rounded-lg p-2 border border-[#3C4043] outline-none"
                    >
                      {audioDevices.map((d, i) => (
                        <option key={d.deviceId || i} value={d.deviceId}>
                          {d.label || `Microphone ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Camera selection */}
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#9AA0A6] tracking-wider block mb-1">
                      Camera
                    </label>
                    <select
                      value={selectedVideoId}
                      onChange={(e) => {
                        setSelectedVideoId(e.target.value);
                        startMedia(selectedAudioId, e.target.value);
                      }}
                      className="w-full bg-[#202124] text-white text-xs rounded-lg p-2 border border-[#3C4043] outline-none"
                    >
                      {videoDevices.map((d, i) => (
                        <option key={d.deviceId || i} value={d.deviceId}>
                          {d.label || `Camera ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[11px] text-[#9AA0A6] py-2 flex items-center justify-center gap-2">
        <ShieldCheck size={14} className="text-emerald-400" />
        <span>End-to-end encrypted • Duet Simultaneous Screen Engine</span>
      </footer>
    </main>
  );
}
