# Duet (Web)

Real-time meetings with simultaneous screen sharing.

## Prerequisites

- Node.js 22+
- LiveKit server (SFU) for real-time media. For local development use the bundled dev mode.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment (copy and edit if needed):
   ```bash
   cp .env.example .env.local
   ```
   Defaults target a local LiveKit dev server (`ws://localhost:7880`).

3. Start LiveKit (in a separate terminal):
   ```bash
   npm run livekit
   ```
   This runs `livekit-server --dev` with API key `devkey` / secret `secret`.

4. Start the web app:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Production / external LiveKit

Set in `.env.local` (or your host's env):
- `NEXT_PUBLIC_LIVEKIT_URL` (ws:// or wss://)
- `LIVEKIT_URL` (http:// or https://)
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

## Features

- Landing, create/join, pre-meeting lobby
- LiveKit-backed audio/video
- Independent screen-share tracks (multiple concurrent)
- Grid/Focus/Wall layouts
- Chat, participants, host controls
- Reconnection and permission handling

## Limitations

- Room registry is in-memory (resets on server restart).
- No TURN server configured by default; add one for restrictive networks.
- Android client is deferred to Phase 2.

## Branding

Uses the existing Duet logo assets (`duet-icon-512.svg`, `duet-icon-512.png`) in `public/`.
