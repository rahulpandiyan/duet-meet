import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Outfit"',
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
          subtle: "rgba(37, 99, 235, 0.08)",
          glow: "#60A5FA",
        },
        success: {
          DEFAULT: "#10B981",
          subtle: "rgba(16, 185, 129, 0.1)",
        },
        warning: {
          DEFAULT: "#F59E0B",
          subtle: "rgba(245, 158, 11, 0.1)",
        },
        danger: {
          DEFAULT: "#EF4444",
          hover: "#DC2626",
          subtle: "rgba(239, 68, 68, 0.1)",
        },
        // Light theme surfaces
        "app-bg": "#F8FAFC",
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F1F5F9",
          hover: "#E2E8F0",
        },
        border: {
          DEFAULT: "#E2E8F0",
          subtle: "#F1F5F9",
          strong: "#CBD5E1",
        },
        "text-primary": "#0F172A",
        "text-secondary": "#475569",
        "text-tertiary": "#94A3B8",
        // Dark neutral meeting room surfaces (pure neutral dark, no blue)
        "meeting-bg": "#121214",
        "meeting-surface": "#1E1E20",
        "meeting-raised": "#26262A",
        "meeting-hover": "#2E2E32",
        "meeting-border": "rgba(255, 255, 255, 0.08)",
        "meeting-border-strong": "rgba(255, 255, 255, 0.16)",
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
        dropdown: "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.06)",
        modal: "0 20px 35px -10px rgba(0, 0, 0, 0.15), 0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        toolbar: "0 12px 36px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
