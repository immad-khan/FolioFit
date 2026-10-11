import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Job Capture Dashboard",
  description:
    "Capture real job postings from LinkedIn, Indeed and any job site via the Chrome extension — streamed live into your dashboard.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
