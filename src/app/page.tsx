"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Typewriter effect state
  const heroCopy =
    "Nggak perlu gabung major label buat masuk Spotify, Apple Music, atau TikTok. Di BREAKOUT.ID, master lagu tetap 100% punya lo, proses rilis nggak pakai drama, dan royalti cair langsung ke rekening BCA, Mandiri, atau GoPay.";
  const [typewriterIndex, setTypewriterIndex] = useState(0);

  useEffect(() => {
    if (typewriterIndex <= heroCopy.length) {
      const timer = setTimeout(() => {
        setTypewriterIndex((prev) => prev + 1);
      }, 26);
      return () => clearTimeout(timer);
    }
  }, [typewriterIndex, heroCopy.length]);

  const displayedSlice = heroCopy.slice(0, typewriterIndex);

  // Deck player & VU meter
  const [deckPlaying, setDeckPlaying] = useState(true);
  const [vuHeights, setVuHeights] = useState<number[]>(() =>
    Array.from({ length: 32 }, () => Math.floor(20 + Math.random() * 75))
  );

  useEffect(() => {
    if (!deckPlaying) {
      setVuHeights(Array(32).fill(12));
      return;
    }
    const interval = setInterval(() => {
      setVuHeights(
        Array.from({ length: 32 }, () => Math.floor(15 + Math.random() * 85))
      );
    }, 160);
    return () => clearInterval(interval);
  }, [deckPlaying]);

  const toggleDeckPlay = () => {
    setDeckPlaying((prev) => !prev);
  };

  // Royalty calculator state
  const [calcPlatform, setCalcPlatform] = useState<"spotify" | "apple" | "youtube" | "tiktok">("spotify");
  const [calcRate, setCalcRate] = useState<number>(42);
  const [streamCount, setStreamCount] = useState<number>(250000);

  const handleSelectPlatform = (platform: "spotify" | "apple" | "youtube" | "tiktok", rate: number) => {
    setCalcPlatform(platform);
    setCalcRate(rate);
  };

  const estimatedRoyalty = streamCount * calcRate;

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  // Auth Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "register">("register");
  const [modalBandName, setModalBandName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalFeedback, setModalFeedback] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const openAuthModal = (mode: "login" | "register") => {
    setModalMode(mode);
    setModalFeedback("");
    setModalOpen(true);
  };

  const closeAuthModal = () => {
    setModalOpen(false);
    setModalFeedback("");
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalFeedback("");

    try {
      if (modalMode === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: modalEmail, password: modalPassword }),
        });
        const data = await res.json();
        if (res.ok) {
          setModalFeedback("[OK] Login berhasil! Mengalihkan ke Dashboard...");
          setTimeout(() => {
            if (data.user?.role === "ADMIN") {
              router.push("/admin");
            } else {
              router.push("/dashboard");
            }
          }, 900);
        } else {
          setModalFeedback(`[ERROR] ${data.error || "Login gagal. Coba lagi."}`);
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: modalBandName || "Artist",
            email: modalEmail,
            password: modalPassword,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setModalFeedback("[OK] Akun berhasil dibuat! Mengalihkan ke Dashboard...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 900);
        } else {
          setModalFeedback(`[ERROR] ${data.error || "Pendaftaran gagal."}`);
        }
      }
    } catch (err: any) {
      setModalFeedback(`[ERROR] ${err.message || "Terjadi kesalahan koneksi."}`);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A09] text-[#F4F1EA] selection:bg-[#FF4D1C] selection:text-[#F4F1EA] bg-noise font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-[#0A0A09]/95 backdrop-blur-md border-b border-[#262623]">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          {/* Raw Typographic Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#FF4D1C] text-[#0A0A09] flex items-center justify-center font-mono font-bold text-lg tracking-tighter group-hover:bg-[#F4F1EA] transition-colors">
              B//
            </div>
            <div className="leading-none">
              <span className="font-display font-extrabold text-xl tracking-tight text-[#F4F1EA] block">
                BREAKOUT.ID
              </span>
              <span className="font-mono text-[10px] text-[#8E8D8A] tracking-widest">
                INDEPENDENT AUDIO DISTRO
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-[#8E8D8A]">
            <a href="#dsp-ticker" className="hover:text-[#F4F1EA] transition-colors">
              01. Jaringan DSP
            </a>
            <a href="#katalog" className="hover:text-[#F4F1EA] transition-colors">
              02. Rilisan Lokal
            </a>
            <a href="#fitur" className="hover:text-[#F4F1EA] transition-colors">
              03. Sistem
            </a>
            <a href="#kalkulator" className="hover:text-[#F4F1EA] transition-colors">
              04. Hitung Royalti
            </a>
            <a href="#testimoni" className="hover:text-[#F4F1EA] transition-colors">
              05. Kata Musisi
            </a>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => openAuthModal("login")}
              className="px-4 py-2.5 font-mono text-xs uppercase text-[#F4F1EA] hover:text-[#FF4D1C] transition-colors"
            >
              [Log Masuk]
            </button>
            <button
              onClick={() => openAuthModal("register")}
              className="px-5 py-2.5 bg-[#F4F1EA] text-[#0A0A09] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#FF4D1C] hover:text-[#F4F1EA] transition-colors"
            >
              Upload Master →
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border border-[#262623] text-[#F4F1EA]"
          >
            <i className="ph ph-list text-xl"></i>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#121210] border-b border-[#262623] px-4 py-6 space-y-4 font-mono text-xs uppercase">
            <a
              href="#dsp-ticker"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-[#8E8D8A] hover:text-[#F4F1EA]"
            >
              01. Jaringan DSP
            </a>
            <a
              href="#katalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-[#8E8D8A] hover:text-[#F4F1EA]"
            >
              02. Rilisan Lokal
            </a>
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-[#8E8D8A] hover:text-[#F4F1EA]"
            >
              03. Sistem
            </a>
            <a
              href="#kalkulator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-[#8E8D8A] hover:text-[#F4F1EA]"
            >
              04. Hitung Royalti
            </a>
            <a
              href="#testimoni"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 text-[#8E8D8A] hover:text-[#F4F1EA]"
            >
              05. Kata Musisi
            </a>
            <div className="pt-4 border-t border-[#262623] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("login");
                }}
                className="w-full py-3 border border-[#262623] text-[#F4F1EA]"
              >
                Log Masuk Artis
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("register");
                }}
                className="w-full py-3 bg-[#FF4D1C] text-[#F4F1EA] font-bold"
              >
                Upload Master →
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION: Full-Screen Edge-to-Edge Studio Layout */}
      <section className="w-full border-b border-[#262623]">
        <div className="grid lg:grid-cols-12 min-h-[calc(100vh-5rem)] items-stretch">
          {/* Left 7 Cols: Bold Editorial Statement */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#262623]">
            <div className="space-y-8 my-auto py-4">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-[#262623] bg-[#121210] font-mono text-xs text-[#8E8D8A]">
                <span className="text-[#FF4D1C] font-bold">● REC</span>
                <span>DISTRIBUTOR MUSIK TANPA POTONGAN HAK CIPTA</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-6xl xl:text-[76px] leading-[0.94] tracking-tight text-[#F4F1EA]">
                BIKIN LAGU DI KAMAR.
                <br />
                <span className="font-serif italic font-normal text-[#FF4D1C]">
                  Tayangin
                </span>{" "}
                KE SELURUH DUNIA.
              </h1>

              <p className="text-[#8E8D8A] text-base sm:text-lg max-w-2xl leading-relaxed font-normal min-h-[5.5rem] sm:min-h-[4.5rem]">
                <span>
                  {displayedSlice.includes("BREAKOUT.ID") ? (
                    <>
                      {displayedSlice.split("BREAKOUT.ID")[0]}
                      <strong className="text-[#F4F1EA] font-semibold">
                        BREAKOUT.ID
                      </strong>
                      {displayedSlice.split("BREAKOUT.ID")[1]}
                    </>
                  ) : (
                    displayedSlice
                  )}
                </span>
                <span className="inline-block w-2.5 h-5 bg-[#FF4D1C] align-middle ml-1 animate-pulse"></span>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => openAuthModal("register")}
                  className="px-8 py-4 bg-[#FF4D1C] text-[#F4F1EA] font-mono font-bold text-sm uppercase tracking-wider hover:bg-[#F4F1EA] hover:text-[#0A0A09] transition-colors hard-shadow flex items-center justify-center gap-3"
                >
                  <span>Mulai Rilis Sekarang</span>
                  <i className="ph-bold ph-arrow-up-right text-lg"></i>
                </button>
                <a
                  href="#kalkulator"
                  className="px-6 py-4 bg-[#121210] border border-[#262623] text-[#F4F1EA] font-mono text-xs uppercase tracking-wider hover:border-[#F4F1EA] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Cek Simulasi Royalti</span>
                </a>
              </div>
            </div>

            {/* Raw Footnote Stats */}
            <div className="pt-8 mt-8 border-t border-[#262623] grid grid-cols-3 gap-6 font-mono">
              <div>
                <span className="text-xs text-[#8E8D8A] block">KATALOG AKTIF</span>
                <span className="text-2xl sm:text-4xl font-bold text-[#F4F1EA]">
                  18.400+
                </span>
                <span className="text-[11px] text-[#D4FF33] block mt-0.5">
                  Track Independen
                </span>
              </div>
              <div className="border-l border-[#262623] pl-6">
                <span className="text-xs text-[#8E8D8A] block">ROYALTI ARTIS</span>
                <span className="text-2xl sm:text-4xl font-bold text-[#F4F1EA]">
                  100%
                </span>
                <span className="text-[11px] text-[#8E8D8A] block mt-0.5">
                  Tanpa Komisi Gelap
                </span>
              </div>
              <div className="border-l border-[#262623] pl-6">
                <span className="text-xs text-[#8E8D8A] block">MINIMUM WD</span>
                <span className="text-2xl sm:text-4xl font-bold text-[#FF4D1C]">
                  Rp 50rb
                </span>
                <span className="text-[11px] text-[#8E8D8A] block mt-0.5">
                  Tarik Kapan Aja
                </span>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Full-Height Master Inspection Console Card */}
          <div className="lg:col-span-5 bg-[#121210] p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            {/* Top Tape Header */}
            <div>
              <div className="flex items-center justify-between border-b border-[#262623] pb-4 mb-6 font-mono text-xs">
                <div>
                  <span className="text-[#8E8D8A] block text-[10px]">
                    MASTER AUDIO INSPECTOR // FULL RACK
                  </span>
                  <span className="text-[#F4F1EA] font-bold text-sm">
                    CAT# BRK-2026-089
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-[#D4FF33]/15 text-[#D4FF33] border border-[#D4FF33]/40 text-[10px] font-bold">
                  DELIVERED TO 154 DSPs
                </span>
              </div>

              {/* Vinyl + Track Artwork Preview */}
              <div className="flex items-center gap-5 bg-[#0A0A09] border border-[#262623] p-5 mb-6">
                <div className="relative w-24 h-24 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80"
                    alt="Artwork"
                    className="w-full h-full object-cover grayscale contrast-125 border border-[#262623] relative z-10"
                  />
                  {/* Spinning Vinyl Peeking Out */}
                  <div
                    style={{
                      animationPlayState: deckPlaying ? "running" : "paused",
                    }}
                    className="w-20 h-20 rounded-full bg-zinc-900 border-4 border-zinc-800 absolute -right-5 top-2 flex items-center justify-center animate-spin-slow"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#FF4D1C] border-2 border-[#0A0A09]"></div>
                  </div>
                </div>
                <div className="pl-4 min-w-0 flex-1">
                  <span className="font-mono text-[10px] text-[#FF4D1C] uppercase tracking-widest">
                    PREVIEW RILISAN
                  </span>
                  <h3 className="font-display font-bold text-xl text-[#F4F1EA] truncate">
                    Perjalanan Pulang
                  </h3>
                  <p className="font-mono text-xs text-[#8E8D8A] truncate">
                    Kamar Belakang • WAV 24-Bit / 48kHz
                  </p>
                </div>
                <button
                  onClick={toggleDeckPlay}
                  className="w-12 h-12 bg-[#FF4D1C] text-[#F4F1EA] flex items-center justify-center shrink-0 hover:bg-[#F4F1EA] hover:text-[#0A0A09] transition-colors"
                  title="Putar / Jeda Sample"
                >
                  <i
                    className={`ph-fill ${
                      deckPlaying ? "ph-pause" : "ph-play"
                    } text-xl`}
                  ></i>
                </button>
              </div>

              {/* Raw Level Meter / Equalizer */}
              <div className="mb-6">
                <div className="flex justify-between font-mono text-[10px] text-[#8E8D8A] mb-2">
                  <span>
                    {deckPlaying
                      ? "STATUS: STREAMING MASTER PREVIEW"
                      : "STATUS: DECK PAUSED"}
                  </span>
                  <span>PEAK: -0.8 dB // TRUE PEAK PASS</span>
                </div>
                <div className="h-16 bg-[#0A0A09] border border-[#262623] p-2.5 flex items-end justify-between gap-1">
                  {vuHeights.map((h, i) => {
                    const isPeak = i > 26;
                    return (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`flex-1 transition-all duration-150 ${
                          isPeak ? "bg-[#FF4D1C]" : "bg-[#D4FF33]"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Payout Ledger Log */}
            <div className="border-t border-[#262623] pt-5 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center text-[11px] text-[#8E8D8A] mb-1">
                <span>LOG TRANSAKSI ROYALTI TERBARU</span>
                <span>REAL-TIME SETTLEMENT</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-[#0A0A09] border border-[#262623]">
                <span className="flex items-center gap-2.5 text-[#F4F1EA]">
                  <i className="ph-fill ph-spotify-logo text-[#1DB954] text-base"></i>{" "}
                  Spotify ID & SG
                </span>
                <span className="text-[#D4FF33] font-bold">+ Rp 4.820.000</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-[#0A0A09] border border-[#262623]">
                <span className="flex items-center gap-2.5 text-[#F4F1EA]">
                  <i className="ph-fill ph-tiktok-logo text-[#F4F1EA] text-base"></i>{" "}
                  TikTok Sound Usage
                </span>
                <span className="text-[#D4FF33] font-bold">+ Rp 1.945.000</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-[#0A0A09] border border-[#262623]">
                <span className="flex items-center gap-2.5 text-[#F4F1EA]">
                  <i className="ph-fill ph-youtube-logo text-[#FF0000] text-base"></i>{" "}
                  YouTube Content ID
                </span>
                <span className="text-[#D4FF33] font-bold">+ Rp 2.310.000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANIMASI PLATFORM BERJALAN (INDUSTRIAL DSP TICKER TAPE) */}
      <section id="dsp-ticker" className="border-b border-[#262623] bg-[#121210] relative overflow-hidden">
        {/* Section Label Bar */}
        <div className="w-full px-4 sm:px-8 lg:px-12 py-4 border-b border-[#262623] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2 py-0.5 bg-[#FF4D1C] text-[#F4F1EA] font-bold">
              LIVE FEED
            </span>
            <span className="text-[#F4F1EA] uppercase">
              KONEKSI LANGSUNG KE 150+ DIGITAL SERVICE PROVIDERS (DSP)
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#8E8D8A]">
            ARAHKAN KURSOR UNTUK BERHENTI
          </span>
        </div>

        {/* ROW 1: Moving Left */}
        <div className="ticker-wrap flex overflow-hidden border-b border-[#262623] select-none bg-[#0A0A09]">
          <div className="ticker-move flex animate-ticker-left min-w-max">
            {/* Set 1 */}
            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-spotify-logo text-2xl text-[#1DB954]"></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#F4F1EA] text-sm">
                    SPOTIFY
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#262623] text-[#D4FF33]">
                    VERIFIED
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Audio + Canvas + Musixmatch Lyrics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-apple-logo text-2xl text-[#F4F1EA]"></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#F4F1EA] text-sm">
                    APPLE MUSIC & iTUNES
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#262623] text-[#F4F1EA]">
                    24-BIT
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Lossless ALAC & Dolby Atmos Ready
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-tiktok-logo text-2xl text-[#00F2FE]"></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#F4F1EA] text-sm">
                    TIKTOK & CAPCUT
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#262623] text-[#FF4D1C]">
                    VIRAL SOUND
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Monetisasi Pemakaian Video Kreator
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-youtube-logo text-2xl text-[#FF0000]"></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#F4F1EA] text-sm">
                    YOUTUBE MUSIC
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#262623] text-[#D4FF33]">
                    CONTENT ID
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  OAC (Official Artist Channel) & Shorts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-instagram-logo text-2xl text-[#E1306C]"></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#F4F1EA] text-sm">
                    INSTAGRAM & FACEBOOK
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#262623] text-[#F4F1EA]">
                    META
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Stiker Musik Story & Audio Reels
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-soundcloud-logo text-2xl text-[#FF5500]"></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#F4F1EA] text-sm">
                    SOUNDCLOUD GO+
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Fan-Powered Royalties
                </p>
              </div>
            </div>

            {/* Set 2 (Duplicate for Seamless Loop) */}
            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-spotify-logo text-2xl text-[#1DB954]"></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#F4F1EA] text-sm">
                    SPOTIFY
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#262623] text-[#D4FF33]">
                    VERIFIED
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Audio + Canvas + Musixmatch Lyrics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-apple-logo text-2xl text-[#F4F1EA]"></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#F4F1EA] text-sm">
                    APPLE MUSIC & iTUNES
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#262623] text-[#F4F1EA]">
                    24-BIT
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Lossless ALAC & Dolby Atmos Ready
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-tiktok-logo text-2xl text-[#00F2FE]"></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#F4F1EA] text-sm">
                    TIKTOK & CAPCUT
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#262623] text-[#FF4D1C]">
                    VIRAL SOUND
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Monetisasi Pemakaian Video Kreator
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-youtube-logo text-2xl text-[#FF0000]"></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#F4F1EA] text-sm">
                    YOUTUBE MUSIC
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#262623] text-[#D4FF33]">
                    CONTENT ID
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  OAC (Official Artist Channel) & Shorts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-instagram-logo text-2xl text-[#E1306C]"></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#F4F1EA] text-sm">
                    INSTAGRAM & FACEBOOK
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#262623] text-[#F4F1EA]">
                    META
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Stiker Musik Story & Audio Reels
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-soundcloud-logo text-2xl text-[#FF5500]"></i>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-[#F4F1EA] text-sm">
                    SOUNDCLOUD GO+
                  </span>
                </div>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Fan-Powered Royalties
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: Moving Right */}
        <div className="ticker-wrap flex overflow-hidden select-none bg-[#0A0A09]">
          <div className="ticker-move flex animate-ticker-right min-w-max">
            {/* Set 1 */}
            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-radio text-2xl text-[#FF4D1C]"></i>
              <div>
                <span className="font-display font-bold text-[#F4F1EA] text-sm block">
                  LANGITMUSIK & TREBEL
                </span>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Jaringan Streaming Lokal Indonesia
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-diamond text-2xl text-[#00FFFF]"></i>
              <div>
                <span className="font-display font-bold text-[#F4F1EA] text-sm block">
                  TIDAL HI-FI
                </span>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Master Studio Quality Stream
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-equalizer text-2xl text-[#A238FF]"></i>
              <div>
                <span className="font-display font-bold text-[#F4F1EA] text-sm block">
                  DEEZER
                </span>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  FLAC High Fidelity Global
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-disc text-2xl text-[#D4FF33]"></i>
              <div>
                <span className="font-display font-bold text-[#F4F1EA] text-sm block">
                  BEATPORT & TRAXSOURCE
                </span>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Khusus Rilisan Elektronik / Club / DJ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-amazon-logo text-2xl text-[#00A8E1]"></i>
              <div>
                <span className="font-display font-bold text-[#F4F1EA] text-sm block">
                  AMAZON MUSIC
                </span>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  HD Streaming & Alexa Voice
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-waveform text-2xl text-[#0088FF]"></i>
              <div>
                <span className="font-display font-bold text-[#F4F1EA] text-sm block">
                  SHAZAM & SIRI
                </span>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Audio Fingerprinting Otomatis
                </p>
              </div>
            </div>

            {/* Set 2 (Duplicate) */}
            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-radio text-2xl text-[#FF4D1C]"></i>
              <div>
                <span className="font-display font-bold text-[#F4F1EA] text-sm block">
                  LANGITMUSIK & TREBEL
                </span>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Jaringan Streaming Lokal Indonesia
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-diamond text-2xl text-[#00FFFF]"></i>
              <div>
                <span className="font-display font-bold text-[#F4F1EA] text-sm block">
                  TIDAL HI-FI
                </span>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Master Studio Quality Stream
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-equalizer text-2xl text-[#A238FF]"></i>
              <div>
                <span className="font-display font-bold text-[#F4F1EA] text-sm block">
                  DEEZER
                </span>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  FLAC High Fidelity Global
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-disc text-2xl text-[#D4FF33]"></i>
              <div>
                <span className="font-display font-bold text-[#F4F1EA] text-sm block">
                  BEATPORT & TRAXSOURCE
                </span>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Khusus Rilisan Elektronik / Club / DJ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-amazon-logo text-2xl text-[#00A8E1]"></i>
              <div>
                <span className="font-display font-bold text-[#F4F1EA] text-sm block">
                  AMAZON MUSIC
                </span>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  HD Streaming & Alexa Voice
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 border-r border-[#262623] hover:bg-[#121210] transition-colors">
              <i className="ph-fill ph-waveform text-2xl text-[#0088FF]"></i>
              <div>
                <span className="font-display font-bold text-[#F4F1EA] text-sm block">
                  SHAZAM & SIRI
                </span>
                <p className="font-mono text-[11px] text-[#8E8D8A]">
                  Audio Fingerprinting Otomatis
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROSTER / RILISAN LOKAL SECTION (Full-Screen Bleed Grid Cards) */}
      <section id="katalog" className="w-full border-b border-[#262623]">
        <div className="px-4 sm:px-8 lg:px-12 py-12 border-b border-[#262623] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-[#FF4D1C] uppercase tracking-widest">
              // ARSIP RILISAN TERBARU
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F4F1EA] mt-2">
              DARI GIGS KECIL SAMPAI{" "}
              <span className="font-serif italic font-normal">Chart Viral.</span>
            </h2>
          </div>
          <p className="font-mono text-xs text-[#8E8D8A] max-w-sm">
            Dari unit shoegaze Bandung, hip-hop kolektif Surabaya, sampai bedroom
            pop Jakarta Selatan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#262623]">
          {/* Release 1 */}
          <div className="bg-[#121210] p-6 sm:p-8 lg:p-10 group hover:bg-[#0A0A09] transition-colors">
            <div className="aspect-square overflow-hidden bg-[#0A0A09] mb-6 relative border border-[#262623]">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80"
                alt="Cover"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
              <span className="absolute top-3 left-3 bg-[#0A0A09]/90 border border-[#262623] px-2.5 py-1 font-mono text-[10px] text-[#F4F1EA]">
                LP • 10 TRACKS
              </span>
            </div>
            <div className="font-mono text-xs text-[#FF4D1C]">
              BANDUNG // POST-PUNK
            </div>
            <h3 className="font-display font-bold text-2xl text-[#F4F1EA] mt-1">
              Distorsi Jam Tiga Pagi
            </h3>
            <p className="text-sm text-[#8E8D8A] mt-0.5">The Monochrome Youth</p>
          </div>

          {/* Release 2 */}
          <div className="bg-[#121210] p-6 sm:p-8 lg:p-10 group hover:bg-[#0A0A09] transition-colors">
            <div className="aspect-square overflow-hidden bg-[#0A0A09] mb-6 relative border border-[#262623]">
              <img
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=80"
                alt="Cover"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
              <span className="absolute top-3 left-3 bg-[#0A0A09]/90 border border-[#262623] px-2.5 py-1 font-mono text-[10px] text-[#D4FF33]">
                SINGLE
              </span>
            </div>
            <div className="font-mono text-xs text-[#FF4D1C]">
              JAKARTA // R&amp;B ALTERNATIVE
            </div>
            <h3 className="font-display font-bold text-2xl text-[#F4F1EA] mt-1">
              Parkiran Blok M
            </h3>
            <p className="text-sm text-[#8E8D8A] mt-0.5">Nadira &amp; Soren</p>
          </div>

          {/* Release 3 */}
          <div className="bg-[#121210] p-6 sm:p-8 lg:p-10 group hover:bg-[#0A0A09] transition-colors">
            <div className="aspect-square overflow-hidden bg-[#0A0A09] mb-6 relative border border-[#262623]">
              <img
                src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=700&q=80"
                alt="Cover"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
              <span className="absolute top-3 left-3 bg-[#0A0A09]/90 border border-[#262623] px-2.5 py-1 font-mono text-[10px] text-[#F4F1EA]">
                EP • 5 TRACKS
              </span>
            </div>
            <div className="font-mono text-xs text-[#FF4D1C]">
              MALANG // INDIE ROCK
            </div>
            <h3 className="font-display font-bold text-2xl text-[#F4F1EA] mt-1">
              Kabut Arjuno
            </h3>
            <p className="text-sm text-[#8E8D8A] mt-0.5">Pagi Terakhir</p>
          </div>

          {/* Release 4 */}
          <div className="bg-[#121210] p-6 sm:p-8 lg:p-10 group hover:bg-[#0A0A09] transition-colors">
            <div className="aspect-square overflow-hidden bg-[#0A0A09] mb-6 relative border border-[#262623]">
              <img
                src="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=700&q=80"
                alt="Cover"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
              <span className="absolute top-3 left-3 bg-[#0A0A09]/90 border border-[#262623] px-2.5 py-1 font-mono text-[10px] text-[#D4FF33]">
                SINGLE
              </span>
            </div>
            <div className="font-mono text-xs text-[#FF4D1C]">
              DENPASAR // ELECTRONIC
            </div>
            <h3 className="font-display font-bold text-2xl text-[#F4F1EA] mt-1">
              Ombak Tengah Malam
            </h3>
            <p className="text-sm text-[#8E8D8A] mt-0.5">Kuta Modular Club</p>
          </div>
        </div>
      </section>

      {/* INFRASTRUKTUR / KENAPA KAMI (Full-Width 1px Exposed Table Grid) */}
      <section id="fitur" className="w-full border-b border-[#262623]">
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#262623]">
          <div className="p-8 sm:p-12 lg:p-16 space-y-5 bg-[#0A0A09] hover:bg-[#121210] transition-colors">
            <div className="flex items-center justify-between font-mono text-xs text-[#8E8D8A]">
              <span>[FITUR // 01]</span>
              <i className="ph-bold ph-bank text-2xl text-[#FF4D1C]"></i>
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F1EA]">
              Cair ke Rekening Lokal Tanpa Potongan Kurs
            </h3>
            <p className="text-[#8E8D8A] text-sm sm:text-base leading-relaxed">
              Kalau pakai agregator luar, lo kena biaya PayPal atau potongan wire
              transfer ratusan ribu. Di sini saldo royalti langsung cair ke BCA,
              Mandiri, BNI, BRI, atau GoPay dalam Rupiah.
            </p>
          </div>

          <div className="p-8 sm:p-12 lg:p-16 space-y-5 bg-[#0A0A09] hover:bg-[#121210] transition-colors">
            <div className="flex items-center justify-between font-mono text-xs text-[#8E8D8A]">
              <span>[FITUR // 02]</span>
              <i className="ph-bold ph-users-four text-2xl text-[#D4FF33]"></i>
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F1EA]">
              Bagi Hasil Band &amp; Produser Otomatis
            </h3>
            <p className="text-[#8E8D8A] text-sm sm:text-base leading-relaxed">
              Nggak perlu repot ngitung manual tiap bulan di grup WhatsApp band. Atur
              persentase royalti tiap personel atau <em>featuring artist</em>, uang
              langsung kebagi otomatis ke akun masing-masing.
            </p>
          </div>

          <div className="p-8 sm:p-12 lg:p-16 space-y-5 bg-[#0A0A09] hover:bg-[#121210] transition-colors">
            <div className="flex items-center justify-between font-mono text-xs text-[#8E8D8A]">
              <span>[FITUR // 03]</span>
              <i className="ph-bold ph-lightning text-2xl text-[#FF4D1C]"></i>
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F1EA]">
              Tim Kurator Manusia, Bukan Bot
            </h3>
            <p className="text-[#8E8D8A] text-sm sm:text-base leading-relaxed">
              Rilisan ketahan gara-gara salah ukuran cover atau penulisan judul?
              Tim A&amp;R kita di Jakarta bakal bantu benerin via WhatsApp sampai lagu
              lo berhasil tayang.
            </p>
          </div>
        </div>
      </section>

      {/* KALKULATOR ROYALTI (Full-Width Split Console) */}
      <section id="kalkulator" className="w-full border-b border-[#262623] bg-[#121210]/40">
        <div className="grid lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-5 p-6 sm:p-10 lg:p-16 flex flex-col justify-center space-y-5 border-b lg:border-b-0 lg:border-r border-[#262623]">
            <span className="font-mono text-xs text-[#FF4D1C] uppercase tracking-widest">
              // SIMULASI PENDAPATAN
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F4F1EA] leading-tight">
              BERAPA RUPIAH DARI STREAMING LO?
            </h2>
            <p className="text-[#8E8D8A] text-sm sm:text-base leading-relaxed">
              Angka di samping adalah hitungan rata-rata tarif <em>Pay-Per-Stream</em>{" "}
              bersih untuk pendengar region Indonesia &amp; Asia Tenggara. Pilih
              platform dan geser jumlah <em>streams</em>.
            </p>
            <div className="pt-2 font-mono text-xs text-[#8E8D8A] space-y-1.5">
              <p>
                • Paket Pro &amp; Label: Artis terima{" "}
                <strong className="text-[#F4F1EA]">100% penuh</strong>
              </p>
              <p>• Sudah termasuk kode ISRC &amp; UPC resmi</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0A0A09] p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
            {/* Platform Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 font-mono text-xs">
              <button
                type="button"
                onClick={() => handleSelectPlatform("spotify", 42)}
                className={`plat-btn py-4 px-4 border uppercase text-left transition-colors ${
                  calcPlatform === "spotify"
                    ? "border-[#FF4D1C] bg-[#FF4D1C] text-[#F4F1EA] font-bold"
                    : "border-[#262623] bg-[#121210] text-[#8E8D8A] hover:text-[#F4F1EA]"
                }`}
              >
                01. Spotify
              </button>
              <button
                type="button"
                onClick={() => handleSelectPlatform("apple", 78)}
                className={`plat-btn py-4 px-4 border uppercase text-left transition-colors ${
                  calcPlatform === "apple"
                    ? "border-[#FF4D1C] bg-[#FF4D1C] text-[#F4F1EA] font-bold"
                    : "border-[#262623] bg-[#121210] text-[#8E8D8A] hover:text-[#F4F1EA]"
                }`}
              >
                02. Apple
              </button>
              <button
                type="button"
                onClick={() => handleSelectPlatform("youtube", 28)}
                className={`plat-btn py-4 px-4 border uppercase text-left transition-colors ${
                  calcPlatform === "youtube"
                    ? "border-[#FF4D1C] bg-[#FF4D1C] text-[#F4F1EA] font-bold"
                    : "border-[#262623] bg-[#121210] text-[#8E8D8A] hover:text-[#F4F1EA]"
                }`}
              >
                03. YouTube
              </button>
              <button
                type="button"
                onClick={() => handleSelectPlatform("tiktok", 35)}
                className={`plat-btn py-4 px-4 border uppercase text-left transition-colors ${
                  calcPlatform === "tiktok"
                    ? "border-[#FF4D1C] bg-[#FF4D1C] text-[#F4F1EA] font-bold"
                    : "border-[#262623] bg-[#121210] text-[#8E8D8A] hover:text-[#F4F1EA]"
                }`}
              >
                04. TikTok
              </button>
            </div>

            {/* Slider Control */}
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-[#8E8D8A]">
                  JUMLAH PLAYS / STREAMS:
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-[#F4F1EA]">
                  {streamCount.toLocaleString("id-ID")} PLAYS
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="5000000"
                step="10000"
                value={streamCount}
                onChange={(e) => setStreamCount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between font-mono text-[10px] text-[#8E8D8A]">
                <span>10.000</span>
                <span>1.000.000</span>
                <span>2.500.000</span>
                <span>5.000.000</span>
              </div>
            </div>

            {/* Readout Display */}
            <div className="bg-[#121210] border border-[#262623] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] text-[#8E8D8A] block">
                  ESTIMASI ROYALTI BERSIH (100%):
                </span>
                <span className="font-mono font-bold text-3xl sm:text-5xl text-[#D4FF33] block mt-1">
                  Rp {estimatedRoyalty.toLocaleString("id-ID")}
                </span>
              </div>
              <button
                onClick={() => openAuthModal("register")}
                className="px-6 py-4 bg-[#F4F1EA] text-[#0A0A09] font-mono font-bold text-xs uppercase hover:bg-[#FF4D1C] hover:text-[#F4F1EA] transition-colors shrink-0"
              >
                Upload Lagu →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONI MUSISI (FULL-BLEED STUDIO LOG CARDS) */}
      <section id="testimoni" className="w-full border-b border-[#262623]">
        <div className="px-4 sm:px-8 lg:px-12 py-12 border-b border-[#262623] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-[#FF4D1C] uppercase tracking-widest">
              // SUARA DARI BACKSTAGE
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F4F1EA] mt-2">
              KATA MEREKA YANG UDAH{" "}
              <span className="font-serif italic font-normal text-[#D4FF33]">
                Pindah Ke Sini.
              </span>
            </h2>
          </div>
          <p className="font-mono text-xs text-[#8E8D8A] max-w-sm">
            Catatan jujur dari band independen, produser kamar, sampai kolektif label
            yang rilis lewat BREAKOUT.ID.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#262623] items-stretch">
          {/* Testimoni 1 */}
          <div className="bg-[#121210] p-8 sm:p-12 lg:p-14 flex flex-col justify-between hover:bg-[#0A0A09] transition-colors">
            <div>
              <div className="flex justify-between items-center font-mono text-xs text-[#8E8D8A] pb-4 border-b border-[#262623]">
                <span>LOG // BANDUNG</span>
                <span className="text-[#D4FF33]">[VERIFIED ARTIST]</span>
              </div>
              <p className="font-sans text-lg sm:text-xl text-[#F4F1EA] leading-relaxed mt-8">
                &ldquo;Dulu pakai agregator luar tiap mau narik duit royalti kepotong
                biaya PayPal lumayan berasa. Pas pindah ke BREAKOUT.ID, cairin uang
                buat sewa studio latihan tinggal tarik ke BCA, sorenya langsung masuk
                utuh.&rdquo;
              </p>
            </div>
            <div className="mt-10 pt-6 border-t border-[#262623] flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-lg text-[#F4F1EA]">
                  Raka &amp; Personel
                </h4>
                <span className="font-mono text-xs text-[#FF4D1C] block">
                  The Monochrome Youth (Post-Punk)
                </span>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-1 bg-[#0A0A09] border border-[#262623] text-[#8E8D8A]">
                14 RILISAN
              </span>
            </div>
          </div>

          {/* Testimoni 2 */}
          <div className="bg-[#0A0A09] p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative">
            <div>
              <div className="flex justify-between items-center font-mono text-xs text-[#FF4D1C] pb-4 border-b border-[#262623]">
                <span>LOG // JAKARTA SELATAN</span>
                <span className="text-[#F4F1EA]">[SOLOIST / PRODUSER]</span>
              </div>
              <p className="font-sans text-lg sm:text-xl text-[#F4F1EA] leading-relaxed mt-8">
                &ldquo;Yang paling ngebantu itu fitur bagi hasil otomatisnya. Gue
                sering kolaborasi sama beatmaker dan vokalis tamu, sekarang nggak
                perlu pusing rekap Excel tiap bulan. Semuanya langsung kebagi rapi
                dari dashboard.&rdquo;
              </p>
            </div>
            <div className="mt-10 pt-6 border-t border-[#262623] flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-lg text-[#F4F1EA]">
                  Nadira Soren
                </h4>
                <span className="font-mono text-xs text-[#D4FF33] block">
                  Bedroom R&amp;B / Produser
                </span>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-1 bg-[#121210] border border-[#262623] text-[#8E8D8A]">
                1.2M+ STREAMS
              </span>
            </div>
          </div>

          {/* Testimoni 3 */}
          <div className="bg-[#121210] p-8 sm:p-12 lg:p-14 flex flex-col justify-between hover:bg-[#0A0A09] transition-colors">
            <div>
              <div className="flex justify-between items-center font-mono text-xs text-[#8E8D8A] pb-4 border-b border-[#262623]">
                <span>LOG // MALANG &amp; SURABAYA</span>
                <span className="text-[#D4FF33]">[MICRO RECORD LABEL]</span>
              </div>
              <p className="font-sans text-lg sm:text-xl text-[#F4F1EA] leading-relaxed mt-8">
                &ldquo;Pernah salah upload master audio H-2 sebelum rilis tunggal.
                Kalau di tempat lain udah pasrah nunggu tiket email berhari-hari, di
                sini tinggal chat tim A&amp;R-nya langsung dibantu <em>swap</em> file
                hari itu juga.&rdquo;
              </p>
            </div>
            <div className="mt-10 pt-6 border-t border-[#262623] flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-lg text-[#F4F1EA]">
                  Dimas Prasetyo
                </h4>
                <span className="font-mono text-xs text-[#FF4D1C] block">
                  Founder — Garasi Timur Records
                </span>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-1 bg-[#0A0A09] border border-[#262623] text-[#8E8D8A]">
                9 BAND ROSTER
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full border-b border-[#262623]">
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-4 p-6 sm:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#262623]">
            <span className="font-mono text-xs text-[#FF4D1C] uppercase">
              // TANYA JAWAB
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F4F1EA] mt-2">
              YANG SERING DITANYAIN MUSISI.
            </h2>
            <p className="text-[#8E8D8A] text-xs font-mono mt-3">
              Masih bingung? Chat langsung tim A&amp;R kita di jam kerja.
            </p>
          </div>
          <div className="lg:col-span-8 divide-y divide-[#262623]">
            <div className="p-6 sm:p-10">
              <button
                type="button"
                onClick={() => toggleFaq(0)}
                className="w-full flex items-center justify-between text-left font-display font-bold text-lg sm:text-xl text-[#F4F1EA]"
              >
                <span>
                  Kalau tahun depan gue lupa perpanjang paket tahunan, lagu gue
                  kehapus nggak?
                </span>
                <span className="font-mono text-[#FF4D1C] text-xl">
                  {openFaq === 0 ? "−" : "+"}
                </span>
              </button>
              {openFaq === 0 && (
                <p className="mt-3 text-sm sm:text-base text-[#8E8D8A] leading-relaxed">
                  Nggak bakal langsung kita <em>takedown</em>. Kalau masa langganan
                  habis dan belum diperpanjang, lagu lo tetap tayang dan cuma
                  dialihkan otomatis ke skema bagi hasil 90/10 dari royalti yang
                  masuk.
                </p>
              )}
            </div>

            <div className="p-6 sm:p-10">
              <button
                type="button"
                onClick={() => toggleFaq(1)}
                className="w-full flex items-center justify-between text-left font-display font-bold text-lg sm:text-xl text-[#F4F1EA]"
              >
                <span>
                  Bisa sekalian urus centang biru Spotify for Artists &amp; Official
                  Artist Channel YouTube?
                </span>
                <span className="font-mono text-[#FF4D1C] text-xl">
                  {openFaq === 1 ? "−" : "+"}
                </span>
              </button>
              {openFaq === 1 && (
                <p className="mt-3 text-sm sm:text-base text-[#8E8D8A] leading-relaxed">
                  Bisa banget. Begitu rilisan pertama lo terdeliver ke Spotify dan
                  YouTube, tombol klaim instan langsung kebuka di dashboard
                  BREAKOUT.ID tanpa perlu syarat minimal jumlah followers.
                </p>
              )}
            </div>

            <div className="p-6 sm:p-10">
              <button
                type="button"
                onClick={() => toggleFaq(2)}
                className="w-full flex items-center justify-between text-left font-display font-bold text-lg sm:text-xl text-[#F4F1EA]"
              >
                <span>Spek file audio dan artwork yang wajib disiapin apa aja?</span>
                <span className="font-mono text-[#FF4D1C] text-xl">
                  {openFaq === 2 ? "−" : "+"}
                </span>
              </button>
              {openFaq === 2 && (
                <p className="mt-3 text-sm sm:text-base text-[#8E8D8A] leading-relaxed">
                  File master audio wajib format WAV (minimal 16-bit / 44.1 kHz
                  Stereo, jangan MP3 hasil convert). Buat cover art ukurannya
                  persegi 3000 x 3000 pixel format JPG/PNG.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full px-4 sm:px-8 lg:px-12 py-12 font-mono text-xs text-[#8E8D8A]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-[#262623]">
          <div>
            <span className="font-display font-extrabold text-2xl text-[#F4F1EA] block">
              BREAKOUT.ID
            </span>
            <span>
              PT BREAKOUT DISTRIBUSI MUSIK INDONESIA — JAKARTA SELATAN
            </span>
          </div>
          <div className="flex flex-wrap gap-6 text-[#F4F1EA]">
            <a href="#dsp-ticker" className="hover:text-[#FF4D1C]">
              DSP LIST
            </a>
            <a href="#katalog" className="hover:text-[#FF4D1C]">
              KATALOG
            </a>
            <a href="#kalkulator" className="hover:text-[#FF4D1C]">
              ROYALTI
            </a>
            <a href="#testimoni" className="hover:text-[#FF4D1C]">
              TESTIMONI
            </a>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between gap-2 text-[11px]">
          <span>
            © 2026 BREAKOUT.ID — HAK CIPTA MILIK MASING-MASING MUSISI.
          </span>
          <span>
            PEMBAYARAN DIDUKUNG OLEH QRIS / VIRTUAL ACCOUNT INDONESIA
          </span>
        </div>
      </footer>

      {/* MODAL PENDAFTARAN / LOGIN */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A09]/90 backdrop-blur-sm">
          <div className="bg-[#121210] border-2 border-[#F4F1EA] max-w-md w-full p-6 sm:p-8 relative hard-shadow">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 px-2 py-1 border border-[#262623] font-mono text-xs text-[#8E8D8A] hover:text-[#F4F1EA]"
            >
              [ESC / X]
            </button>

            <span className="font-mono text-[11px] text-[#FF4D1C] uppercase">
              // PORTAL BACKSTAGE ARTIS
            </span>
            <h3 className="font-display font-bold text-2xl text-[#F4F1EA] mt-1">
              {modalMode === "login"
                ? "Log Masuk Artis"
                : "Bikin Akun Distribusi"}
            </h3>
            <p className="text-xs text-[#8E8D8A] mt-1 mb-6">
              {modalMode === "login"
                ? "Masukkan email dan password untuk masuk ke dashboard backstage."
                : "Gratis bikin akun. Bayar cuma pas lo udah siap upload lagu."}
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-4 font-mono text-xs">
              {modalMode === "register" && (
                <div>
                  <label className="block text-[#F4F1EA] mb-1.5 uppercase">
                    Nama Band / Solo / Kolektif
                  </label>
                  <input
                    type="text"
                    required
                    value={modalBandName}
                    onChange={(e) => setModalBandName(e.target.value)}
                    placeholder="Contoh: Perunggu / Bernadya"
                    className="w-full px-3.5 py-3 bg-[#0A0A09] border border-[#262623] text-[#F4F1EA] focus:outline-none focus:border-[#FF4D1C]"
                  />
                </div>
              )}
              <div>
                <label className="block text-[#F4F1EA] mb-1.5 uppercase">
                  Email Aktif
                </label>
                <input
                  type="email"
                  required
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  placeholder="bandkamu@email.com"
                  className="w-full px-3.5 py-3 bg-[#0A0A09] border border-[#262623] text-[#F4F1EA] focus:outline-none focus:border-[#FF4D1C]"
                />
              </div>
              <div>
                <label className="block text-[#F4F1EA] mb-1.5 uppercase">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-3 bg-[#0A0A09] border border-[#262623] text-[#F4F1EA] focus:outline-none focus:border-[#FF4D1C]"
                />
              </div>

              <button
                type="submit"
                disabled={modalLoading}
                className="w-full py-4 bg-[#FF4D1C] text-[#F4F1EA] font-bold uppercase tracking-wider hover:bg-[#F4F1EA] hover:text-[#0A0A09] transition-colors mt-2"
              >
                {modalLoading
                  ? "Memproses..."
                  : modalMode === "login"
                  ? "Masuk ke Studio →"
                  : "Bikin Akun Sekarang →"}
              </button>

              <div className="pt-2 text-center text-[#8E8D8A]">
                {modalMode === "login" ? (
                  <p>
                    Belum punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setModalMode("register");
                        setModalFeedback("");
                      }}
                      className="text-[#FF4D1C] underline font-bold"
                    >
                      Daftar di sini
                    </button>
                  </p>
                ) : (
                  <p>
                    Sudah punya akun?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setModalMode("login");
                        setModalFeedback("");
                      }}
                      className="text-[#FF4D1C] underline font-bold"
                    >
                      Log Masuk
                    </button>
                  </p>
                )}
              </div>
            </form>

            {modalFeedback && (
              <div
                className={`mt-4 p-3 bg-[#0A0A09] border font-mono text-xs ${
                  modalFeedback.startsWith("[OK]")
                    ? "border-[#D4FF33] text-[#D4FF33]"
                    : "border-[#FF4D1C] text-[#FF4D1C]"
                }`}
              >
                {modalFeedback}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
