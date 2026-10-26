import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#1A73E8",
        "primary-hover": "#1765CC",
        accent: "#8AB4F8",
        success: "#188038",
        danger: "#D93025",
        "app-bg": "#F6F8FC",
        surface: "#FFFFFF",
        "text-primary": "#202124",
        "text-secondary": "#5F6368",
        "meeting-bg": "#17191F",
        "meeting-surface": "#242832",
      },
      borderRadius: {
        clay: "18px",
      },
      boxShadow: {
        clay: "0 8px 24px rgba(26,115,232,0.18), inset 0 2px 4px rgba(255,255,255,0.35)",
        "clay-soft": "0 4px 16px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.4)",
        "clay-dark": "0 6px 20px rgba(0,0,0,0.45), inset 0 1px 2px rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
