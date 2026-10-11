import type { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

export function Icon({ name, className, filled }: { name: string; className?: string; filled?: boolean }) {
  return (
    <span className={cn("material-symbols-outlined", filled && "filled", className)} aria-hidden>
      {name}
    </span>
  );
}

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "w-9 h-9 rounded-xl grid place-items-center font-bold text-title-md shadow-sm",
          light ? "bg-primary-fixed text-on-primary-fixed" : "bg-primary text-on-primary"
        )}
      >
        F
      </div>
      <span className={cn("text-headline-sm", light ? "text-on-primary" : "text-on-surface")}>FolioFit</span>
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-label-sm uppercase tracking-[0.18em] text-primary", className)}>{children}</p>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-label-sm px-2.5 py-1 rounded-full bg-surface-container-low text-secondary border border-outline-variant/60",
        className
      )}
    >
      {children}
    </span>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" };

export function Button({ variant = "primary", className, children, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-primary-container hover:bg-primary text-on-primary text-title-md px-7 py-3.5 shadow-md hover:shadow-[0_8px_24px_-6px_rgba(0,107,94,0.5)]",
        variant === "secondary" &&
          "bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md px-4 py-2",
        variant === "ghost" && "text-primary hover:bg-surface-container-low text-label-md px-4 py-2",
        className
      )}
    >
      {children}
    </button>
  );
}
