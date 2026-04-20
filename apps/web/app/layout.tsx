import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weather Dashboard",
  description: "Live weather dashboard with Supabase Realtime and Open-Meteo"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
