"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function normalizeImageUrl(url?: string | null): string {
  if (!url) return "";
  return url.replace(/https?:\/\/storage\.vpsmurah\.co\.id/g, "/api/storage");
}

// ============================================================================
// DATA TYPES UNTUK CMS LANDING PAGE
// ============================================================================
export interface ArtistItem {
  id: string;
  name: string;
  genre: string;
  photo: string;
  bio: string;
  monthlyListeners: string;
  topTrack: string;
  spotifyUrl: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  artistName: string;
  role: string;
  quote: string;
  avatar: string;
  streams: string;
}

export interface LandingPageData {
  id: string;
  heroSubtitle: string;
  heroTitle1: string;
  heroTitle2: string;
  heroBgImage: string;
  navBgImage: string;
  storesCount: number;
  card1Text: string;
  card1Image: string;
  card2Title: string;
  card2Desc: string;
  card2Image: string;
  card3Title: string;
  card3Desc: string;
  card3Image: string;
  artists: ArtistItem[];
  testimonials: TestimonialItem[];
}

export const DEFAULT_LANDING_DATA: LandingPageData = {
  id: "default",
  heroSubtitle: "Global Reach By BREAKOUT.ID",
  heroTitle1: "BREAKOUT",
  heroTitle2: "",
  heroBgImage: "/api/storage/releases/anonymous/covers/1793783563730-he543j3-Cat.jpg",
  navBgImage: "/api/storage/releases/anonymous/covers/1793782330345-bn6suo3-backgorund-hitam.jpg",
  storesCount: 150,
  card1Text: "We reshape the future of music distribution and artist services as a platform (MaaS).",
  card1Image: "/api/storage/releases/anonymous/covers/1793782605883-bj73mkf-________________________-_.jpg",
  card2Title: "Driven By A Passion.",
  card2Desc: "Pushing the boundaries of what's possible in the global audio realm.",
  card2Image: "/api/storage/releases/anonymous/covers/1793782610450-jdxiowx-download__2_.jpg",
  card3Title: "Distribution Solutions.",
  card3Desc: "Tailored to your unique sound crafting new sonic landscapes.",
  card3Image: "/api/storage/releases/anonymous/covers/1793782615934-2e3j81g-download__1_.jpg",
  artists: [
    {
      id: "art-1",
      name: "Basstrack Indo",
      genre: "Phonk / Bass Nusantara",
      photo: "/api/storage/releases/anonymous/covers/1793782637681-h9i5a2n-download.jpg",
      bio: "Pelopor sound bassboosted nusantara dengan 20M+ streams global di DSP.",
      monthlyListeners: "1.8M",
      topTrack: "Midnight Drift Vol. 2",
      spotifyUrl: "https://open.spotify.com",
    },
    {
      id: "art-2",
      name: "Sarah Viola",
      genre: "Indie Pop / Cinematic",
      photo: "/api/storage/releases/anonymous/covers/1793782649436-e8g5gwr-Lora.jpg",
      bio: "Vokalis & produser independen, rilis multi-platform global via BREAKOUT.ID.",
      monthlyListeners: "920K",
      topTrack: "Lavendera Sky",
      spotifyUrl: "https://open.spotify.com",
    },
    {
      id: "art-3",
      name: "Krowdy Pulse",
      genre: "Cyberpunk Hip-Hop",
      photo: "/api/storage/releases/anonymous/covers/1793782690165-6kwhy39-_feraachen.jpg",
      bio: "Menggabungkan beat industrial modern dengan lirik jalanan Jakarta.",
      monthlyListeners: "640K",
      topTrack: "Neon Rebellion",
      spotifyUrl: "https://open.spotify.com",
    },
  ],
  testimonials: [
    {
      id: "testi-1",
      name: "Rian Ardiansyah",
      artistName: "Basstrack Indo",
      role: "Electronic Music Producer",
      quote:
        "Distribusi lewat BREAKOUT.ID royalti 100% transparan, cair tepat waktu langsung ke rekening BCA tanpa potongan siluman.",
      avatar: "/api/storage/releases/anonymous/covers/1793782769859-x1ugod6-download__4_.jpg",
      streams: "15.4M Streams",
    },
    {
      id: "testi-2",
      name: "Maya Clarissa",
      artistName: "Sarah Viola",
      role: "Solo Artist & Songwriter",
      quote:
        "Bikin lagu di kamar malam hari, upload master pagi, dalam 48 jam udah live di Spotify, Apple Music & TikTok. Dashboard super clean!",
      avatar: "/api/storage/releases/anonymous/covers/1793782778211-o8i2y5l-download__3_.jpg",
      streams: "4.2M Streams",
    },
    {
      id: "testi-3",
      name: "Denny 'Krowdy'",
      artistName: "Krowdy Pulse",
      role: "Hip-Hop / Beatmaker",
      quote:
        "Dukungan agregator lokal dengan standar internasional. Fitur analitik DSP dan split royaltinya ngebantu banget kolaborasi tim.",
      avatar: "/api/storage/releases/anonymous/covers/1793782788033-fbhqvbo-Nrynxntram.jpg",
      streams: "2.8M Streams",
    },
  ],
};

// ============================================================================
// KOMPONEN PEMBANTU: Animasi Mengetik (Typewriter) ala React
// ============================================================================
interface TypewriterProps {
  text?: string;
  speed?: number;
  start?: boolean;
  onComplete?: () => void;
  className?: string;
}

const TypewriterText: React.FC<TypewriterProps> = ({
  text = "",
  speed = 80,
  start = false,
  onComplete,
  className = "",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!start || !text) return;

    setIsTyping(true);
    let i = 0;

    const typeChar = () => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        setTimeout(typeChar, speed);
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    };

    const timer = setTimeout(typeChar, speed);
    return () => clearTimeout(timer);
  }, [start, text, speed]);

  return (
    <span className={`${className} ${isTyping ? "typing-cursor" : ""}`}>
      {displayedText}
    </span>
  );
};

// ============================================================================
// KOMPONEN UTAMA (Landing Page Client)
// ============================================================================
export default function LandingClient({
  initialData,
}: {
  initialData?: LandingPageData;
}) {
  const [dbData, setDbData] = useState<LandingPageData>(
    initialData || DEFAULT_LANDING_DATA
  );
  const [loaded, setLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State urutan animasi Header
  const [animStep, setAnimStep] = useState(0);

  // State untuk Counter 150+
  const [storeCount, setStoreCount] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);

  // 1. Background fetch data dari CMS Database (supaya auto update saat admin edit tanpa reload)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/cms/landing", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            const raw = json.data;
            setDbData({
              ...raw,
              heroBgImage: normalizeImageUrl(raw.heroBgImage) || DEFAULT_LANDING_DATA.heroBgImage,
              navBgImage: normalizeImageUrl(raw.navBgImage) || DEFAULT_LANDING_DATA.navBgImage,
              card1Image: normalizeImageUrl(raw.card1Image) || DEFAULT_LANDING_DATA.card1Image,
              card2Image: normalizeImageUrl(raw.card2Image) || DEFAULT_LANDING_DATA.card2Image,
              card3Image: normalizeImageUrl(raw.card3Image) || DEFAULT_LANDING_DATA.card3Image,
              artists: (raw.artists || []).map((a: any) => ({
                ...a,
                photo: normalizeImageUrl(a.photo),
              })),
              testimonials: (raw.testimonials || []).map((t: any) => ({
                ...t,
                avatar: normalizeImageUrl(t.avatar),
              })),
            });
          }
        }
      } catch (err) {
        console.warn("Using fallback default landing data:", err);
      } finally {
        setLoaded(true);
        setTimeout(() => setAnimStep(1), 250);
      }
    };
    fetchData();
  }, []);

  // 2. Inject CSS Font Awesome & Google Fonts secara dinamis
  useEffect(() => {
    const linkFA = document.createElement("link");
    linkFA.rel = "stylesheet";
    linkFA.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(linkFA);

    const linkFonts = document.createElement("link");
    linkFonts.rel = "stylesheet";
    linkFonts.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syncopate:wght@400;700&display=swap";
    document.head.appendChild(linkFonts);

    return () => {
      if (document.head.contains(linkFA)) document.head.removeChild(linkFA);
      if (document.head.contains(linkFonts))
        document.head.removeChild(linkFonts);
    };
  }, []);

  // 3. Counter Animation (Count Up dari 0 ke dbData.storesCount)
  useEffect(() => {
    const target = dbData.storesCount || 150;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const intervalTime = duration / steps;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setStoreCount(target);
              clearInterval(timer);
            } else {
              setStoreCount(Math.floor(current));
            }
          }, intervalTime);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [dbData.storesCount]);

  const DSP_ICONS = [
    { icon: "fa-spotify", name: "Spotify", color: "#1DB954" },
    { icon: "fa-apple", name: "Apple Music", color: "#FA2D48" },
    { icon: "fa-tiktok", name: "TikTok", color: "#00F2FE" },
    { icon: "fa-youtube", name: "YouTube Music", color: "#FF0000" },
    { icon: "fa-amazon", name: "Amazon Music", color: "#FF9900" },
    { icon: "fa-deezer", name: "Deezer", color: "#A238FF" },
    { icon: "fa-soundcloud", name: "SoundCloud", color: "#FF5500" },
    { icon: "fa-meta", name: "Instagram Reels", color: "#E1306C" },
  ];

  return (
    <div className="min-h-screen bg-[#0f111a] text-white selection:bg-brand-green selection:text-black overflow-x-hidden font-sans">
      {/* HERO SECTION */}
      <header className="relative w-full min-h-screen md:h-screen md:min-h-[850px] flex flex-col justify-between overflow-hidden">
        {/* Background Image (Editable dari Web CMS) */}
        <div className="absolute inset-0 z-0 bg-[#0f111a]">
          {dbData.heroBgImage && (
            <img
              src={dbData.heroBgImage}
              alt="Hero Background"
              className="w-full h-full object-cover object-center opacity-90 transition-opacity duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f111a]/85 via-[#0f111a]/40 to-[#0f111a]/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent"></div>
        </div>

        {/* Navigation - Transparan Tanpa Blur, Background Navbar Atas Gambar Upload CMS */}
        <nav
          className="fixed top-0 left-0 w-full z-50 px-4 sm:px-8 md:px-16 py-3.5 md:py-5 flex justify-between items-center glass-nav transition-all duration-300 border-b border-white/10"
          style={{
            backgroundImage: dbData.navBgImage
              ? `linear-gradient(to right, rgba(15, 17, 26, 0.75) 0%, rgba(15, 17, 26, 0.45) 50%, rgba(15, 17, 26, 0.75) 100%), url('${dbData.navBgImage}')`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "center 25%",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
          }}
        >
          <Link href="/" className="flex items-center space-x-1 group">
            <span className="text-2xl sm:text-3xl font-syncopate font-bold tracking-tighter text-white group-hover:text-brand-green transition-colors">
              1
            </span>
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white rounded-full flex items-center justify-center -ml-1 group-hover:border-brand-green transition-colors">
              <div className="w-2 h-2 bg-brand-green rounded-full shadow-[0_0_8px_#8fff00]"></div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-widest text-gray-300">
            <a
              href="#platform"
              className="hover:text-brand-green transition-colors py-1"
            >
              Platform
            </a>
            <a
              href="#artists"
              className="hover:text-brand-green transition-colors py-1"
            >
              Artis Kami
            </a>
            <a
              href="#testimonials"
              className="hover:text-brand-green transition-colors py-1"
            >
              Testimoni
            </a>
            <a
              href="#pricing"
              className="hover:text-brand-green transition-colors py-1"
            >
              Harga & Royalti
            </a>
            <a
              href="#features"
              className="hover:text-brand-green transition-colors py-1"
            >
              Fitur
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2.5">
              <Link
                href="/login"
                className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-white hover:text-brand-green transition-colors px-4 py-2 rounded-full border border-white/20 hover:border-brand-green/50 bg-black/30 backdrop-blur-sm"
              >
                Log Masuk
              </Link>
              <Link
                href="/register"
                className="text-[11px] sm:text-xs font-bold uppercase tracking-widest px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-brand-green text-black hover:bg-[#a6ff2e] transition-all shadow-[0_0_20px_rgba(143,255,0,0.4)] hover:shadow-[0_0_25px_rgba(143,255,0,0.6)] flex items-center space-x-1.5"
              >
                <span>Upload Master</span>
                <span>→</span>
              </Link>
            </div>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="md:hidden w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-brand-green" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Slide Bar Drawer */}
        <div
          className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-md md:hidden transition-opacity duration-300 ${
            mobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <aside
          className={`fixed top-0 right-0 z-50 w-72 max-w-[85vw] h-full bg-[#141622] border-l border-white/15 md:hidden flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ease-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-syncopate font-bold text-white">
                  1
                </span>
                <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center -ml-1"></div>
                <span className="ml-2 text-xs font-bold tracking-widest text-brand-green uppercase">
                  BREAKOUT.ID
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col space-y-2 text-xs font-semibold uppercase tracking-widest">
              <a
                href="#platform"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3.5 rounded-xl hover:bg-white/10 text-white hover:text-brand-green transition-colors flex items-center justify-between"
              >
                <span>Platform DSP</span>
                <span className="text-white/40">→</span>
              </a>
              <a
                href="#artists"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3.5 rounded-xl hover:bg-white/10 text-white hover:text-brand-green transition-colors flex items-center justify-between"
              >
                <span>Artis Kami</span>
                <span className="text-white/40">→</span>
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3.5 rounded-xl hover:bg-white/10 text-white hover:text-brand-green transition-colors flex items-center justify-between"
              >
                <span>Testimoni</span>
                <span className="text-white/40">→</span>
              </a>
              <a
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3.5 rounded-xl hover:bg-white/10 text-white hover:text-brand-green transition-colors flex items-center justify-between"
              >
                <span>Harga & Royalti</span>
                <span className="text-white/40">→</span>
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3.5 rounded-xl hover:bg-white/10 text-white hover:text-brand-green transition-colors flex items-center justify-between"
              >
                <span>Fitur Unggulan</span>
                <span className="text-white/40">→</span>
              </a>
            </nav>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block text-center text-xs font-semibold uppercase tracking-widest py-3 rounded-full border border-white/30 text-white hover:bg-white/15 hover:text-brand-green transition-all"
            >
              Log Masuk
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block text-center text-xs font-bold uppercase tracking-widest py-3 rounded-full bg-brand-green text-black hover:bg-[#a6ff2e] transition-all shadow-[0_0_15px_rgba(143,255,0,0.4)]"
            >
              Upload Master →
            </Link>
          </div>
        </aside>

        {/* Main Hero Content */}
        <main className="relative z-10 flex-grow flex flex-col justify-center px-5 sm:px-8 md:px-16 w-full max-w-7xl mx-auto pt-24 sm:pt-28 md:pt-16 pb-4 md:pb-0">
          <div className="max-w-2xl mt-0 md:mt-[-10vh]">
            <p className="text-xs sm:text-sm font-semibold tracking-wider sm:tracking-widest uppercase mb-3 md:mb-4 text-gray-300 min-h-[1.25rem]">
              <TypewriterText
                text={dbData.heroSubtitle}
                start={animStep >= 1}
                speed={90}
                onComplete={() => setAnimStep(2)}
              />
            </p>

            <div className="flex items-center text-[2.2rem] sm:text-4xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold uppercase tracking-tight sm:tracking-widest text-white font-syncopate leading-tight md:leading-none mb-4 md:mb-8 min-h-[2.5rem] md:min-h-[5rem]">
              <TypewriterText
                text={dbData.heroTitle1 || "BREAKOUT"}
                start={animStep >= 2}
                speed={160}
                onComplete={() => setAnimStep(5)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-2 md:mt-0">
              <Link
                href="/register"
                className="group relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border border-white/30 overflow-hidden flex items-center space-x-3 sm:space-x-4 hover:border-brand-green transition-all duration-300 bg-black/40 backdrop-blur-md"
              >
                <div className="absolute inset-0 bg-brand-green/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest relative z-10">
                  Discover
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black flex items-center justify-center relative z-10 group-hover:bg-brand-green transition-colors">
                  <span className="text-xs sm:text-sm">→</span>
                </div>
              </Link>

              <div className="flex items-center space-x-2.5 sm:space-x-3 text-xs sm:text-sm font-semibold tracking-widest uppercase text-gray-400">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-brand-green/40 flex items-center justify-center text-brand-green font-mono text-xs font-bold shadow-[0_0_12px_rgba(143,255,0,0.2)] bg-black/40">
                  10
                </div>
                <span>Connect</span>
              </div>
            </div>
          </div>
        </main>

        {/* Floating Cards (Bottom Left / Overlay) */}
        <section
          aria-label="Fitur Utama Breakout"
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 pb-8 md:pb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 max-w-3xl">
            {/* Card 1 */}
            <div className="glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between group hover:border-brand-green/30 transition-all duration-300">
              <div className="pr-3">
                <p className="text-xs text-gray-300 leading-snug">
                  <TypewriterText
                    text={dbData.card1Text}
                    start={animStep >= 5}
                    speed={85}
                  />
                </p>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-brand-green overflow-hidden flex-shrink-0 shadow-[0_0_15px_rgba(143,255,0,0.3)]">
                <img
                  src={dbData.card1Image}
                  alt="Card 1"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between group hover:border-brand-green/30 transition-all duration-300">
              <div className="pr-3">
                <h4 className="text-xs font-bold text-white mb-1">
                  <TypewriterText
                    text={dbData.card2Title}
                    start={animStep >= 5}
                    speed={85}
                    onComplete={() =>
                      setAnimStep((prev) => (prev < 6 ? 6 : prev))
                    }
                  />
                </h4>
                <p className="text-[11px] text-gray-400 leading-tight">
                  <TypewriterText
                    text={dbData.card2Desc}
                    start={animStep >= 6}
                    speed={85}
                  />
                </p>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-orange-500 overflow-hidden flex-shrink-0">
                <img
                  src={dbData.card2Image}
                  alt="Card 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between group hover:border-brand-green/30 transition-all duration-300">
              <div className="pr-3">
                <h4 className="text-xs font-bold text-white mb-1">
                  <TypewriterText
                    text={dbData.card3Title}
                    start={animStep >= 5}
                    speed={85}
                    onComplete={() =>
                      setAnimStep((prev) => (prev < 7 ? 7 : prev))
                    }
                  />
                </h4>
                <p className="text-[11px] text-gray-400 leading-tight">
                  <TypewriterText
                    text={dbData.card3Desc}
                    start={animStep >= 7}
                    speed={85}
                  />
                </p>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-blue-400 overflow-hidden flex-shrink-0">
                <img
                  src={dbData.card3Image}
                  alt="Card 3"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </header>

      {/* PLATFORM DSP CAROUSEL TICKER */}
      <section
        id="platform"
        className="py-12 border-y border-white/5 bg-black/40 overflow-hidden relative"
      >
        <div className="max-w-7xl mx-auto px-6 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-brand-green uppercase">
              Global Music Ecosystem
            </span>
            <h3 className="text-xl md:text-2xl font-bold font-syncopate text-white mt-1">
              RILIS KE PLATFORM DSP TERKEMUKA DUNIA
            </h3>
          </div>
          <div ref={counterRef} className="flex items-center space-x-3">
            <span className="text-3xl md:text-4xl font-extrabold font-mono text-brand-green">
              {storeCount}+
            </span>
            <span className="text-xs text-gray-400 uppercase tracking-wider leading-tight">
              Platform &<br />Stores Global
            </span>
          </div>
        </div>

        <div className="relative w-full overflow-hidden flex whitespace-nowrap py-2">
          {/* Edge Fade Masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#0f111a] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#0f111a] to-transparent z-10" />

          <div className="ticker-track animate-platform-marquee flex items-center space-x-6 sm:space-x-8 py-3">
            {[...DSP_ICONS, ...DSP_ICONS, ...DSP_ICONS, ...DSP_ICONS].map((dsp, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-green/40 transition-colors shrink-0 shadow-sm"
              >
                <i
                  className={`fa-brands ${dsp.icon} text-2xl`}
                  style={{ color: dsp.color }}
                ></i>
                <span className="text-sm font-semibold text-gray-200">
                  {dsp.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: ARTIS KAMI */}
      <section id="artists" className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-brand-green uppercase">
              Roster & Creator Showcase
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-syncopate text-white mt-2">
              SPOTLIGHT <span className="text-brand-green">ARTIS INDIE</span>
            </h2>
            <p className="text-gray-400 text-sm mt-3 max-w-xl">
              Karya-karya autentik yang diproduksi dari kamar, didistribusikan ke panggung global bersama BREAKOUT.ID.
            </p>
          </div>
          <Link
            href="/register"
            className="self-start md:self-auto px-6 py-3 rounded-full border border-white/20 hover:border-brand-green hover:text-brand-green text-xs font-bold tracking-wider uppercase transition-colors"
          >
            Gabung Menjadi Artis →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(dbData.artists || []).map((artist) => (
            <div
              key={artist.id}
              className="glass-card rounded-3xl p-6 group hover:border-brand-green/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-56 rounded-2xl overflow-hidden mb-5 relative bg-white/5">
                  <img
                    src={artist.photo}
                    alt={artist.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        DEFAULT_LANDING_DATA.card1Image;
                    }}
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold font-syncopate text-white group-hover:text-brand-green transition-colors">
                    {artist.name}
                  </h3>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                  {artist.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider">
                    Monthly Streams
                  </span>
                  <span className="font-bold text-white font-syncopate">
                    {artist.monthlyListeners}
                  </span>
                </div>
                {artist.spotifyUrl ? (
                  <a
                    href={artist.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#1DB954]/20 hover:bg-[#1DB954] text-[#1DB954] hover:text-black font-semibold text-xs transition-colors"
                  >
                    <i className="fa-brands fa-spotify"></i>
                    <span>Profil DSP</span>
                  </a>
                ) : (
                  <span className="text-gray-500 text-xs">Verified Artist</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: TESTIMONI MUSISI */}
      <section
        id="testimonials"
        className="py-24 px-6 md:px-16 bg-black/30 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-brand-green uppercase">
              Suara Komunitas
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-syncopate text-white mt-2">
              KATA <span className="text-brand-green">MUSISI</span> KAMI
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Kisah nyata musisi independen yang mempercayakan royalti dan karya mereka kepada platform BREAKOUT.ID.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(dbData.testimonials || []).map((t) => (
              <div
                key={t.id}
                className="glass-card rounded-3xl p-8 flex flex-col justify-between hover:border-brand-green/30 transition-all"
              >
                <div>
                  <div className="flex items-center space-x-1 text-brand-green text-xs mb-4">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-sm text-gray-300 italic leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-syncopate">
                      {t.name}
                    </h4>
                    <p className="text-xs text-brand-green">{t.artistName}</p>
                    <p className="text-[10px] text-gray-500">{t.streams}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: PRICING & ROYALTY SPLIT */}
      <section id="pricing" className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-green uppercase">
            Transparansi Royalti 100%
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-syncopate text-white mt-2">
            PILIHAN <span className="text-brand-green">DISTRIBUSI</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            Tanpa biaya tersembunyi. Pantau setiap rupiah royalti Anda langsung dari dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan 1: Single Drop */}
          <div className="glass-card rounded-3xl p-8 border border-white/10 flex flex-col justify-between hover:border-white/30 transition-all">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Single / EP Release
              </span>
              <h3 className="text-2xl font-bold font-syncopate text-white mt-2">
                STARTER ARTIST
              </h3>
              <p className="text-xs text-gray-400 mt-2 mb-6">
                Cocok untuk musisi yang baru memulai perjalanan merilis lagu secara profesional.
              </p>
              <div className="text-4xl font-extrabold font-mono text-white mb-6">
                Rp 0{" "}
                <span className="text-xs font-normal text-gray-400">
                  / Gratis Selamanya
                </span>
              </div>
              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-center space-x-2">
                  <span className="text-brand-green">✓</span>
                  <span>Distribusi ke 150+ platform musik</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-brand-green">✓</span>
                  <span>Royalti 85% untuk musisi</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-brand-green">✓</span>
                  <span>Laporan analitik bulanan</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-brand-green">✓</span>
                  <span>Pencairan via Transfer Bank BCA, Mandiri, E-Wallet</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 block text-center py-3.5 rounded-full border border-white/30 hover:border-brand-green text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Mulai Gratis
            </Link>
          </div>

          {/* Plan 2: Pro Label */}
          <div className="glass-card rounded-3xl p-8 border-2 border-brand-green/60 relative flex flex-col justify-between bg-brand-green/[0.03] shadow-[0_0_40px_rgba(143,255,0,0.1)]">
            <div className="absolute -top-3.5 right-6 px-4 py-1 rounded-full bg-brand-green text-black text-[10px] font-extrabold uppercase tracking-widest shadow-md">
              Paling Populer
            </div>
            <div>
              <span className="text-xs font-bold text-brand-green uppercase tracking-widest">
                Full Album & Unlimited
              </span>
              <h3 className="text-2xl font-bold font-syncopate text-white mt-2">
                PRO CREATOR
              </h3>
              <p className="text-xs text-gray-400 mt-2 mb-6">
                Untuk musisi aktif, produser, dan label indie yang merilis karya secara rutin.
              </p>
              <div className="text-4xl font-extrabold font-mono text-brand-green mb-6">
                100%{" "}
                <span className="text-xs font-normal text-gray-300">
                  Royalti Penuh Milik Anda
                </span>
              </div>
              <ul className="space-y-3 text-xs text-gray-200">
                <li className="flex items-center space-x-2">
                  <span className="text-brand-green">✓</span>
                  <span>Rilis tanpa batas (Unlimited Single & Album)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-brand-green">✓</span>
                  <span>100% Royalti tanpa potongan platform</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-brand-green">✓</span>
                  <span>ISRC & UPC resmi internasional gratis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-brand-green">✓</span>
                  <span>Prioritas Moderasi & Rilis Cepat (48 Jam)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-brand-green">✓</span>
                  <span>Fitur Split Royalti Otomatis Antar Kolaborator</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 block text-center py-3.5 rounded-full bg-brand-green text-black hover:bg-[#a6ff2e] text-xs font-extrabold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(143,255,0,0.4)]"
            >
              Daftar Pro Creator →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-6 md:px-16 bg-black/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-syncopate font-bold tracking-tighter text-gray-500">
              BREAKOUT
            </span>
          </div>

          <div className="flex items-center space-x-8 text-xs text-gray-400">
            <a href="#platform" className="hover:text-white transition-colors">
              Platform
            </a>
            <a href="#artists" className="hover:text-white transition-colors">
              Artis
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Harga
            </a>
            <Link href="/login" className="hover:text-white transition-colors">
              Login Artis
            </Link>
          </div>
        </div>
        <div className="text-center text-xs text-gray-700 mt-8">
          &copy; 2026 BREAKOUT.ID Music Distribution. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

