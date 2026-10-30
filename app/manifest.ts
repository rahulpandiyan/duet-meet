import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Duet — Simultaneous Multi-Screen Sharing Meetings",
    short_name: "Duet",
    description:
      "Real-time meetings with simultaneous screen sharing. Two screens. Zero switching. All flow.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/duet-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/duet-icon-512.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
