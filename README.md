# Duet — Web Application

Real-time meetings with simultaneous screen sharing.

**Duet — Two screens. Zero switching. All flow.**
Built by Rahul Pandiyan.

## Overview

Duet lets multiple participants share their screens at the same time, so everyone in a meeting can view different workflows together without repeatedly switching between presenters. It includes a polished landing page, pre-meeting lobby, live audio/video, meeting chat, host controls, and Grid/Focus/Wall layouts.

## Prerequisites

- Node.js 22+
- A LiveKit server (SFU) for real-time media.

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env.local
   ```
   Defaults target a local LiveKit dev server (`ws://localhost:7880`).

3. Start LiveKit (separate terminal):
   ```bash
   npm run livekit
   ```
   This runs the bundled `livekit-server --dev` (API key `devkey`, secret `secret`).

4. Start the web app:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Using LiveKit Cloud

Set these in `.env.local`:
- `NEXT_PUBLIC_LIVEKIT_URL` (wss://...)
- `LIVEKIT_URL` (https://...)
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

## Features

- Landing page, create/join, pre-meeting lobby
- LiveKit-backed audio and video
- Independent screen-share tracks (multiple concurrent)
- Grid, Focus, and Wall layouts
- Real-time chat
- Participants panel and host controls
- Reconnection and permission handling
- Legal, help, security, and contact pages

## Limitations

- Room registry is in-memory (resets on server restart).
- No TURN server configured by default; add one for restrictive networks.
- Android client is deferred to Phase 2.
- Legal pages are drafts requiring review before public launch.

## Branding

Uses the existing Duet logo assets (`duet-icon-512.svg`, `duet-icon-512.png`) in `public/`.

## License

All rights reserved.
