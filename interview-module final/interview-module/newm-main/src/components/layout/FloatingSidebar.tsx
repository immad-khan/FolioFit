"use client";

import { Settings, LogOut, X } from "lucide-react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface NavItem {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "home", icon: "home", label: "Home" },
  { id: "modules", icon: "dashboard", label: "Modules" },
  { id: "jobs", icon: "work", label: "Jobs" },
  { id: "search", icon: "search", label: "Search" },
  { id: "star", icon: "star", label: "Favorites" },
  { id: "community", icon: "group", label: "Community" },
  { id: "interview", icon: "lightbulb", label: "Interview Prep", active: true },
  { id: "profile", icon: "person", label: "Profile" },
];

export function FloatingSidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/25 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-4 top-4 bottom-4 z-50 flex w-20 flex-col items-center rounded-full bg-primary shadow-md transition-transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{
          backgroundColor: "var(--primary)",
          boxShadow: "0 12px 32px -4px rgba(13, 92, 117, 0.2)",
        }}
      >
        {/* Logo */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full">
          <MaterialIcon
            name="auto_awesome"
            size={32}
            fill
            className="text-white"
            style={{ color: "white" }}
          />
        </div>

        {/* Navigation items */}
        <nav className="flex flex-1 flex-col items-center justify-center gap-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all ${
                item.active
                  ? "nav-active-glow"
                  : "hover:bg-white/15 text-white/70 hover:text-white"
              }`}
              style={{
                backgroundColor: item.active
                  ? "var(--primary-container)"
                  : "transparent",
                color: item.active ? "white" : "white",
              }}
              title={item.label}
            >
              <MaterialIcon
                name={item.icon}
                size={24}
                className="text-inherit"
              />
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="flex flex-col items-center gap-3 pb-4">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/15 hover:text-white"
            title="Settings"
          >
            <MaterialIcon name="settings" size={24} />
          </button>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/15 hover:text-white"
            title="Logout"
          >
            <MaterialIcon name="logout" size={24} />
          </button>
        </div>
      </aside>
    </>
  );
}
