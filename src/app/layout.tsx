import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BREAKOUT ID — Global Music Distribution & Artist Platform",
  description:
    "Distribute your music worldwide to Spotify, Apple Music, TikTok, YouTube Music, and 150+ streaming platforms with transparent royalties, streaming analytics, and release management.",
  keywords: [
    "BREAKOUT ID",
    "music distribution",
    "digital music distribution",
    "Spotify distribution",
    "Apple Music distribution",
    "music royalties",
    "artist platform",
    "independent artists",
    "record label distribution",
  ],
  openGraph: {
    title: "BREAKOUT ID — Global Music Distribution",
    description:
      "YOUR MUSIC. YOUR WORLD. YOUR RULES. Distribute your music worldwide and retain your masters.",
    siteName: "BREAKOUT ID",
    type: "website",
  },
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

