"use client";

import { Menu } from "lucide-react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface TopHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  credits?: number;
  showControls?: boolean;
  elapsed?: number;
  onPause?: () => void;
  onAudioToggle?: () => void;
  onWrapUp?: () => void;
  audioEnabled?: boolean;
  userName?: string;
  userInitial?: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function TopHeader({
  title,
  subtitle,
  onMenuClick,
  credits = 850,
  showControls = false,
  elapsed = 0,
  onPause,
  onAudioToggle,
  onWrapUp,
  audioEnabled = true,
  userName = "Alex Chen",
  userInitial = "A",
}: TopHeaderProps) {
  return (
    <header
      className="fixed top-0 left-4 right-0 z-40 flex h-20 items-center justify-between border-b border-outline-variant/30 px-6 transition-colors lg:left-28"
      style={{
        backgroundColor: "rgba(234, 253, 255, 0.85)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 1px 8px rgba(0, 0, 0, 0.04)",
      }}
    >
      {/* Left section - Menu + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 transition-colors hover:bg-surface-container lg:hidden"
          style={{
            color: "var(--on-surface-variant)",
          }}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--primary)" }}
          >
            {subtitle || "Interview Session"}
          </p>
          <h1
            className="text-sm font-bold"
            style={{ color: "var(--on-surface)" }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Center section - Session controls */}
      {showControls && (
        <div className="flex items-center gap-3">
          <div
            className="rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-2"
            style={{
              backgroundColor: "var(--surface-container-low)",
              color: "var(--on-surface)",
            }}
          >
            <MaterialIcon name="schedule" size={16} />
            {formatTime(elapsed)}
          </div>

          <button
            onClick={onPause}
            className="rounded-lg p-2 transition-colors"
            style={{
              backgroundColor: "var(--surface-container)",
              color: "var(--on-surface-variant)",
            }}
            title="Pause session"
          >
            <MaterialIcon name="pause" size={20} />
          </button>

          <button
            onClick={onAudioToggle}
            className="rounded-lg p-2 transition-colors"
            style={{
              backgroundColor: "var(--surface-container)",
              color: audioEnabled ? "var(--primary)" : "var(--on-surface-variant)",
            }}
            title={audioEnabled ? "Mute audio" : "Unmute audio"}
          >
            <MaterialIcon
              name={audioEnabled ? "volume_2" : "volume_off"}
              size={20}
            />
          </button>

          <button
            onClick={onWrapUp}
            className="hidden rounded-full px-4 py-1.5 font-semibold text-xs text-white sm:flex items-center gap-2 transition-all hover:opacity-90"
            style={{
              backgroundColor: "var(--primary-container)",
              color: "white",
            }}
          >
            <MaterialIcon name="check_circle" size={16} />
            Wrap Up Session
          </button>
        </div>
      )}

      {/* Right section - Credits, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* AI Credits */}
        <div
          className="hidden items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold sm:flex"
          style={{
            backgroundColor: "var(--primary-fixed)",
            color: "var(--primary)",
          }}
        >
          <MaterialIcon name="auto_awesome" size={14} fill />
          AI Credits: {credits}
        </div>

        {/* Notification bell */}
        <button
          className="relative rounded-lg p-2 transition-colors"
          style={{
            color: "var(--on-surface-variant)",
            backgroundColor: "transparent",
          }}
          title="Notifications"
        >
          <MaterialIcon name="notifications" size={20} />
          <span
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--error)" }}
          />
        </button>

        {/* User profile */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="text-right">
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--on-surface)" }}
            >
              {userName}
            </p>
            <p
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--on-surface-variant)" }}
            >
              Candidate
            </p>
          </div>
          <div
            className="grid h-9 w-9 place-items-center rounded-lg font-bold text-white"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {userInitial}
          </div>
        </div>
      </div>
    </header>
  );
}
