import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HERMES • Luxoa — Global Music Distribution & Royalty Dashboard",
  description:
    "Distribute your music to Spotify, Apple Music, TikTok, YouTube & 150+ platforms with real-time royalty analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-[#c8f560] selection:text-[#312042]">
        {children}
      </body>
    </html>
  );
}

