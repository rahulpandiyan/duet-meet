import Image from "next/image";

export function Logo({ size = 32, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Image src="/duet-icon-512.svg" alt="Duet logo" width={size} height={size} priority />
      {showText && <span className="font-semibold text-text-primary tracking-tight">Duet</span>}
    </div>
  );
}
