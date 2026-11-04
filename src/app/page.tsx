"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Disc3,
  Globe,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Waves,
  Wallet,
  Radio,
  CheckCircle2,
  Play,
  ChevronDown,
} from "lucide-react";

const PLATFORMS_ROW_1 = [
  { name: "Spotify", tag: "DSP • Lossless", share: "71% Share", dot: "#1ED760" },
  { name: "Apple Music", tag: "Spatial Audio • Dolby", share: "24-bit/192kHz", dot: "#FA243C" },
  { name: "TikTok Sound", tag: "Viral Clips • Sync", share: "Instant Monetize", dot: "#00F2FE" },
  { name: "YouTube Music", tag: "Content ID • Official", share: "Global Rights", dot: "#FF0000" },
  { name: "Tidal HiFi", tag: "Master Quality", share: "Direct Artist Payout", dot: "#c8f560" },
  { name: "Amazon Music", tag: "Ultra HD • Alexa", share: "Worldwide", dot: "#00A8E1" },
  { name: "Deezer", tag: "FLAC Streaming", share: "180+ Countries", dot: "#A238FF" },
  { name: "SoundCloud", tag: "Fan-Powered Royalties", share: "Direct Sync", dot: "#FF5500" },
  { name: "Instagram & Meta", tag: "Reels • Stories Library", share: "Auto-Claim", dot: "#E1306C" },
  { name: "Beatport", tag: "Electronic • Club Charts", share: "Lossless WAV", dot: "#01FF95" },
];

const PLATFORMS_ROW_2 = [
  { name: "NetEase Cloud", tag: "Asia Pacific • Licensing", share: "Verified", dot: "#E60026" },
  { name: "Tencent QQ Music", tag: "Mainland Distribution", share: "Direct Deal", dot: "#FFD700" },
  { name: "Anghami", tag: "MENA Region DSP", share: "Active", dot: "#9b5de5" },
  { name: "Boomplay", tag: "Africa Music Network", share: "Fast Sync", dot: "#00f5d4" },
  { name: "JioSaavn", tag: "South Asia Streaming", share: "Hi-Res", dot: "#2ec4b6" },
  { name: "Pandora", tag: "US Radio & On-Demand", share: "Licensed", dot: "#3a86ff" },
  { name: "Shazam", tag: "Audio Fingerprint ID", share: "Real-Time", dot: "#0096c7" },
  { name: "Peloton Music", tag: "Fitness Sync Catalog", share: "Royalty Pool", dot: "#ff006e" },
  { name: "Roblox Audio", tag: "Metaverse Licensing", share: "Gaming Sync", dot: "#c8f560" },
  { name: "Bandcamp", tag: "Direct-to-Fan Store", share: "100% Control", dot: "#4cc9f0" },
];

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Intersection observer for smooth scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-6");
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".scroll-reveal").forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white selection:bg-[#c8f560] selection:text-[#312042] relative overflow-x-hidden">
      {/* Subtle architectural grid lines — 100% transparent, no blur */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-20">
        <div className="h-full w-full grid grid-cols-4 md:grid-cols-6 divide-x divide-white/15" />
      </div>

      {/* Top Navigation — Normal Readable Typography */}
      <header className="sticky top-0 z-40 w-full bg-[#74729f]/40 backdrop-blur-md border-b border-white/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-transparent group-hover:scale-105 transition-transform">
              <div className="w-3.5 h-5 rounded-full border-2 border-white" />
            </div>
            <span className="text-base font-bold tracking-wider uppercase text-white">
              HERMES <span className="text-white/70 font-normal">/ LUXOA</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-white/90">
            <a href="#platforms" className="hover:text-[#c8f560] transition-colors">
              Platforms
            </a>
            <a href="#architecture" className="hover:text-[#c8f560] transition-colors">
              Telemetry
            </a>
            <a href="#royalties" className="hover:text-[#c8f560] transition-colors">
              Royalties
            </a>
            <Link href="/login" className="hover:text-[#c8f560] transition-colors">
              Portal Access
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-full border border-white/40 bg-white/10 text-xs sm:text-sm font-semibold tracking-wide hover:border-white hover:text-[#c8f560] transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 sm:px-5 py-2 rounded-full border border-[#312042] bg-[#312042] text-white text-xs sm:text-sm font-semibold tracking-wide hover:bg-[#422c58] transition-all flex items-center gap-1.5 shadow"
            >
              <span>Register</span>
              <ArrowUpRight className="w-4 h-4 text-[#c8f560]" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION — Normal & Comfortable Font Sizes */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-14 md:pt-20 md:pb-20">
        <div
          className="flex flex-col items-start max-w-3xl transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${scrollY * 0.06}px)` }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/35 bg-white/10 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#c8f560] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white">
              HERMES DISTRIBUTION ENGINE v4.2 • ZERO-LATENCY ROYALTY SPLIT
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.18] text-white mb-6">
            Global audio distribution &{" "}
            <span className="text-[#c8f560]">real-time royalty</span>{" "}
            intelligence for independent artists.
          </h1>

          <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mb-8 font-normal">
            Deliver lossless 24-bit/192kHz masters to Spotify, Apple Music, TikTok, and 150+
            streaming ecosystems simultaneously. Track every stream, territory heatmap, and withdraw
            instant royalties to BCA, Mandiri, OVO, GoPay, or DANA with 100% ownership.
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="/login"
              className="px-6 py-3 rounded-full bg-[#312042] text-white text-sm font-semibold tracking-wide uppercase flex items-center gap-2 hover:bg-[#412b57] transition-all shadow-md hover:scale-105"
            >
              <span>Launch Portal</span>
              <ArrowUpRight className="w-4 h-4 text-[#c8f560]" />
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 rounded-full border border-white/50 bg-white/10 text-white text-sm font-semibold tracking-wide hover:border-[#c8f560] hover:text-[#c8f560] transition-all"
            >
              Create Account
            </Link>
          </div>

          {/* Metric Stats Strip — Normal Sizes */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/25 w-full">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/75">
                Daily Streams
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">3,457K+</p>
              <span className="text-xs font-semibold text-[#c8f560]">+12.4% vs yesterday</span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/75">
                Active DSP Nodes
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">158 Global</p>
              <span className="text-xs text-white/80">Spotify • Apple • TikTok</span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/75">
                Artist Royalty Keep
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">100.0%</p>
              <span className="text-xs font-semibold text-[#c8f560]">Instant Local Payout</span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/75">
                Verification SLA
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">&lt; 12 Hours</p>
              <span className="text-xs text-white/80">Automated ISRC / UPC</span>
            </div>
          </div>
        </div>

        {/* Scroll Down Hint */}
        <a
          href="#platforms"
          className="mt-14 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-white transition-colors"
        >
          <span>Scroll for live platform network</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#c8f560]" />
        </a>
      </section>

      {/* RUNNING PLATFORMS MARQUEE */}
      <section
        id="platforms"
        className="relative z-10 py-10 border-y border-white/25 bg-black/10 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="w-4 h-4 text-[#c8f560]" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              LIVE CONNECTED STREAMING PLATFORMS • CONTINUOUS SYNC PIPELINE
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#c8f560]">
            24/7 ACTIVE TELEMETRY
          </span>
        </div>

        {/* Row 1: Left-to-Right Marquee */}
        <div className="w-full overflow-hidden py-2">
          <div className="animate-platform-marquee gap-3">
            {[...PLATFORMS_ROW_1, ...PLATFORMS_ROW_1].map((item, idx) => (
              <div
                key={`r1-${idx}`}
                className="mx-2 px-5 py-3 rounded-full border border-white/30 bg-white/10 flex items-center gap-3.5 hover:border-[#c8f560] transition-colors shadow-sm"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.dot }}
                />
                <div className="flex items-center gap-2.5 text-sm whitespace-nowrap">
                  <span className="font-semibold text-white tracking-wide">{item.name}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80 text-xs">{item.tag}</span>
                  <span className="px-2.5 py-0.5 rounded-full border border-[#c8f560]/40 bg-[#312042] text-[11px] font-bold uppercase tracking-wider text-[#c8f560]">
                    {item.share}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Right-to-Left Reverse Marquee */}
        <div className="w-full overflow-hidden py-2 mt-2">
          <div className="animate-platform-marquee-reverse gap-3">
            {[...PLATFORMS_ROW_2, ...PLATFORMS_ROW_2].map((item, idx) => (
              <div
                key={`r2-${idx}`}
                className="mx-2 px-5 py-3 rounded-full border border-white/30 bg-white/10 flex items-center gap-3.5 hover:border-white transition-colors shadow-sm"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.dot }}
                />
                <div className="flex items-center gap-2.5 text-sm whitespace-nowrap">
                  <span className="font-semibold text-white tracking-wide">{item.name}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80 text-xs">{item.tag}</span>
                  <span className="px-2.5 py-0.5 rounded-full border border-white/30 bg-white/15 text-[11px] font-bold uppercase tracking-wider text-white">
                    {item.share}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE & WORKFLOW GRID */}
      <section id="architecture" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="scroll-reveal opacity-0 translate-y-6 transition-all duration-700 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#c8f560] mb-2">
              01 / SYSTEM ARCHITECTURE
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Transparent distribution pipeline from master upload to bank payout.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-white/85 max-w-lg leading-relaxed">
            Built with separate dedicated environments for Recording Artists and Label
            Administrators. Every release, stream count, and payout is synchronized via Prisma DB.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: Disc3,
              title: "Lossless Track Ingestion",
              desc: "Upload WAV, FLAC, or MP3 masters up to 500MB with 3000×3000px artwork and automated ISRC metadata tagging.",
              meta: "STEP 1–4 WIZARD • INSTANT QC",
            },
            {
              step: "02",
              icon: TrendingUp,
              title: "Real-Time DSP Telemetry",
              desc: "Monitor daily, weekly, and monthly stream velocity across Spotify (71% share), Apple Music, TikTok, and YouTube.",
              meta: "COUNTRY HEATMAP • LIVE CHARTS",
            },
            {
              step: "03",
              icon: Wallet,
              title: "Local & Global Royalty Split",
              desc: "Withdraw cleared royalties directly to BCA, Mandiri, BNI, BRI, Seabank, OVO, GoPay, DANA, or ShopeePay.",
              meta: "1–3 BUSINESS DAYS • $0 FEE",
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="scroll-reveal opacity-0 translate-y-6 transition-all duration-700 p-6 rounded-3xl border border-white/25 bg-[#8a88b5]/60 backdrop-blur-md hover:border-[#c8f560] group flex flex-col justify-between min-h-[240px] shadow-lg"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#c8f560]">
                      /{card.step}
                    </span>
                    <Icon className="w-5 h-5 text-[#c8f560] group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5">{card.title}</h3>
                  <p className="text-sm text-white/85 leading-relaxed">{card.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white/75">
                  <span>{card.meta}</span>
                  <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-[#c8f560]" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DUAL WORKSPACE ACCESS SECTION */}
      <section id="royalties" className="relative z-10 max-w-7xl mx-auto px-6 py-14">
        <div className="scroll-reveal opacity-0 translate-y-6 transition-all duration-700 rounded-3xl border border-white/25 bg-[#8a88b5]/60 backdrop-blur-md p-6 sm:p-10 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/20">
            <div>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#c8f560]">
                02 / DUAL WORKSPACE ACCESS
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mt-1.5">
                Separate Artist Dashboard & Admin Control Center
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-full border border-white/40 bg-white/10 text-xs sm:text-sm font-semibold tracking-wide hover:border-[#c8f560] hover:text-[#c8f560] transition-all"
              >
                Sign In to Platform
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
            {/* User Dashboard Preview Box */}
            <div className="p-6 rounded-2xl border border-white/25 bg-white/10 flex flex-col justify-between shadow">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="px-3 py-1 rounded-full border border-[#c8f560]/60 bg-[#312042] text-[#c8f560] text-xs font-bold uppercase tracking-wider">
                    Artist Workspace
                  </span>
                  <span className="text-xs font-medium text-white/75">Interactive Views</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2.5">
                  HERMES / Luxoa Artist Dashboard
                </h4>
                <p className="text-sm text-white/85 leading-relaxed mb-5">
                  Includes Overview (Release Completion 76%, Royalty Growth, Streams by Platform),
                  Analytics & Global Country Heatmap, 4-Step Submit Track Wizard, My Releases
                  Calendar, and Royalty Withdrawal Form (BCA, Mandiri, OVO, GoPay, DANA).
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/15">
                <span className="text-xs text-white/80">Artist Distribution Workspace</span>
                <Link
                  href="/login"
                  className="text-sm font-bold text-[#c8f560] hover:underline flex items-center gap-1.5"
                >
                  <span>Artist Sign In</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Admin Dashboard Preview Box */}
            <div className="p-6 rounded-2xl border border-white/25 bg-white/10 flex flex-col justify-between shadow">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="px-3 py-1 rounded-full border border-white/50 bg-[#312042] text-[#c8f560] text-xs font-bold uppercase tracking-wider">
                    Admin Console
                  </span>
                  <span className="text-xs font-bold text-[#c8f560]">Full Label Control</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2.5">
                  HERMES Executive Admin Dashboard
                </h4>
                <p className="text-sm text-white/85 leading-relaxed mb-5">
                  Dedicated separate dashboard for label administrators. Review & Approve/Reject
                  pending artist track submissions, process bank/e-wallet withdrawal requests, edit
                  stream counts, and manage artist royalty balances.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/15">
                <span className="text-xs text-[#c8f560] font-semibold">
                  Executive Label Control Center
                </span>
                <Link
                  href="/login"
                  className="text-sm font-bold text-white hover:text-[#c8f560] flex items-center gap-1.5"
                >
                  <span>Admin Sign In</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER — Normal Readable Size */}
      <footer className="relative z-10 border-t border-white/20 bg-black/10 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs sm:text-sm font-medium uppercase tracking-wider text-white/80">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c8f560]" />
            <span className="font-semibold text-white">HERMES • LUXOA MUSIC DISTRIBUTION © 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#platforms" className="hover:text-[#c8f560] transition-colors">
              Platforms
            </a>
            <a href="#architecture" className="hover:text-[#c8f560] transition-colors">
              Telemetry
            </a>
            <Link href="/login" className="hover:text-[#c8f560] transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-[#c8f560] transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

