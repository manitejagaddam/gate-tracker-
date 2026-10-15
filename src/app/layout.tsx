import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GATE 2027 CSE — AIR < 10 Master Tracker",
  description: "Ergonomic, eye-friendly command center for GATE 2027 CSE preparation with deep syllabus analytics, study timer, and offline sync.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0e121a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        {/* Soft, eye-comfort background lighting layer */}
        <div className="ambient-lighting-layer" aria-hidden="true">
          <div className="orb orb-warm" />
          <div className="orb orb-indigo" />
          <div className="orb orb-emerald" />
        </div>
        {children}
      </body>
    </html>
  );
}
