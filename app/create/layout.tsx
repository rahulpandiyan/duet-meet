import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Meeting",
  description:
    "Instantly host a free, real-time video meeting with simultaneous multi-screen sharing. No account or download required.",
  alternates: {
    canonical: "/create",
  },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
