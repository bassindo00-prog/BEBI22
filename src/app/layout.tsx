import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BREAKOUT.ID — Agregator & Distribusi Musik Independen",
  description:
    "Distribusi musik independen ke Spotify, Apple Music, TikTok, YouTube Music, dan 150+ DSPs tanpa potongan hak cipta dengan royalti 100% dan penarikan langsung ke rekening bank lokal.",
  keywords: [
    "BREAKOUT.ID",
    "BREAKOUT ID",
    "agregator musik indonesia",
    "distribusi musik independen",
    "Spotify for artists",
    "Apple Music distribution",
    "royalti musik",
  ],
  openGraph: {
    title: "BREAKOUT.ID — Agregator & Distribusi Musik Independen",
    description:
      "Bikin lagu di kamar. Tayangin ke seluruh dunia. Master audio 100% milik lo.",
    siteName: "BREAKOUT.ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syncopate:wght@400;700&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <script src="https://unpkg.com/@phosphor-icons/web" async></script>
      </head>
      <body className="antialiased selection:bg-[#FF4D1C] selection:text-[#F4F1EA] bg-[#0A0A09] text-[#F4F1EA]">
        {children}
      </body>
    </html>
  );
}

