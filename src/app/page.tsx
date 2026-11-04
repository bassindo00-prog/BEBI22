"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

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

const DEFAULT_LANDING_DATA: LandingPageData = {
  id: "default",
  heroSubtitle: "Global Reach By BREAKOUT.ID",
  heroTitle1: "BREAKOUT",
  heroTitle2: "ID",
  heroBgImage: "/6293920186406475229_121.jpg",
  navBgImage: "/header-bg.jpg",
  storesCount: 150,
  card1Text: "We reshape the future of music distribution and artist services as a platform (MaaS).",
  card1Image: "/6293920186406475218_120.jpg",
  card2Title: "Driven By A Passion.",
  card2Desc: "Pushing the boundaries of what's possible in the global audio realm.",
  card2Image: "/6293920186406475218_120.jpg",
  card3Title: "Distribution Solutions.",
  card3Desc: "Tailored to your unique sound crafting new sonic landscapes.",
  card3Image: "/6293920186406475218_120.jpg",
  artists: [
    {
      id: "art-1",
      name: "Basstrack Indo",
      genre: "Phonk / Bass Nusantara",
      photo: "/6293920186406475218_120.jpg",
      bio: "Pelopor sound bassboosted nusantara dengan 20M+ streams global di DSP.",
      monthlyListeners: "1.8M",
      topTrack: "Midnight Drift Vol. 2",
      spotifyUrl: "https://open.spotify.com",
    },
    {
      id: "art-2",
      name: "Sarah Viola",
      genre: "Indie Pop / Cinematic",
      photo: "/header-bg.jpg",
      bio: "Vokalis & produser independen, rilis multi-platform global via BREAKOUT.ID.",
      monthlyListeners: "920K",
      topTrack: "Lavendera Sky",
      spotifyUrl: "https://open.spotify.com",
    },
    {
      id: "art-3",
      name: "Krowdy Pulse",
      genre: "Cyberpunk Hip-Hop",
      photo: "/6293920186406475229_121.jpg",
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
      avatar: "/6293920186406475218_120.jpg",
      streams: "15.4M Streams",
    },
    {
      id: "testi-2",
      name: "Maya Clarissa",
      artistName: "Sarah Viola",
      role: "Solo Artist & Songwriter",
      quote:
        "Bikin lagu di kamar malam hari, upload master pagi, dalam 48 jam udah live di Spotify, Apple Music & TikTok. Dashboard super clean!",
      avatar: "/header-bg.jpg",
      streams: "4.2M Streams",
    },
    {
      id: "testi-3",
      name: "Denny 'Krowdy'",
      artistName: "Krowdy Pulse",
      role: "Hip-Hop / Beatmaker",
      quote:
        "Dukungan agregator lokal dengan standar internasional. Fitur analitik DSP dan split royaltinya ngebantu banget kolaborasi tim.",
      avatar: "/6293920186406475229_121.jpg",
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
// KOMPONEN UTAMA (Next.js Landing Page)
// ============================================================================
export default function App() {
  const [dbData, setDbData] = useState<LandingPageData>(DEFAULT_LANDING_DATA);
  const [loaded, setLoaded] = useState(false);

  // State urutan animasi Header
  const [animStep, setAnimStep] = useState(0);

  // State untuk Counter 150+
  const [storeCount, setStoreCount] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);

  // 1. Fetch data dari CMS Database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/cms/landing", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json?.data) {
            setDbData(json.data);
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
      try {
        if (document.head.contains(linkFA)) document.head.removeChild(linkFA);
        if (document.head.contains(linkFonts))
          document.head.removeChild(linkFonts);
      } catch (e) {
        // Safe unmount
      }
    };
  }, []);

  // 3. Logic untuk Animasi Counter (Intersection Observer)
  useEffect(() => {
    if (!loaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number | null = null;
          const duration = 2000;
          const target = dbData.storesCount || 150;

          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);

            setStoreCount(Math.floor(easeOutProgress * target));

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setStoreCount(target);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [loaded, dbData.storesCount]);

  return (
    <div className="font-sans antialiased text-white bg-[#0f111a] overflow-x-hidden selection:bg-brand-green selection:text-black">
      {/* INJECT CUSTOM CSS: TRANSPARAN TANPA BLUR */}
      <style>{`
        body { font-family: 'Inter', sans-serif; }
        .font-syncopate { font-family: 'Syncopate', sans-serif; }
        .glass-card {
            background: rgba(255, 255, 255, 0.04);
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .glass-nav {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
        }
        .pagination-dot {
            width: 8px; height: 8px; border-radius: 50%;
            border: 1px solid rgba(255,255,255,0.5);
            margin: 12px 0; transition: all 0.3s ease; cursor: pointer;
        }
        .pagination-dot.active {
            background-color: white; border-color: white; transform: scale(1.2);
        }
        .glow-green { box-shadow: 0 0 30px rgba(143, 255, 0, 0.5); border: 2px solid #8fff00; }
        .glow-orange { box-shadow: 0 0 30px rgba(255, 87, 34, 0.5); border: 2px solid #ff5722; }
        .glow-blue { box-shadow: 0 0 30px rgba(33, 150, 243, 0.5); border: 2px solid #2196f3; }
        .text-brand-green { color: #8fff00; }
        .bg-brand-green { background-color: #8fff00; }
        .border-brand-green { border-color: #8fff00; }
        .filter-orange { filter: hue-rotate(-60deg) saturate(1.5); }
        .filter-blue { filter: hue-rotate(120deg) saturate(1.5); }
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-scroll { animation: scroll 25s linear infinite; }
        .animate-scroll:hover { animation-play-state: paused; }
        .typing-cursor::after {
            content: '|'; margin-left: 4px; font-weight: 300;
            animation: blink 1s step-end infinite;
        }
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
      `}</style>

      {/* HERO SECTION */}
      <header className="relative w-full min-h-screen md:h-screen md:min-h-[850px] flex flex-col justify-between overflow-hidden">
        {/* Background Image (Editable dari Web CMS) */}
        <div className="absolute inset-0 z-0">
          <img
            src={dbData.heroBgImage || "/6293920186406475229_121.jpg"}
            alt="Hero Background"
            className="w-full h-full object-cover object-center opacity-90 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f111a]/85 via-[#0f111a]/40 to-[#0f111a]/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f111a] via-transparent to-transparent"></div>
        </div>

        {/* Navigation - Transparan Tanpa Blur, Background Navbar Atas Gambar Upload CMS */}
        <nav
          className="fixed top-0 left-0 w-full z-50 px-4 sm:px-8 md:px-16 py-3.5 md:py-5 flex justify-between items-center glass-nav transition-all duration-300 border-b border-white/10"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(15, 17, 26, 0.75) 0%, rgba(15, 17, 26, 0.45) 50%, rgba(15, 17, 26, 0.75) 100%), url('${
              dbData.navBgImage || "/header-bg.jpg"
            }')`,
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
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white rounded-full flex items-center justify-center -ml-1"></div>
          </Link>

          <div className="hidden md:flex space-x-10 text-xs font-semibold tracking-widest uppercase">
            <a href="#" className="hover:text-brand-green transition-colors">
              Home
            </a>
            <a href="#stores" className="hover:text-brand-green transition-colors">
              Jaringan DSP
            </a>
            <a href="#artists" className="hover:text-brand-green transition-colors">
              Artis Kami
            </a>
            <a href="#testimonials" className="hover:text-brand-green transition-colors">
              Testimoni
            </a>
            <a href="#features" className="hover:text-brand-green transition-colors">
              Fitur
            </a>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/login"
              className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/30 hover:bg-white/15 hover:text-brand-green transition-all"
            >
              Log Masuk
            </Link>
            <Link
              href="/register"
              className="text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-brand-green text-black hover:bg-[#a6ff2e] transition-all shadow-[0_0_15px_rgba(143,255,0,0.4)]"
            >
              Upload Master →
            </Link>
          </div>
        </nav>

        {/* Main Hero Content */}
        <main className="relative z-10 flex-grow flex flex-col justify-center px-5 sm:px-8 md:px-16 w-full max-w-7xl mx-auto pt-24 sm:pt-28 md:pt-16 pb-4 md:pb-0">
          <div className="max-w-2xl mt-0 md:mt-[-10vh]">
            {/* Subtitle */}
            <p className="text-xs sm:text-sm font-semibold tracking-wider sm:tracking-widest uppercase mb-3 md:mb-4 text-gray-300 min-h-[1.25rem]">
              <TypewriterText
                text={dbData.heroSubtitle}
                start={animStep >= 1}
                speed={90}
                onComplete={() => setAnimStep(2)}
              />
            </p>

            {/* Big Title */}
            <div className="flex flex-wrap md:flex-nowrap items-center text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.5rem] font-bold uppercase tracking-tight sm:tracking-widest text-white font-syncopate leading-tight md:leading-none mb-6 md:mb-8 min-h-[3rem] md:min-h-[5rem]">
              <TypewriterText
                text={dbData.heroTitle1}
                start={animStep >= 2}
                speed={160}
                onComplete={() => {
                  setAnimStep(3);
                  setTimeout(() => setAnimStep(4), 280);
                }}
              />

              {/* Dot - Animates in at Step 3 */}
              <div
                className={`w-7 h-7 sm:w-10 sm:h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-brand-green flex items-center justify-center mx-1.5 sm:mx-3 md:mx-4 text-black text-xl sm:text-2xl md:text-5xl font-bold shadow-[0_0_30px_rgba(143,255,0,0.4)] pb-1.5 sm:pb-3 md:pb-5 transition-all duration-500 ease-out ${
                  animStep >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-50"
                }`}
              >
                .
              </div>

              <TypewriterText
                text={dbData.heroTitle2}
                start={animStep >= 4}
                speed={160}
                onComplete={() => setAnimStep(5)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-2 md:mt-0">
              <Link
                href="/register"
                className="flex items-center space-x-3 sm:space-x-4 border border-white/40 rounded-full px-2 py-1.5 sm:py-2 hover:bg-white/10 transition-colors group"
              >
                <span className="pl-3 sm:pl-4 text-xs sm:text-sm font-semibold tracking-wider">
                  Discover
                </span>
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center text-black group-hover:bg-brand-green transition-colors">
                  <i className="fas fa-arrow-right text-xs sm:text-sm"></i>
                </div>
              </Link>
              <Link
                href="/login"
                className="flex items-center space-x-2.5 sm:space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-brand-green rounded-full flex items-center justify-center text-black shadow-[0_0_15px_rgba(143,255,0,0.5)]">
                  <span className="text-[10px] sm:text-xs font-bold font-syncopate">10</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-wider">Connect</span>
              </Link>
            </div>
          </div>
        </main>

        {/* Right Side Pagination Dots */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 hidden md:flex flex-col items-center">
          <div className="pagination-dot active"></div>
          <div className="pagination-dot"></div>
          <div className="pagination-dot"></div>
          <div className="pagination-dot"></div>
          <div className="pagination-dot"></div>
        </div>

        {/* Bottom Glass Cards (3 Columns) — Relative on Mobile (No Overlap), Absolute on Desktop */}
        <div className="relative md:absolute md:bottom-8 left-0 w-full z-20 px-4 sm:px-8 md:px-16 mt-8 md:mt-0 pb-10 md:pb-0">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Card 1 (Green) */}
            <div className="glass-card rounded-3xl p-4 sm:p-5 flex items-center justify-between relative group hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-3/5 sm:w-1/2 pr-3 sm:pr-4">
                <p className="text-[10px] md:text-xs text-gray-300 leading-relaxed font-medium min-h-[3.5rem] sm:min-h-[4rem]">
                  <TypewriterText
                    text={dbData.card1Text}
                    start={animStep >= 5}
                    speed={85}
                  />
                </p>
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden glow-green flex-shrink-0">
                <img
                  src={dbData.card1Image || "/6293920186406475218_120.jpg"}
                  alt="Feature 1"
                  className="w-full h-full object-cover object-top transform scale-150"
                />
              </div>
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                <i className="fas fa-arrow-up-right-from-square text-[10px]"></i>
              </div>
            </div>

            {/* Card 2 (Orange) */}
            <div className="glass-card rounded-3xl p-4 sm:p-5 flex items-center justify-between relative group hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-3/5 sm:w-1/2 pr-3 sm:pr-4 flex flex-col justify-start">
                <div className="text-[10px] md:text-xs text-gray-300 leading-relaxed font-medium min-h-[3.5rem] sm:min-h-[4rem]">
                  <strong className="text-white font-semibold">
                    <TypewriterText
                      text={dbData.card2Title}
                      start={animStep >= 5}
                      speed={85}
                      onComplete={() => setAnimStep((prev) => (prev < 6 ? 6 : prev))}
                    />
                  </strong>
                  <br />
                  <TypewriterText
                    text={dbData.card2Desc}
                    start={animStep >= 6}
                    speed={85}
                  />
                </div>
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden glow-orange flex-shrink-0">
                <img
                  src={dbData.card2Image || "/6293920186406475218_120.jpg"}
                  alt="Feature 2"
                  className="w-full h-full object-cover object-top transform scale-150 filter-orange"
                />
              </div>
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                <i className="fas fa-arrow-up-right-from-square text-[10px]"></i>
              </div>
            </div>

            {/* Card 3 (Blue) */}
            <div className="glass-card rounded-3xl p-4 sm:p-5 flex items-center justify-between relative group hover:bg-white/10 transition-all cursor-pointer">
              <div className="w-3/5 sm:w-1/2 pr-3 sm:pr-4 flex flex-col justify-start">
                <div className="text-[10px] md:text-xs text-gray-300 leading-relaxed font-medium min-h-[3.5rem] sm:min-h-[4rem]">
                  <strong className="text-white font-semibold">
                    <TypewriterText
                      text={dbData.card3Title}
                      start={animStep >= 5}
                      speed={85}
                      onComplete={() => setAnimStep((prev) => (prev < 7 ? 7 : prev))}
                    />
                  </strong>
                  <br />
                  <TypewriterText
                    text={dbData.card3Desc}
                    start={animStep >= 7}
                    speed={85}
                  />
                </div>
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden glow-blue flex-shrink-0">
                <img
                  src={dbData.card3Image || "/6293920186406475218_120.jpg"}
                  alt="Feature 3"
                  className="w-full h-full object-cover object-top transform scale-150 filter-blue"
                />
              </div>
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                <i className="fas fa-arrow-up-right-from-square text-[10px]"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SCROLLABLE CONTENT */}

      {/* Logos / Platforms Section */}
      <section
        id="stores"
        className="py-16 border-t border-white/10 bg-[#0b0c10] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16" ref={counterRef}>
          <p className="text-center text-gray-400 text-sm font-semibold tracking-widest uppercase mb-10">
            Distribute your tracks to{" "}
            <span className="text-brand-green text-xl font-syncopate font-bold mx-1">
              {storeCount}
            </span>
            + stores worldwide
          </p>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative w-full flex overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#0b0c10] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#0b0c10] to-transparent z-10 pointer-events-none"></div>

          <div className="flex w-max animate-scroll">
            {/* Group 1 */}
            <div className="flex items-center space-x-12 md:space-x-20 px-6 md:px-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <i className="fab fa-spotify text-5xl hover:text-[#1DB954] transition-colors cursor-pointer"></i>
              <i className="fab fa-apple text-5xl hover:text-white transition-colors cursor-pointer"></i>
              <i className="fab fa-soundcloud text-5xl hover:text-[#ff5500] transition-colors cursor-pointer"></i>
              <i className="fab fa-youtube text-5xl hover:text-[#FF0000] transition-colors cursor-pointer"></i>
              <i className="fab fa-tiktok text-5xl hover:text-[#00f2fe] transition-colors cursor-pointer"></i>
              <i className="fab fa-amazon text-5xl hover:text-[#FF9900] transition-colors cursor-pointer"></i>
              <i className="fab fa-napster text-5xl hover:text-white transition-colors cursor-pointer"></i>
              <i className="fab fa-deezer text-5xl hover:text-[#00C7F2] transition-colors cursor-pointer"></i>
            </div>
            {/* Group 2 (Duplicate) */}
            <div className="flex items-center space-x-12 md:space-x-20 px-6 md:px-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <i className="fab fa-spotify text-5xl hover:text-[#1DB954] transition-colors cursor-pointer"></i>
              <i className="fab fa-apple text-5xl hover:text-white transition-colors cursor-pointer"></i>
              <i className="fab fa-soundcloud text-5xl hover:text-[#ff5500] transition-colors cursor-pointer"></i>
              <i className="fab fa-youtube text-5xl hover:text-[#FF0000] transition-colors cursor-pointer"></i>
              <i className="fab fa-tiktok text-5xl hover:text-[#00f2fe] transition-colors cursor-pointer"></i>
              <i className="fab fa-amazon text-5xl hover:text-[#FF9900] transition-colors cursor-pointer"></i>
              <i className="fab fa-napster text-5xl hover:text-white transition-colors cursor-pointer"></i>
              <i className="fab fa-deezer text-5xl hover:text-[#00C7F2] transition-colors cursor-pointer"></i>
            </div>
          </div>
        </div>
      </section>

      {/* SEKSI BARU: ROSTER ARTIS & PROFIL ARTIS (Bisa diedit Admin dari Web CMS) */}
      <section id="artists" className="py-24 px-8 md:px-16 bg-[#0f111a] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-semibold uppercase tracking-wider mb-3">
                <i className="fas fa-users-viewfinder"></i> Roster Musisi
              </div>
              <h2 className="text-3xl md:text-5xl font-syncopate font-bold">
                SPOTLIGHT <span className="text-brand-green">ARTIS INDIE</span>
              </h2>
              <p className="text-gray-400 text-sm mt-3 max-w-xl">
                Karya-karya autentik yang diproduksi dari kamar, didistribusikan ke panggung global bersama BREAKOUT.ID.
              </p>
            </div>
            <Link
              href="/register"
              className="text-xs font-semibold text-brand-green hover:underline flex items-center gap-2 uppercase tracking-widest"
            >
              Gabung Jadi Artis Terdaftar <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          {/* Grid Artis yang di-manage oleh Admin di CMS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dbData.artists.map((artist) => (
              <div
                key={artist.id}
                className="glass-card rounded-3xl p-6 group hover:border-brand-green/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-56 rounded-2xl overflow-hidden mb-5 relative bg-white/5">
                    <img
                      src={artist.photo || "/6293920186406475218_120.jpg"}
                      alt={artist.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 border border-white/20 text-[11px] font-semibold text-brand-green">
                      {artist.genre}
                    </div>
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
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-brand-green hover:text-black text-white font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <i className="fab fa-spotify text-sm"></i>
                      <span>Profil DSP</span>
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEKSI BARU: KATA MUSISI & TESTIMONI (Bisa diedit Admin dari Web CMS) */}
      <section
        id="testimonials"
        className="py-24 px-8 md:px-16 bg-[#0b0c10] border-t border-white/5 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-semibold uppercase tracking-wider mb-3">
              <i className="fas fa-comment-dots"></i> Suara Musisi
            </div>
            <h2 className="text-3xl md:text-5xl font-syncopate font-bold mb-4">
              KATA <span className="text-brand-green">MUSISI</span> KAMI
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Kisah nyata musisi independen yang mempercayakan royalti dan karya mereka kepada platform BREAKOUT.ID.
            </p>
          </div>

          {/* Grid Testimoni */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dbData.testimonials.map((testi) => (
              <div
                key={testi.id}
                className="glass-card rounded-3xl p-8 relative flex flex-col justify-between hover:border-brand-green/30 transition-all"
              >
                <div>
                  {/* Rating Stars & Streams Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex text-brand-green text-xs space-x-1">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-brand-green/15 text-brand-green border border-brand-green/30">
                      {testi.streams}
                    </span>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed italic mb-8">
                    "{testi.quote}"
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-brand-green/50 flex-shrink-0 bg-white/5">
                    <img
                      src={testi.avatar || "/6293920186406475218_120.jpg"}
                      alt={testi.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="leading-tight">
                    <h4 className="font-bold text-white text-sm">{testi.name}</h4>
                    <p className="text-[11px] text-brand-green font-medium">
                      {testi.artistName}
                    </p>
                    <p className="text-[10px] text-gray-500">{testi.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 px-8 md:px-16 bg-[#0f111a] relative overflow-hidden border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-syncopate font-bold mb-6">
              AMPLIFY YOUR <span className="text-brand-green">SOUND</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Keep 100% of your rights and royalties. We provide the
              infrastructure, analytics, and global reach for independent
              artists and labels to thrive in the modern music industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-3xl hover:border-brand-green/50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-brand-green/20 flex items-center justify-center mb-6">
                <i className="fas fa-bolt text-brand-green text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 font-syncopate text-white">
                Fast Delivery
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Get your music on Spotify, Apple Music, and TikTok in record
                time. Our automated pipeline ensures your releases hit the
                stores exactly when you want them to.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:border-brand-green/50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-brand-green/20 flex items-center justify-center mb-6">
                <i className="fas fa-chart-pie text-brand-green text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 font-syncopate text-white">
                Deep Analytics
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Track your streams, listeners, and revenue in real-time.
                Understand your audience demographics and optimize your
                promotional strategies effectively.
              </p>
            </div>

            <div className="glass-card p-8 rounded-3xl hover:border-brand-green/50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-brand-green/20 flex items-center justify-center mb-6">
                <i className="fas fa-wallet text-brand-green text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-4 font-syncopate text-white">
                100% Royalties
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your music, your money. We don't take a cut of your earnings.
                Enjoy automated split payments to collaborators straight from
                your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="py-24 px-8 md:px-16 bg-[#0b0c10] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center glass-card p-12 md:p-20 rounded-[3rem] border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 to-transparent pointer-events-none"></div>
          <h2 className="text-3xl md:text-5xl font-syncopate font-bold mb-6 relative z-10">
            READY TO <span className="text-white">DROP?</span>
          </h2>
          <p className="text-gray-400 mb-10 relative z-10 max-w-xl mx-auto">
            Join thousands of independent artists who trust BREAKOUT.ID to
            distribute their music to the world.
          </p>
          <Link
            href="/register"
            className="inline-block relative z-10 bg-brand-green text-black font-bold py-4 px-10 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(143,255,0,0.3)]"
          >
            Start Distributing Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 md:px-16 border-t border-white/5 bg-[#0f111a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-syncopate font-bold tracking-tighter text-gray-500">
              BREAKOUT
            </span>
            <div className="w-3 h-3 bg-brand-green rounded-full mx-1 shadow-[0_0_10px_rgba(143,255,0,0.4)]"></div>
            <span className="text-2xl font-syncopate font-bold tracking-tighter text-gray-500">
              ID
            </span>
          </div>

          <div className="flex space-x-8 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Support
            </a>
            <a href="#artists" className="hover:text-white transition-colors">
              Artists
            </a>
          </div>

          <div className="flex space-x-4 text-gray-500">
            <a href="#" className="hover:text-brand-green transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-brand-green transition-colors">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="hover:text-brand-green transition-colors">
              <i className="fab fa-discord"></i>
            </a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-700 mt-8">
          &copy; 2026 BREAKOUT.ID Music Distribution. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
