import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#F8FAFC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://duetxmeet.vercel.app"),
  title: {
    default: "Duet — Simultaneous Multi-Screen Sharing Meetings",
    template: "%s | Duet",
  },
  description:
    "Duet lets multiple presenters share their screens simultaneously in real time. Free, no account needed, sub-50ms latency WebRTC with Grid, Focus, and Wall modes.",
  applicationName: "Duet",
  authors: [{ name: "Rahul Pandiyan", url: "https://duetxmeet.vercel.app" }],
  creator: "Rahul Pandiyan",
  publisher: "Rahul Pandiyan",
  keywords: [
    "simultaneous screen sharing",
    "multi screen share",
    "dual screen share meeting",
    "screen share together",
    "free video conferencing",
    "webrtc video meeting",
    "developer pair programming screen share",
    "livekit screen share",
    "code and design review meeting",
    "duet meet",
    "no account video call",
    "android screen share meeting",
    "remote pair programming",
    "simultaneous presentations",
  ],
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Duet — Simultaneous Multi-Screen Sharing Meetings",
    description:
      "Stop switching screens. Show the whole picture. Duet lets multiple presenters share displays concurrently with sub-50ms latency.",
    url: "https://duetxmeet.vercel.app",
    siteName: "Duet",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Duet simultaneous multi-screen sharing workspace preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Duet — Simultaneous Multi-Screen Sharing Meetings",
    description:
      "Stop switching screens. Show the whole picture. Duet lets multiple presenters share displays concurrently with sub-50ms latency.",
    creator: "@rahulpandiyan",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/duet-icon-512.svg", type: "image/svg+xml" },
      { url: "/duet-icon-512.png", type: "image/png" },
    ],
    shortcut: "/duet-icon-512.svg",
    apple: "/duet-icon-512.png",
  },
  manifest: "/manifest.webmanifest",
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["SoftwareApplication", "WebApplication"],
      "@id": "https://duetxmeet.vercel.app/#software",
      name: "Duet",
      alternateName: "Duet Meet",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web, Android, iOS, Windows, macOS, Linux",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "Real-time video conferencing application enabling multiple participants to share their screens simultaneously with sub-50ms latency.",
      url: "https://duetxmeet.vercel.app",
      image: "https://duetxmeet.vercel.app/og-image.png",
      screenshot: "https://duetxmeet.vercel.app/hero-preview.webp",
      author: {
        "@type": "Person",
        name: "Rahul Pandiyan",
      },
      featureList: [
        "Simultaneous multi-screen sharing",
        "Sub-50ms WebRTC mesh & SFU latency",
        "No account or signup required",
        "Native Android mobile APK with background screen streaming",
        "Interactive Grid, Focus, and Wall viewing modes",
        "Real-time in-meeting chat and host moderation",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://duetxmeet.vercel.app/#website",
      url: "https://duetxmeet.vercel.app",
      name: "Duet",
      description: "Simultaneous Multi-Screen Sharing Video Meetings",
      publisher: {
        "@type": "Person",
        name: "Rahul Pandiyan",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://duetxmeet.vercel.app/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Can multiple participants share their screen at the exact same time?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. That is the core architecture of Duet. Each presenter publishes an independent WebRTC screen share track, allowing all attendees to view both or multiple screens concurrently in grid, focus, or wall layouts.",
          },
        },
        {
          "@type": "Question",
          name: "Does starting a new screen share stop or replace another active presenter?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Unlike traditional video conferencing tools that restrict sharing to a single active stream, Duet supports concurrent, independent screen tracks with distinct presenter labels and telemetry.",
          },
        },
        {
          "@type": "Question",
          name: "Do participants need to create an account or install native software?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Duet runs directly in modern web browsers (Chrome, Edge, Firefox, Safari) using standard WebRTC APIs. You can start or join a meeting instantly with just a link or meeting code.",
          },
        },
        {
          "@type": "Question",
          name: "What controls does the meeting host have?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Hosts can lock the room to prevent new entrants, restrict screen sharing permissions to the host only, mute participants, and remove attendees if needed.",
          },
        },
        {
          "@type": "Question",
          name: "Are meetings recorded or stored on Duet servers?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Real-time media is routed via encrypted WebRTC peer streams. Duet does not record or retain your video, audio, or shared screens by default.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="font-sans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
