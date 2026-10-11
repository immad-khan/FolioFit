"use client";

import type { ReactNode } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

/* ── Panel ── */
export function Panel({
  title, subtitle, iconName, action, children,
}: {
  title: string; subtitle?: string; iconName?: string; action?: ReactNode; children: ReactNode;
}) {
  return (
    <section
      className="overflow-hidden rounded-2xl card-shadow"
      style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)" }}
    >
      <header
        className="flex items-center justify-between gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid var(--outline-variant)" }}
      >
        <div className="flex items-center gap-3">
          {iconName && (
            <span
              className="grid h-9 w-9 place-items-center rounded-xl"
              style={{ background: "var(--surface-container-low)", color: "var(--primary)" }}
            >
              <MaterialIcon name={iconName} size={18} />
            </span>
          )}
          <div>
            <h2 className="text-sm font-bold" style={{ color: "var(--on-surface)" }}>{title}</h2>
            {subtitle && <p className="text-[11px]" style={{ color: "var(--on-surface-variant)" }}>{subtitle}</p>}
          </div>
        </div>
        {action}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

/* ── Chip ── */
export function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-4 py-2 text-xs font-bold transition-all duration-150"
      style={active ? {
        background: "var(--primary-container)",
        color: "var(--on-primary)",
        boxShadow: "0 4px 12px rgba(0,166,147,.25)",
      } : {
        background: "var(--surface-container-lowest)",
        color: "var(--on-surface-variant)",
        border: "1px solid var(--outline-variant)",
      }}
    >
      {children}
    </button>
  );
}

/* ── Badge ── */
export function Badge({
  children, tone = "teal",
}: {
  children: ReactNode;
  tone?: "teal" | "amber" | "gray" | "blue" | "red";
}) {
  const styles: Record<string, { bg: string; color: string }> = {
    teal:  { bg: "var(--surface-container-low)",  color: "var(--primary)" },
    amber: { bg: "#fbf3e6",                        color: "#9a7140" },
    gray:  { bg: "var(--surface-container)",       color: "var(--on-surface-variant)" },
    blue:  { bg: "var(--secondary-container)",     color: "var(--secondary)" },
    red:   { bg: "var(--error-container)",         color: "var(--error)" },
  };
  const s = styles[tone] ?? styles.gray;
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.08em]"
      style={{ background: s.bg, color: s.color }}
    >
      {children}
    </span>
  );
}

/* ── Progress bar ── */
export function Progress({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--surface-container)" }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.max(2, Math.min(100, value))}%`, background: "var(--primary-container)" }}
      />
    </div>
  );
}

/* ── Score Ring ── */
export function ScoreRing({ value, size = 96, caption }: { value: number; size?: number; caption?: string }) {
  const ring = Math.max(8, size / 11);
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        width: size, height: size,
        border: `${ring}px solid var(--primary-fixed)`,
        background: "var(--surface-container-lowest)",
      }}
    >
      <div className="text-center">
        <p className="font-bold" style={{ fontSize: size / 4, color: "var(--primary)" }}>{value}</p>
        <p style={{ fontSize: size / 11, color: "var(--on-surface-variant)" }}>{caption ?? "/ 100"}</p>
      </div>
    </div>
  );
}

/* ── Metric Bar ── */
export function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px]">
        <span className="font-semibold" style={{ color: "var(--on-surface)" }}>{label}</span>
        <span style={{ color: "var(--on-surface-variant)" }}>{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
}

/* ── Primary Button ── */
export function PrimaryButton({
  children, onClick, disabled, loading, iconName,
}: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; loading?: boolean; iconName?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-150 hover:opacity-90 active:scale-95 disabled:cursor-default disabled:opacity-50"
      style={{ background: "var(--primary-container)" }}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 spin" style={{ borderColor: "rgba(255,255,255,.3)", borderTopColor: "#fff" }} />
      ) : iconName ? (
        <MaterialIcon name={iconName} size={16} />
      ) : null}
      {children}
    </button>
  );
}

/* ── Ghost Button ── */
export function GhostButton({
  children, onClick, iconName, disabled,
}: {
  children: ReactNode; onClick?: () => void; iconName?: string; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-all duration-150 hover:bg-[var(--surface-container-high)] disabled:opacity-50"
      style={{
        border: "1px solid var(--outline-variant)",
        color: "var(--on-surface-variant)",
        background: "var(--surface-container-lowest)",
      }}
    >
      {iconName && <MaterialIcon name={iconName} size={15} />}
      {children}
    </button>
  );
}

/* ── Form Field ── */
export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--on-surface-variant)" }}>{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[11px]" style={{ color: "var(--outline)" }}>{hint}</span>}
    </label>
  );
}

/* ── Input styles ── */
export const inputClass = "w-full rounded-xl px-4 py-3 text-sm outline-none transition placeholder:text-[var(--outline)]";
export const inputStyle = {
  background: "var(--surface-container-lowest)",
  border: "1px solid var(--outline-variant)",
  color: "var(--on-surface)",
};
export const inputFocusStyle = {
  borderColor: "var(--primary-container)",
  boxShadow: "0 0 0 3px rgba(0,166,147,.12)",
};

/* ── Toggle Switch ── */
export function Toggle({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className="relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200"
      style={{ background: on ? "var(--primary-container)" : "var(--outline-variant)" }}
    >
      <span
        className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200"
        style={{ left: on ? "calc(100% - 18px)" : "2px" }}
      />
    </button>
  );
}
