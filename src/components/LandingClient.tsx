"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export function normalizeImageUrl(url?: string | null): string {
  if (!url) return "";
  return url.replace(/https?:\/\/storage\.vpsmurah\.co\.id/g, "/api/storage");
}

export interface LandingArtist {
  id: string | number;
  name: string;
  genre: string;
  imageUrl: string;
  listeners: string;
  quote: string;
  isVerified?: boolean;
}

export interface LandingPageData {
  id: string;
  heroSubtitle?: string;
  heroTitle1?: string;
  heroTitle2?: string;
  heroBgImage?: string;
  artists?: LandingArtist[];
  testimonials?: any[];
  [key: string]: any;
}

export const DEFAULT_PRISMA_TESTIMONIALS: LandingArtist[] = [
  {
    id: 1,
    genre: "HIP-HOP / URBAN",
    name: "Shinta Dewi",
    listeners: "3.4M+",
    quote:
      "Distribusi ke TikTok & Instagram Music sangat instan. Lagu baruku langsung viral dipakai jutaan video reels dalam waktu seminggu!",
    imageUrl:
      "https://images.unsplash.com/photo-1516280440502-6c2e8e986ef6?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 2,
    genre: "INDIE POP",
    name: "Nadya Zahira",
    listeners: "780K+",
    quote:
      "Tidak ada biaya tersembunyi atau potongan royalti aneh-aneh. Semua laporan keuangan sangat transparan bisa diunduh kapanpun.",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f928?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 3,
    genre: "DREAM POP",
    name: "Tara Anindya",
    listeners: "1.1M+",
    quote:
      "BREAKOUT ID benar-benar mempermudah musisi independen untuk berdiri sejajar dengan musisi label major di kancah global.",
    imageUrl:
      "https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 4,
    genre: "R&B / SOUL",
    name: "Siska Rania",
    listeners: "920K+",
    quote:
      "Support timnya juara. Aku berasa kayak difasilitasi oleh label rekaman besar milik sendiri tanpa banyak prosedur ribet.",
    imageUrl:
      "https://images.unsplash.com/photo-1605722243979-fc0e515d9472?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 5,
    genre: "ACOUSTIC POP",
    name: "Dinda Melati",
    listeners: "2.1M+",
    quote:
      "Gak ada lagi potongan tersembunyi. 100% hak milik adalah game-changer untuk musisi independen sepertiku.",
    imageUrl:
      "https://images.unsplash.com/photo-1483032469466-b937c425697b?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 6,
    genre: "ELECTRONIC",
    name: "Rara K.",
    listeners: "1.8M+",
    quote:
      "Platform paling stabil. Aku bisa ngecek statistik streams setiap habis manggung dengan presisi hitungan detik.",
    imageUrl:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 7,
    genre: "ROCK / ALTERNATIVE",
    name: "Chika Amalia",
    listeners: "560K+",
    quote:
      "Dari TikTok sampai Apple Music, distribusinya bener-bener tercover luas tanpa celah sedikitpun.",
    imageUrl:
      "https://images.unsplash.com/photo-1453090927415-5f45085b65c0?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 8,
    genre: "INDIE FOLK",
    name: "Vina Letisha",
    listeners: "430K+",
    quote:
      "Data audiensnya detail, ngebantu banget untuk nentuin kota target tour musikku selanjutnya bareng band.",
    imageUrl:
      "https://images.unsplash.com/photo-1525362081669-2b476bb628c3?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 9,
    genre: "JAZZ / BLUES",
    name: "Kania Salim",
    listeners: "890K+",
    quote:
      "Sistem dashboard terbaik yang pernah kulihat. Sangat estetik, intuitif dan responsif dibuka dari HP!",
    imageUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 10,
    genre: "INDIE ROCK",
    name: "Bella Grace",
    listeners: "1.5M+",
    quote:
      "Akhirnya ada platform dari musisi, untuk musisi. Wajib banget buat skena independen lokal yang mau go international.",
    imageUrl:
      "https://images.unsplash.com/photo-1499557659556-9e900c313437?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 11,
    genre: "POP PUNK",
    name: "Karin Nabila",
    listeners: "850K+",
    quote:
      "Royalti masuk tepat waktu tiap bulan. Nggak pernah ada drama payment telat. Tim supportnya bener-bener the best!",
    imageUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 12,
    genre: "LO-FI / CHILL",
    name: "Risa Larasati",
    listeners: "1.2M+",
    quote:
      "Algoritma platform ini ngebantu track lo-fi aku masuk ke berbagai playlist editorial tanpa harus repot cari promotor.",
    imageUrl:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
  {
    id: 13,
    genre: "SYNTHWAVE",
    name: "Nadin Amira",
    listeners: "670K+",
    quote:
      "Sangat mudah digunakan buat musisi yang ngerjain semuanya sendiri dari kamar. BREAKOUT ID ngerubah segalanya buatku.",
    imageUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop",
    isVerified: true,
  },
];

export const DEFAULT_LANDING_DATA: LandingPageData = {
  id: "default",
  heroSubtitle:
    "Masa depan distribusi musik independen. Rilis karya Anda ke seluruh dunia tanpa batas.",
  heroTitle1: "Breakout",
  heroTitle2: "ID",
  heroBgImage: "/6293920186406475512_121.jpg",
  artists: DEFAULT_PRISMA_TESTIMONIALS,
};

// FAQ Data
const faqData = [
  {
    id: "01",
    color: "bg-[#ff5500]",
    title: "FAQ Umum",
    items: [
      { q: "Apa itu Breakout?", a: "Platform distribusi musik indie." },
      { q: "Apakah daftar di Breakout berbayar?", a: "Gratis untuk pendaftaran tidak ada tagihan" },
      { q: "Bagaimana cara menggunakan layanan Breakout?", a: "Buat akun, upload rilis, dan distribusikan." },
    ],
  },
  {
    id: "02",
    color: "bg-[#00c88c]",
    title: "FAQ CTM",
    items: [
      { q: "Apa itu CTM?", a: "Cover to Master adalah layanan legalisasi cover lagu." },
      { q: "Kenapa cover saya kena copyright claim?", a: "Karena belum ada lisensi resmi." },
    ],
  },
  {
    id: "03",
    color: "bg-[#5b7396]",
    title: "FAQ DMD",
    items: [
      { q: "Apa itu DMD?", a: "Digital Music Distribution." },
      { q: "Apakah karya original saya terlindungi?", a: "Ya, kami menjaga hak cipta kreator." },
    ],
  },
  {
    id: "04",
    color: "bg-[#ff5500]",
    title: "FAQ Royalty",
    items: [
      {
        q: "Berapa pembagian royalty yang diterima artist?",
        a: "Pembagian royalti adalah 70% untuk artist dan 30% untuk label dari royalti bersih yang diterima.",
      },
    ],
  },
  {
    id: "05",
    color: "bg-[#00c88c]",
    title: "FAQ Rilis",
    items: [
      {
        q: "Berapa lama proses rilis musik?",
        a: "Proses distribusi dan rilis musik memerlukan waktu sekitar 7–14 hari kerja sejak semua data dan materi rilis dinyatakan lengkap serta lolos proses verifikasi.",
      },
    ],
  },
];

// Komponen Efek Mengetik
const TypewriterText = ({
  text,
  isActive = true,
  delay = 35,
}: {
  text: string;
  isActive?: boolean;
  delay?: number;
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!isActive) {
      setDisplayedText("");
      return;
    }

    let i = 0;
    const startTimeout = setTimeout(() => {
      const intervalId = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(intervalId);
      }, delay);
      return () => clearInterval(intervalId);
    }, 400);

    return () => clearTimeout(startTimeout);
  }, [text, isActive, delay]);

  return (
    <span>
      {displayedText}
      <span
        className={`inline-block w-[3px] h-[0.9em] bg-[#ff0055] ml-1 align-middle transition-opacity duration-300 ${
          displayedText.length === text.length ? "animate-pulse opacity-100" : "opacity-80"
        }`}
      />
    </span>
  );
};

export default function LandingClient({
  initialData = DEFAULT_LANDING_DATA,
}: {
  initialData?: LandingPageData;
}) {
  const [activeSection, setActiveSection] = useState(0);
  const [activePlatformIndex, setActivePlatformIndex] = useState(0);
  const [activeHIndex, setActiveHIndex] = useState(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [openFaqItem, setOpenFaqItem] = useState<string | null>("01-0");
  const [hMoveAmount, setHMoveAmount] = useState(384);

  const sectionRef = useRef(0);
  const platformIndexRef = useRef(0);
  const hIndexRef = useRef(0);
  const faqIndexRef = useRef(0);
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);

  const totalSections = 9;
  const platformSectionIndex = 2; // Bar 3
  const testimonialSectionIndex = 6; // Bar 7
  const faqSectionIndex = 7; // Bar 8
  const totalPlatformSlides = 5;

  const [data, setData] = useState<LandingPageData>(initialData);

  // Sync artists data from CMS/DB with fallback
  const testimonials: LandingArtist[] =
    data?.artists && data.artists.length > 0
      ? data.artists.map((a: any, i: number) => ({
          id: a.id || i + 1,
          name: a.name || "Artis",
          genre: a.genre || "Pop",
          imageUrl:
            normalizeImageUrl(a.imageUrl || a.photo) ||
            DEFAULT_PRISMA_TESTIMONIALS[i % DEFAULT_PRISMA_TESTIMONIALS.length].imageUrl,
          listeners: a.listeners || a.monthlyListeners || "1M+",
          quote: a.quote || a.bio || "Platform distribusi terbaik untuk musisi independen.",
          isVerified: a.isVerified !== undefined ? Boolean(a.isVerified) : true,
        }))
      : DEFAULT_PRISMA_TESTIMONIALS;

  // Real-time synchronization state with Web CMS
  useEffect(() => {
    fetch("/api/cms/landing")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data) {
          setData(json.data);
        }
      })
      .catch((err) => console.warn("Failed to fetch fresh live landing data:", err));
  }, []);

  // Update card step distance on resize
  useEffect(() => {
    const updateWidth = () => {
      const w = window.innerWidth < 768 ? 300 : 360;
      const gap = 24;
      setHMoveAmount(w + gap);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Prevent default window scroll; handle layered stacking and horizontal slides smoothly
  useEffect(() => {
    const handleScroll = (direction: number) => {
      const currentSec = sectionRef.current;
      const currentP = platformIndexRef.current;
      const currentH = hIndexRef.current;
      const currentF = faqIndexRef.current;

      // 1. Platform Section Horizontal Scroll Intercept (Bar 3)
      if (currentSec === platformSectionIndex) {
        if (direction === 1 && currentP < totalPlatformSlides - 1) {
          isScrolling.current = true;
          platformIndexRef.current = currentP + 1;
          setActivePlatformIndex(platformIndexRef.current);
          setTimeout(() => {
            isScrolling.current = false;
          }, 320);
          return;
        } else if (direction === -1 && currentP > 0) {
          isScrolling.current = true;
          platformIndexRef.current = currentP - 1;
          setActivePlatformIndex(platformIndexRef.current);
          setTimeout(() => {
            isScrolling.current = false;
          }, 320);
          return;
        }
      }

      // 2. Testimonial Section Horizontal Scroll Intercept (Bar 7)
      if (currentSec === testimonialSectionIndex) {
        if (direction === 1 && currentH < testimonials.length - 1) {
          isScrolling.current = true;
          hIndexRef.current = currentH + 1;
          setActiveHIndex(hIndexRef.current);
          setTimeout(() => {
            isScrolling.current = false;
          }, 320);
          return;
        } else if (direction === -1 && currentH > 0) {
          isScrolling.current = true;
          hIndexRef.current = currentH - 1;
          setActiveHIndex(hIndexRef.current);
          setTimeout(() => {
            isScrolling.current = false;
          }, 320);
          return;
        }
      }

      // 3. FAQ Section Horizontal Scroll Intercept (Bar 8)
      if (currentSec === faqSectionIndex) {
        if (direction === 1 && currentF < faqData.length - 1) {
          isScrolling.current = true;
          faqIndexRef.current = currentF + 1;
          setActiveFaqIndex(faqIndexRef.current);
          setTimeout(() => {
            isScrolling.current = false;
          }, 320);
          return;
        } else if (direction === -1 && currentF > 0) {
          isScrolling.current = true;
          faqIndexRef.current = currentF - 1;
          setActiveFaqIndex(faqIndexRef.current);
          setTimeout(() => {
            isScrolling.current = false;
          }, 320);
          return;
        }
      }

      // 4. Vertical Stacking Transition (Section rises from below and covers previous section)
      const nextSec = currentSec + direction;
      if (nextSec >= 0 && nextSec < totalSections) {
        isScrolling.current = true;
        sectionRef.current = nextSec;
        setActiveSection(sectionRef.current);
        setTimeout(() => {
          isScrolling.current = false;
        }, 650);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling.current) return;
      if (Math.abs(e.deltaY) < 18) return;
      handleScroll(e.deltaY > 0 ? 1 : -1);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (diff > 45) handleScroll(1);
      else if (diff < -45) handleScroll(-1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [testimonials.length]);

  // Layered Stacking helper: previous sections stay fixed at top 0; active section slides up from 100% to 0% and covers it
  const getStackStyle = (idx: number, zIndex: number) => {
    const isFuture = idx > activeSection;

    return {
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex,
      transform: isFuture ? "translate3d(0, 100%, 0)" : "translate3d(0, 0, 0)",
      transition: "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
      willChange: "transform",
      boxShadow: idx > 0 ? "0 -25px 50px -10px rgba(0, 0, 0, 0.95)" : "none",
      borderTop: idx > 0 ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
      backgroundColor: "#050505",
      overflow: "hidden" as const,
    };
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap');
        
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #050505;
          font-family: 'Inter', sans-serif;
          color: white;
          overscroll-behavior: none;
        }

        .stack-screen {
          width: 100vw;
          height: 100vh;
          height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: -2;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.88) 100%);
          z-index: -1;
        }

        .content {
          z-index: 10;
          width: 100%;
          max-width: 1200px;
          padding: 0 24px;
          position: relative;
        }

        .h-track {
          display: flex;
          width: max-content;
          transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1);
          will-change: transform;
        }

        .h-slide {
          flex-shrink: 0;
        }

        .btn-glow {
          box-shadow: 0 0 20px rgba(255,0,85,0.4);
          transition: all 0.4s ease;
        }

        .btn-glow:hover {
          box-shadow: 0 0 40px rgba(255,0,85,0.8);
          transform: translateY(-3px);
          background-color: #ff1a66;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff0055;
          border-radius: 4px;
        }
      `,
        }}
      />

      {/* Floating Logo Pojok Kiri Atas */}
      <div className="fixed top-6 left-6 md:top-10 md:left-12 z-[100] pointer-events-auto">
        <Link href="/" className="inline-block group">
          <h2 className="text-xl md:text-2xl font-black tracking-widest text-white uppercase drop-shadow-lg group-hover:opacity-90 transition-opacity">
            BREAKOUT<span className="text-[#ff0055]">.ID</span>
          </h2>
        </Link>
      </div>

      <main className="relative w-screen h-screen overflow-hidden">
        {/* =========================================================================
            BAR 1: HERO DENGAN FOTO KARAKTER SAMURAI MERAH
           ========================================================================= */}
        <section
          id="bar-1"
          style={getStackStyle(0, 10)}
          className="stack-screen"
        >
          <img
            src={normalizeImageUrl(data?.heroBgImage) || "/6293920186406475512_121.jpg"}
            alt="Hero Anime Masked Girl"
            className="bg-img"
            style={{ filter: "brightness(0.55) contrast(1.15)" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/6293920186406475229_121.jpg";
            }}
          />
          <div
            className="overlay"
            style={{
              background:
                "linear-gradient(to bottom, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.85) 100%)",
            }}
          />
          <div className="content text-center">
            <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter uppercase text-white drop-shadow-2xl">
              {data?.heroTitle1 || "Breakout"}{" "}
              <span className="text-[#ff0055]">{data?.heroTitle2 || "ID"}</span>
            </h1>
            <div className="text-xl md:text-2xl font-light mb-8 text-white max-w-2xl mx-auto min-h-[60px] md:min-h-[80px] drop-shadow">
              <TypewriterText
                text={
                  data?.heroSubtitle ||
                  "Masa depan distribusi musik independen. Rilis karya Anda ke seluruh dunia tanpa batas."
                }
                isActive={activeSection === 0}
              />
            </div>
            <Link
              href="/register"
              className="inline-block bg-[#ff0055] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm btn-glow"
            >
              Mulai Rilis Sekarang
            </Link>
          </div>
        </section>

        {/* =========================================================================
            BAR 2: SPEED / DJ (MENUTUPI BAR 1)
           ========================================================================= */}
        <section
          id="bar-2"
          style={getStackStyle(1, 20)}
          className="stack-screen"
        >
          <img
            src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2000&auto=format&fit=crop"
            alt="DJ Speed"
            className="bg-img"
            style={{ filter: "brightness(0.3) contrast(1.1)" }}
          />
          <div className="overlay" />
          <div className="content text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase text-white">
              Rilis Lebih <span className="text-[#ff0055]">Cepat</span>
            </h2>
            <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase text-white">
              Kapan Saja.
            </h2>
            <p className="text-white text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Sistem canggih kami memproses lagu Anda ke platform streaming raksasa hanya dalam
              hitungan hari, bukan minggu.
            </p>
          </div>
        </section>

        {/* =========================================================================
            BAR 3: 150+ PLATFORM DIGITAL (MENUTUPI BAR 2)
            SCROLL KE SAMPING (5 SLIDES)
           ========================================================================= */}
        <section
          id="bar-3"
          style={getStackStyle(2, 30)}
          className="stack-screen flex-col items-start justify-center"
        >
          <div className="absolute top-16 md:top-24 left-8 md:left-[10vw] z-20 pointer-events-none">
            <h2 className="text-3xl md:text-5xl font-black tracking-widest text-white drop-shadow-lg uppercase">
              150+ Platform
            </h2>
            <h2 className="text-3xl md:text-5xl font-black tracking-widest text-[#ff0055] drop-shadow-lg uppercase mt-2">
              Digital.
            </h2>
          </div>

          <div className="w-full mt-24 md:mt-36">
            <div
              className="h-track px-8 md:px-[10vw] gap-6"
              style={{
                transform: `translateX(-${activePlatformIndex * hMoveAmount}px)`,
              }}
            >
              {/* Slide 1 - Top Tier Platforms */}
              <div className="h-slide w-[300px] md:w-[360px] border border-gray-800 bg-[#0a0a0a] rounded-3xl p-6 md:p-8 flex flex-col justify-center items-center shadow-xl h-[400px]">
                <div className="grid grid-cols-2 gap-4 w-full h-full">
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#1DB954]/50 transition-colors">
                    <span className="text-[#1DB954] font-black text-lg tracking-tighter">
                      Spotify
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#FA243C]/50 transition-colors">
                    <span className="text-[#FA243C] font-black text-lg tracking-tighter">
                      Apple Music
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-white/50 transition-colors">
                    <span className="text-white font-black text-lg tracking-tighter">TikTok</span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#FF0000]/50 transition-colors">
                    <span className="text-[#FF0000] font-black text-lg tracking-tighter">
                      YouTube
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#E1306C]/50 transition-colors">
                    <span className="text-[#E1306C] font-black text-lg tracking-tighter">
                      Instagram
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#00A8E1]/50 transition-colors">
                    <span className="text-[#00A8E1] font-black text-lg tracking-tighter">
                      Amazon
                    </span>
                  </div>
                </div>
              </div>

              {/* Slide 2 - Global Majors */}
              <div className="h-slide w-[300px] md:w-[360px] border border-gray-800 bg-[#0a0a0a] rounded-3xl p-6 md:p-8 flex flex-col justify-center items-center shadow-xl h-[400px]">
                <div className="grid grid-cols-2 gap-4 w-full h-full">
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-gray-600 transition-colors">
                    <span className="text-white font-black text-lg tracking-tighter">Deezer</span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-gray-600 transition-colors">
                    <span className="text-white font-black text-lg tracking-tighter">TIDAL</span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#FF5500]/50 transition-colors">
                    <span className="text-[#FF5500] font-black text-lg tracking-tighter">
                      SoundCloud
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#0055FF]/50 transition-colors">
                    <span className="text-[#0055FF] font-black text-lg tracking-tighter">
                      Pandora
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#00D2FF]/50 transition-colors">
                    <span className="text-[#00D2FF] font-black text-lg tracking-tighter">
                      Shazam
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-gray-600 transition-colors">
                    <span className="text-white font-black text-lg tracking-tighter">Napster</span>
                  </div>
                </div>
              </div>

              {/* Slide 3 - Asia & Regional */}
              <div className="h-slide w-[300px] md:w-[360px] border border-gray-800 bg-[#0a0a0a] rounded-3xl p-6 md:p-8 flex flex-col justify-center items-center shadow-xl h-[400px]">
                <div className="grid grid-cols-2 gap-4 w-full h-full">
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-gray-600 transition-colors">
                    <span className="text-white font-black text-lg tracking-tighter">Tencent</span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#E60026]/50 transition-colors">
                    <span className="text-[#E60026] font-black text-lg tracking-tighter">
                      NetEase
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#00B900]/50 transition-colors">
                    <span className="text-[#00B900] font-black text-lg tracking-tighter">JOOX</span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#FFD500]/50 transition-colors">
                    <span className="text-[#FFD500] font-black text-lg tracking-tighter">
                      Boomplay
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#8923FF]/50 transition-colors">
                    <span className="text-[#8923FF] font-black text-lg tracking-tighter">
                      Anghami
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#E52D27]/50 transition-colors">
                    <span className="text-[#E52D27] font-black text-lg tracking-tighter">Claro</span>
                  </div>
                </div>
              </div>

              {/* Slide 4 - Electronic & High Fidelity */}
              <div className="h-slide w-[300px] md:w-[360px] border border-gray-800 bg-[#0a0a0a] rounded-3xl p-6 md:p-8 flex flex-col justify-center items-center shadow-xl h-[400px]">
                <div className="grid grid-cols-2 gap-4 w-full h-full">
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#C6002B]/50 transition-colors">
                    <span className="text-[#C6002B] font-black text-lg tracking-tighter">
                      iHeart
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-white/50 transition-colors">
                    <span className="text-white font-black text-lg tracking-tighter">Qobuz</span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#9146FF]/50 transition-colors">
                    <span className="text-[#9146FF] font-black text-lg tracking-tighter">Twitch</span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#E60000]/50 transition-colors">
                    <span className="text-[#E60000] font-black text-lg tracking-tighter">Vevo</span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#01FF95]/50 transition-colors">
                    <span className="text-[#01FF95] font-black text-lg tracking-tighter">
                      Beatport
                    </span>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-[#121212] rounded-xl border border-gray-800 hover:border-[#FFCC00]/50 transition-colors">
                    <span className="text-[#FFCC00] font-black text-lg tracking-tighter">
                      Yandex
                    </span>
                  </div>
                </div>
              </div>

              {/* Slide 5 - 120+ Lainnya */}
              <div className="h-slide w-[300px] md:w-[360px] border border-gray-800 bg-gradient-to-br from-[#ff0055] to-[#88002e] rounded-3xl p-6 md:p-8 flex flex-col justify-center items-center text-center shadow-[0_0_30px_rgba(255,0,85,0.4)] h-[400px]">
                <h3 className="text-5xl md:text-6xl font-black text-white mb-3">+120</h3>
                <p className="text-lg md:text-xl font-bold tracking-widest uppercase text-white mb-2">
                  Platform Lainnya
                </p>
                <p className="text-xs md:text-sm text-pink-100 font-medium leading-relaxed">
                  Musik Anda didistribusikan ke setiap jaringan digital dunia secara komprehensif.
                </p>
              </div>
            </div>
          </div>

          {/* Slider Controls */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-40 flex items-center gap-3">
            <div className="text-white font-bold tracking-[0.3em] text-sm md:text-lg">
              {`0${activePlatformIndex + 1}`.slice(-2)} / {`0${totalPlatformSlides}`.slice(-2)}
            </div>
            <div className="flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={() => {
                  if (activePlatformIndex > 0) {
                    platformIndexRef.current = activePlatformIndex - 1;
                    setActivePlatformIndex(platformIndexRef.current);
                  }
                }}
                disabled={activePlatformIndex === 0}
                className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-[#ff0055] disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center text-white text-base font-bold transition-all shadow-lg active:scale-95"
                title="Previous Slide"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activePlatformIndex < totalPlatformSlides - 1) {
                    platformIndexRef.current = activePlatformIndex + 1;
                    setActivePlatformIndex(platformIndexRef.current);
                  }
                }}
                disabled={activePlatformIndex === totalPlatformSlides - 1}
                className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-[#ff0055] disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center text-white text-base font-bold transition-all shadow-lg active:scale-95"
                title="Next Slide"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            BAR 4: PANTAU STATISTIK (MENUTUPI BAR 3)
           ========================================================================= */}
        <section
          id="bar-4"
          style={getStackStyle(3, 40)}
          className="stack-screen"
        >
          <img
            src="https://images.unsplash.com/photo-1520872024865-3ff2805d8bb3?q=80&w=2000&auto=format&fit=crop"
            alt="Data Analitik"
            className="bg-img"
            style={{ filter: "brightness(0.3) contrast(1.1)" }}
          />
          <div className="overlay" />
          <div className="content text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase text-white">
              Pantau <span className="text-[#ff0055]">Statistik</span>
            </h2>
            <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase text-white">
              Kapanpun.
            </h2>
            <p className="text-white text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Ketahui siapa pendengar Anda, di mana mereka berada, dan lacak pendapatan royalti
              harian dengan dashboard pintar kami.
            </p>
          </div>
        </section>

        {/* =========================================================================
            BAR 5: 100% HAK ANDA (MENUTUPI BAR 4)
           ========================================================================= */}
        <section
          id="bar-5"
          style={getStackStyle(4, 50)}
          className="stack-screen"
        >
          <img
            src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2000&auto=format&fit=crop"
            alt="100% Hak Milik"
            className="bg-img"
            style={{ filter: "brightness(0.3) contrast(1.1)" }}
          />
          <div className="overlay" />
          <div className="content text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase text-white">
              <span className="text-[#ff0055]">100%</span> Hak Anda
            </h2>
            <p className="text-white text-sm md:text-base max-w-xl mx-auto leading-relaxed mt-6">
              Kami tidak mengambil potongan sepeser pun dari royalti Anda. Anda berkarya, Anda
              yang berhak menerima segalanya.
            </p>
          </div>
        </section>

        {/* =========================================================================
            BAR 6: DIBUAT OLEH MUSISI (MENUTUPI BAR 5)
           ========================================================================= */}
        <section
          id="bar-6"
          style={getStackStyle(5, 60)}
          className="stack-screen"
        >
          <img
            src="https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=2000&auto=format&fit=crop"
            alt="Gitaris Wanita"
            className="bg-img"
            style={{ filter: "brightness(0.3) contrast(1.1)" }}
          />
          <div className="overlay" />
          <div className="content text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase text-white">
              Dibuat Oleh <span className="text-[#ff0055]">Musisi</span>
            </h2>
            <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase text-white">
              Untuk Musisi.
            </h2>
            <p className="text-white text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Tim support kami siaga 24/7. Karena kami sangat mengerti betapa berharganya setiap
              karya yang Anda ciptakan.
            </p>
          </div>
        </section>

        {/* =========================================================================
            BAR 7: TESTIMONI ARTIS (MENUTUPI BAR 6)
            SCROLL KE SAMPING (13 ARTIS)
           ========================================================================= */}
        <section
          id="bar-7"
          style={getStackStyle(6, 70)}
          className="stack-screen flex-col items-start justify-center"
        >
          <div className="absolute top-16 md:top-24 left-8 md:left-[10vw] z-20 pointer-events-none">
            <h2 className="text-3xl md:text-5xl font-black tracking-widest text-white drop-shadow-lg uppercase">
              Testimoni
            </h2>
          </div>

          <div className="w-full mt-24 md:mt-36">
            <div
              className="h-track px-8 md:px-[10vw] gap-6"
              style={{
                transform: `translateX(-${activeHIndex * hMoveAmount}px)`,
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="h-slide w-[300px] md:w-[360px] border border-gray-800 bg-[#0a0a0a] rounded-3xl p-6 md:p-8 flex flex-col items-center text-center shadow-xl hover:border-gray-700 transition-colors"
                >
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-5 border-4 border-gray-800 shadow-[0_0_15px_rgba(255,0,85,0.25)] bg-[#121212]">
                    <img
                      src={t.imageUrl || "/6293920186406475218_120.jpg"}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1516280440502-6c2e8e986ef6?q=80&w=600&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <p className="text-[10px] md:text-xs font-bold tracking-widest uppercase text-white mb-1">
                    {t.genre}
                  </p>
                  <h3 className="text-xl md:text-2xl font-black text-white mb-4">{t.name}</h3>
                  <p className="text-sm md:text-base text-white font-medium italic flex-grow mb-6 leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div className="w-full flex justify-between items-center text-[10px] md:text-xs text-white font-bold border-t border-gray-800 pt-5">
                    <div className="flex items-center gap-1.5 text-[#ff0055]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                      </svg>
                      {t.listeners} Monthly Listeners
                    </div>
                    <span className="text-white">
                      {t.isVerified !== false ? "Verified Artist" : "Artist"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slider Controls */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-40 flex items-center gap-3">
            <div className="text-white font-bold tracking-[0.3em] text-sm md:text-lg">
              {`0${activeHIndex + 1}`.slice(-2)} / {`0${testimonials.length}`.slice(-2)}
            </div>
            <div className="flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={() => {
                  if (activeHIndex > 0) {
                    hIndexRef.current = activeHIndex - 1;
                    setActiveHIndex(hIndexRef.current);
                  }
                }}
                disabled={activeHIndex === 0}
                className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-[#ff0055] disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center text-white text-base font-bold transition-all shadow-lg active:scale-95"
                title="Previous Artist"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeHIndex < testimonials.length - 1) {
                    hIndexRef.current = activeHIndex + 1;
                    setActiveHIndex(hIndexRef.current);
                  }
                }}
                disabled={activeHIndex === testimonials.length - 1}
                className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-[#ff0055] disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center text-white text-base font-bold transition-all shadow-lg active:scale-95"
                title="Next Artist"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            BAR 8: FAQ ACCORDION (MENUTUPI BAR 7)
            SCROLL KE SAMPING (5 KATEGORI FAQ)
           ========================================================================= */}
        <section
          id="bar-8"
          style={getStackStyle(7, 80)}
          className="stack-screen flex-col items-start justify-center"
        >
          <div className="absolute top-16 md:top-24 left-8 md:left-[10vw] z-20 pointer-events-none">
            <h2 className="text-3xl md:text-5xl font-black tracking-widest text-white drop-shadow-lg uppercase">
              FAQ
            </h2>
          </div>

          <div className="w-full mt-24 md:mt-32">
            <div
              className="h-track px-8 md:px-[10vw] gap-6"
              style={{
                transform: `translateX(-${activeFaqIndex * hMoveAmount}px)`,
              }}
            >
              {faqData.map((faq, idx) => (
                <div
                  key={idx}
                  className="h-slide w-[300px] md:w-[360px] border border-gray-800 bg-[#121118] rounded-[32px] p-6 md:p-8 flex flex-col shadow-2xl h-[470px] overflow-y-auto custom-scrollbar"
                >
                  <div className="flex justify-between items-center mb-6">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0 shadow-lg ${faq.color}`}
                    >
                      {faq.id}
                    </div>
                    <h3 className="text-2xl font-bold text-white text-right tracking-tight">
                      {faq.title}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3.5">
                    {faq.items.map((item, itemIdx) => {
                      const itemId = `${faq.id}-${itemIdx}`;
                      const isOpen = openFaqItem === itemId;
                      return (
                        <div
                          key={itemIdx}
                          className="bg-[#1f1e27] border border-gray-800 rounded-[22px] p-5 cursor-pointer transition-all duration-300 hover:border-gray-700"
                          onClick={() => setOpenFaqItem(isOpen ? null : itemId)}
                        >
                          <div className="flex justify-between items-center gap-4">
                            <h4 className="text-white font-bold text-sm md:text-base leading-snug">
                              {item.q}
                            </h4>
                            <div className="w-8 h-8 rounded-full border border-gray-600 flex-shrink-0 flex items-center justify-center text-white text-sm font-bold bg-[#282733]">
                              {isOpen ? "—" : "+"}
                            </div>
                          </div>
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              isOpen ? "max-h-40 mt-3.5 opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            <p className="text-gray-300 text-sm leading-relaxed border-t border-gray-800 pt-3">
                              {item.a}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Controls */}
          <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-40 flex items-center gap-3">
            <div className="text-white font-bold tracking-[0.3em] text-sm md:text-lg">
              {`0${activeFaqIndex + 1}`.slice(-2)} / {`0${faqData.length}`.slice(-2)}
            </div>
            <div className="flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={() => {
                  if (activeFaqIndex > 0) {
                    faqIndexRef.current = activeFaqIndex - 1;
                    setActiveFaqIndex(faqIndexRef.current);
                  }
                }}
                disabled={activeFaqIndex === 0}
                className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-[#ff0055] disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center text-white text-base font-bold transition-all shadow-lg active:scale-95"
                title="Previous FAQ"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeFaqIndex < faqData.length - 1) {
                    faqIndexRef.current = activeFaqIndex + 1;
                    setActiveFaqIndex(faqIndexRef.current);
                  }
                }}
                disabled={activeFaqIndex === faqData.length - 1}
                className="w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-[#ff0055] disabled:opacity-25 disabled:pointer-events-none flex items-center justify-center text-white text-base font-bold transition-all shadow-lg active:scale-95"
                title="Next FAQ"
              >
                ›
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            BAR 9: FINAL CTA & FOOTER (MENUTUPI BAR 8)
           ========================================================================= */}
        <section
          id="bar-9"
          style={getStackStyle(8, 90)}
          className="stack-screen"
        >
          <img
            src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2000&auto=format&fit=crop"
            alt="Konser"
            className="bg-img"
            style={{ filter: "brightness(0.3) contrast(1.1)" }}
          />
          <div className="overlay" />
          <div className="content text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter text-white">
              Waktunya <span className="text-[#ff0055]">Bersinar</span>
            </h2>
            <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Bergabunglah dengan ribuan musisi lainnya yang telah mempercayakan karyanya pada
              BREAKOUT ID.
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-[#ff0055] hover:text-white transition-all duration-300 shadow-2xl"
            >
              Daftar Gratis
            </Link>
          </div>

          <footer className="absolute bottom-6 left-0 w-full text-center text-xs text-gray-500 tracking-widest uppercase">
            &copy; 2026 BREAKOUT ID. All Rights Reserved.
          </footer>
        </section>
      </main>
    </>
  );
}
