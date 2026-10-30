import Image from "next/image";

export function Logo({
  size = 32,
  showText = true,
  className = "",
  textColor = "",
}: {
  size?: number;
  showText?: boolean;
  className?: string;
  textColor?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image src="/duet-icon-512.svg" alt="Duet logo" width={size} height={size} priority />
      {showText && (
        <span className={`font-semibold tracking-tight ${textColor || "text-text-primary"}`}>
          Duet
        </span>
      )}
    </div>
  );
}
