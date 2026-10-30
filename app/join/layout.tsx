import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join a Meeting",
  description:
    "Join an active Duet meeting using a 9-letter code or invite link. View multiple screens simultaneously in your browser or Android app.",
  alternates: {
    canonical: "/join",
  },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
