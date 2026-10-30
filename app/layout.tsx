import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Duet — Every screen. One conversation.",
  description: "Real-time meetings with simultaneous screen sharing.",
  icons: {
    icon: "/duet-icon-512.svg",
    apple: "/duet-icon-512.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="font-sans">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
