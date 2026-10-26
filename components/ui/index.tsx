"use client";
import React from "react";
import { cn } from "@/lib/cn";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "clay";
  size?: "sm" | "md" | "lg";
}) {
  const base = "inline-flex items-center justify-center gap-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    primary: "bg-primary text-white hover:bg-primary-hover rounded-xl shadow-clay",
    secondary: "bg-surface text-text-primary border border-gray-200 hover:bg-gray-50 rounded-xl",
    ghost: "text-text-secondary hover:bg-gray-100 rounded-xl",
    danger: "bg-danger text-white hover:opacity-90 rounded-xl",
    clay: "bg-surface text-primary clay-btn",
  };
  const sizes: Record<string, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function IconButton({
  className,
  active,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "h-11 w-11 rounded-2xl flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary/40",
        active
          ? "bg-primary text-white shadow-clay"
          : "bg-meeting-surface text-gray-200 hover:bg-[#2e3340] clay-btn",
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-surface rounded-2xl shadow-clay-soft border border-gray-100", className)} {...props} />
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-gray-200 bg-surface px-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
        className
      )}
      {...props}
    />
  );
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-violet-500"];
  const idx = name.charCodeAt(0) % colors.length;
  return (
    <div className={cn("h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-semibold", colors[idx], className)}>
      {initials || "?"}
    </div>
  );
}

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary", className)} {...props} />
  );
}

export function Dialog({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
