"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Loader2, X } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "subtle" | "meet";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#202124] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variantStyles: Record<string, string> = {
      primary:
        "bg-blue-600 hover:bg-blue-700 text-white shadow-xs border border-transparent font-semibold",
      secondary:
        "bg-white dark:bg-[#3C4043] hover:bg-slate-50 dark:hover:bg-[#4A4E52] text-slate-800 dark:text-white border border-slate-200 dark:border-transparent shadow-xs",
      outline:
        "bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-white/20",
      ghost:
        "bg-transparent hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-transparent",
      danger:
        "bg-[#EA4335] hover:bg-[#D93025] text-white shadow-xs border border-transparent font-semibold",
      subtle:
        "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-transparent",
      meet:
        "bg-[#8AB4F8] hover:bg-[#A8C7FA] text-[#202124] font-semibold rounded-full",
    };

    const sizeStyles: Record<string, string> = {
      sm: "h-8 px-3 text-xs rounded-md gap-1.5",
      md: "h-10 px-4 text-sm rounded-lg gap-2",
      lg: "h-11 px-6 text-sm rounded-lg gap-2 font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variantStyles[variant] || variantStyles.primary, sizeStyles[size], className)}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : icon}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: "default" | "active" | "danger" | "ghost" | "meet-control";
  size?: "sm" | "md" | "lg" | "meet";
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, active, variant = "default", size = "md", children, ...props }, ref) => {
    const sizeMap = {
      sm: "h-8 w-8 text-xs rounded-full",
      md: "h-10 w-10 text-sm rounded-full",
      lg: "h-11 w-11 text-base rounded-full",
      meet: "h-12 w-12 text-base rounded-full",
    };

    const resolvedVariant = active ? "active" : variant;

    const variantMap: Record<string, string> = {
      default:
        "bg-[#3C4043] hover:bg-[#4A4E52] text-white border border-transparent shadow-xs",
      active:
        "bg-[#8AB4F8] hover:bg-[#A8C7FA] text-[#202124] border border-transparent shadow-sm",
      ghost:
        "bg-transparent text-slate-300 hover:text-white hover:bg-white/10 border border-transparent",
      danger:
        "bg-[#EA4335] hover:bg-[#D93025] text-white border border-transparent shadow-sm",
      "meet-control":
        "bg-[#3C4043] hover:bg-[#4A4E52] text-white border border-transparent",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#202124] active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          sizeMap[size],
          variantMap[resolvedVariant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#202124] border border-slate-200 dark:border-[#3C4043] rounded-2xl shadow-sm transition-all",
        className
      )}
      {...props}
    />
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-lg border border-slate-200 dark:border-[#3C4043] bg-white dark:bg-[#1E1F20] px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9AA0A6] transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export function Avatar({
  name,
  className,
  size = 36,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const seed = encodeURIComponent(name.trim() || "Guest");
  const crittersUrl = `https://api.dicebear.com/10.x/critters/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  const initials =
    name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden flex items-center justify-center shrink-0 select-none bg-[#28292A] border border-white/10",
        className
      )}
      title={name}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={crittersUrl}
        alt={name}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.currentTarget as HTMLElement).style.display = "none";
        }}
      />
      <span className="sr-only">{initials}</span>
    </div>
  );
}

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "danger" | "outline" | "neutral" | "meet";
}) {
  const variantStyles = {
    default: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    neutral: "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    outline: "bg-transparent text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#3C4043]",
    meet: "bg-[#8AB4F8]/15 text-[#8AB4F8] border-[#8AB4F8]/30 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function Dialog({
  open,
  onClose,
  children,
  title,
  description,
  maxWidth = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-[#202124] text-white border border-[#3C4043] rounded-3xl shadow-2xl w-full p-6 sm:p-7 relative animate-in zoom-in-95 duration-150",
          maxWidth
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-[#9AA0A6] hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>
        {title && <h3 className="text-xl font-medium text-white tracking-tight">{title}</h3>}
        {description && <p className="text-sm text-[#9AA0A6] mt-1.5 mb-5 leading-relaxed">{description}</p>}
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      {icon && <div className="mb-3 text-[#9AA0A6]">{icon}</div>}
      <h4 className="text-base font-medium text-white">{title}</h4>
      {description && <p className="text-sm text-[#9AA0A6] mt-1 max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
