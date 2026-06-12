import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Skills — Production-ready Skills für Claude Code · €99 Lifetime",
  description:
    "30+ kuratierte Skill-Pakete für Claude Code, Anthropic Skills und beliebige AI-Agents. Einmal €99 — Lifetime-Zugang zu allen Skills.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="bg-ink-950 text-warm antialiased">{children}</body>
    </html>
  );
}
