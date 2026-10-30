# Duet Design System Specification

## 1. Vision & Design Philosophy

Duet is a high-performance, real-time collaboration product engineered for multi-workflow demonstrations and simultaneous screen sharing. The design language takes inspiration from world-class developer and productivity tools:

- **Resend**: Minimalist restraint, typographic precision, high-contrast accents, purposeful negative space.
- **Linear**: Uncompromising hierarchy, dense yet readable layouts, purposeful keyboard shortcuts, subtle borders (`#E4E7EC` light / `#1E2433` dark).
- **Raycast**: Compact controls, instant visual feedback, refined segmented controls.
- **Stripe**: Trustworthy, clear product visual communication, flawless form inputs and validation states.
- **Apple Human Interface**: Harmonious proportions, readable typographic hierarchy, refined micro-interactions.

### Strict Anti-Patterns (Eliminated):
- No arbitrary gradients or decorative background blobs.
- No neumorphism, soft extruded shadows, or heavy claymorphism.
- No oversized bubble cards or arbitrary 28px pill containers.
- No emoji used as interface icons; only crisp, geometric Lucide (Web) & Material (Flutter) iconography.
- No visual noise without utility. Every pixel, margin, and border has an operational purpose.

---

## 2. Color Palette & Semantic Tokens

### Light Theme (Product Landing & Settings)
- **Background Root**: `#F8FAFC` (Slate-50)
- **Surface / Card**: `#FFFFFF`
- **Surface Muted**: `#F1F5F9` (Slate-100)
- **Surface Hover**: `#E2E8F0` (Slate-200)
- **Border Default**: `#E2E8F0`
- **Border Subtly Emphasized**: `#CBD5E1`
- **Text Primary**: `#0F172A` (Slate-900)
- **Text Secondary**: `#475569` (Slate-600)
- **Text Muted / Tertiary**: `#94A3B8` (Slate-400)

### Dark Theme (Meeting Canvas & Immersive Stage)
- **Meeting Canvas Root**: `#0A0D14` (Deep obsidian)
- **Surface Primary**: `#121620` (Card / sidebar container)
- **Surface Raised / Control Bar**: `#1A202E`
- **Surface Hover**: `#242C3E`
- **Border Default**: `rgba(255, 255, 255, 0.08)`
- **Border Strong**: `rgba(255, 255, 255, 0.16)`
- **Text Primary**: `#F8FAFC`
- **Text Secondary**: `#94A3B8`
- **Text Muted**: `#64748B`

### Brand & Semantic Accents
- **Primary Brand**: `#2563EB` (Blue-600) / Hover: `#1D4ED8` (Blue-700)
- **Primary Subtle**: `rgba(37, 99, 235, 0.1)`
- **Success / Active Sharing**: `#10B981` (Emerald-500)
- **Warning / Host Alerts**: `#F59E0B` (Amber-500)
- **Danger / Leave Call**: `#EF4444` (Red-500) / Hover: `#DC2626` (Red-600)

---

## 3. Typography Hierarchy

Font Family: `Inter`, `Geist`, `-apple-system`, `BlinkMacSystemFont`, `system-ui`, sans-serif.

| Level | Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | 44px – 56px | 700 Bold | 1.1 | -0.03em | Landing Hero Headline |
| **H1** | 28px – 32px | 600 SemiBold | 1.2 | -0.025em | Page Headers, Stage Titles |
| **H2** | 20px – 24px | 600 SemiBold | 1.25 | -0.02em | Section Headings, Modals |
| **H3** | 16px – 18px | 600 SemiBold | 1.3 | -0.015em | Panel Headers, Card Titles |
| **Body Large** | 16px | 400 Regular | 1.5 | -0.01em | Lead copy, intro paragraphs |
| **Body Medium** | 14px | 400 / 500 Medium | 1.5 | 0 | Standard UI text, list items |
| **Caption / Label** | 12px | 500 Medium | 1.4 | +0.01em | Form labels, tags, presenter chips |
| **Micro / Status** | 11px | 600 SemiBold | 1.3 | +0.02em | Indicators, keyboard badges |

---

## 4. Spacing, Radii & Depth System

### Spacing Scale
- `2xs`: 4px | `xs`: 8px | `sm`: 12px | `md`: 16px | `lg`: 24px | `xl`: 32px | `2xl`: 48px | `3xl`: 64px

### Corner Radii
- **Tags & Control Pills**: 6px (`rounded-md`) to 8px (`rounded-lg`)
- **Buttons & Form Inputs**: 8px (`rounded-lg`)
- **Cards & Modals**: 12px (`rounded-xl`)
- **Video Track Feeds**: 10px (`rounded-lg`)
- **Floating Controls Container**: 12px (`rounded-xl`)

### Elevation & Shadows
- **Card**: `0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)`
- **Modal / Dropdown**: `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)`
- **Control Bar (Dark)**: `0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`

---

## 5. Screen Layout Architecture

### 1. Landing Page (`/`)
- Unified navigation header with logo, anchor links, and primary CTA.
- High-contrast Hero featuring problem-solution statement with side-by-side video stream preview.
- Quick join bar with keyboard shortcut prompt (`Cmd/Ctrl + K` or clean input with auto-paste).
- "Why Duet" feature split sections comparing traditional single-share screen confusion vs. multi-screen flow.
- Interactive FAQ with smooth accordion states and semantic icons.

### 2. Creation & Join Flows (`/create`, `/join`, `/ended`)
- Clean, centered card architecture on subtle slate background.
- Intuitive focus rings, clear error feedback banners, and responsive button loading spinners.

### 3. Lobby Setup (`/lobby/[code]`)
- Hardware preview viewport with live video and audio level indicators.
- Quick device check for camera & microphone.
- Easy copyable invite link before joining.

### 4. Meeting Room Canvas (`/room/[code]`)
- **Header**: Left-aligned meeting code with 1-click copy badge, Live connection status indicator, participant count pill.
- **Central Stage**:
  - Automatically balances aspect ratio for 1, 2, 3, or more simultaneous screens.
  - Multi-screen side-by-side mode provides equal visual weight to both presenters.
  - Focus mode displays primary screen large while keeping secondary screens in an accessible, scrollable sidebar tray.
  - Presenter label chips anchored gracefully with active sharing pulses.
- **Docked Bottom Toolbar**:
  - Segmented groups: Media toggles (Mic, Cam, Share) | Views & Panels (Layout switcher, Chat, Participants) | Destructive action (End/Leave).
- **Collapsible Right Drawer**:
  - Tabs for Participants and Real-Time Chat with auto-scroll and unread counter badges.
