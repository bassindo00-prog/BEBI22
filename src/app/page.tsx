'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ALL_DSP_PLATFORMS } from '@/lib/dspPlatforms';
import {
  Disc,
  Play,
  Pause,
  ArrowUpRight,
  Radio,
  Banknote,
  Users,
  Zap,
  Check,
  Copy,
  Code2,
  Database,
  FileCode,
  Terminal,
  Menu,
  X,
  Plus,
  Minus,
  Music,
  Volume2,
  Sparkles,
  ShieldCheck,
  User,
  Mail,
  Lock
} from 'lucide-react';

// ============================================================================
// DATA SIMULASI DATABASE PRISMA (Bisa diganti langsung dengan prisma.findMany)
// ============================================================================
const INITIAL_RELEASES = [
  {
    id: 'rel_01',
    catalogNo: 'BRK-2026-089',
    title: 'Distorsi Jam Tiga Pagi',
    artistName: 'The Monochrome Youth',
    city: 'BANDUNG',
    genre: 'POST-PUNK',
    format: 'LP • 10 TRACKS',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'rel_02',
    catalogNo: 'BRK-2026-090',
    title: 'Parkiran Blok M',
    artistName: 'Nadira & Soren',
    city: 'JAKARTA',
    genre: 'R&B ALTERNATIVE',
    format: 'SINGLE',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'rel_03',
    catalogNo: 'BRK-2026-091',
    title: 'Kabut Arjuno',
    artistName: 'Pagi Terakhir',
    city: 'MALANG',
    genre: 'INDIE ROCK',
    format: 'EP • 5 TRACKS',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=700&q=80',
  },
  {
    id: 'rel_04',
    catalogNo: 'BRK-2026-092',
    title: 'Ombak Tengah Malam',
    artistName: 'Kuta Modular Club',
    city: 'DENPASAR',
    genre: 'ELECTRONIC',
    format: 'SINGLE',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=700&q=80',
  },
];

const INITIAL_TESTIMONIALS = [
  {
    id: 'tes_01',
    city: 'BANDUNG',
    roleTag: '[VERIFIED ARTIST]',
    quote:
      'Dulu pakai agregator luar tiap mau narik duit royalti kepotong biaya PayPal lumayan berasa. Pas pindah ke BREAKOUT.ID, cairin uang buat sewa studio latihan tinggal tarik ke BCA, sorenya langsung masuk utuh.',
    artistName: 'Raka & Personel',
    project: 'The Monochrome Youth (Post-Punk)',
    statsBadge: '14 RILISAN',
    highlighted: false,
  },
  {
    id: 'tes_02',
    city: 'JAKARTA SELATAN',
    roleTag: '[SOLOIST / PRODUSER]',
    quote:
      'Yang paling ngebantu itu fitur bagi hasil otomatisnya. Gue sering kolaborasi sama beatmaker dan vokalis tamu, sekarang nggak perlu pusing rekap Excel tiap bulan. Semuanya langsung kebagi rapi dari dashboard.',
    artistName: 'Nadira Soren',
    project: 'Bedroom R&B / Produser',
    statsBadge: '1.2M+ STREAMS',
    highlighted: true,
  },
  {
    id: 'tes_03',
    city: 'MALANG & SURABAYA',
    roleTag: '[MICRO RECORD LABEL]',
    quote:
      'Pernah salah upload master audio H-2 sebelum rilis tunggal. Kalau di tempat lain udah pasrah nunggu tiket email berhari-hari, di sini tinggal chat tim A&R-nya langsung dibantu swap file hari itu juga.',
    artistName: 'Dimas Prasetyo',
    project: 'Founder — Garasi Timur Records',
    statsBadge: '9 BAND ROSTER',
    highlighted: false,
  },
];

const DSP_ROW_1 = ALL_DSP_PLATFORMS.slice(0, 28);
const DSP_ROW_2 = ALL_DSP_PLATFORMS.slice(28);

// ============================================================================
// KODE FULL-STACK NEXT.JS + PRISMA UNTUK DI-COPAS USER
// ============================================================================
const PRISMA_SCHEMA_CODE = `// File: prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // Bisa diganti mysql / sqlite
  url      = env("DATABASE_URL")
}

model ArtistUser {
  id           String        @id @default(cuid())
  bandOrArtist String
  email        String        @unique
  passwordHash String
  city         String?
  bankName     String?       // BCA, Mandiri, GoPay, dll
  bankAccount  String?
  releases     Release[]
  royalties    RoyaltyLog[]
  createdAt    DateTime      @default(now())
}

model Release {
  id         String      @id @default(cuid())
  catalogNo  String      @unique // Contoh: BRK-2026-089
  title      String
  artistName String
  city       String
  genre      String
  format     String      // SINGLE, EP, LP
  coverUrl   String
  wavUrl     String?
  isrcCode   String?
  status     ReleaseStatus @default(DELIVERED)
  artistId   String?
  artist     ArtistUser? @relation(fields: [artistId], references: [id])
  createdAt  DateTime    @default(now())
}

model RoyaltyLog {
  id        String     @id @default(cuid())
  dspName   String     // Spotify, TikTok, YouTube Content ID
  amountIDR Int        // Disimpan dalam Rupiah penuh
  streams   Int
  artistId  String
  artist    ArtistUser @relation(fields: [artistId], references: [id])
  createdAt DateTime   @default(now())
}

model Testimonial {
  id          String   @id @default(cuid())
  city        String
  roleTag     String
  quote       String   @db.Text
  artistName  String
  project     String
  statsBadge  String
  highlighted Boolean  @default(false)
  createdAt   DateTime @default(now())
}

enum ReleaseStatus {
  PENDING_REVIEW
  INGESTING
  DELIVERED
}`;

const SERVER_ACTIONS_CODE = `// File: src/app/actions/music.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 1. Ambil semua data Katalog & Testimoni untuk Landing Page
export async function getLandingData() {
  const [releases, testimonials, totalTracks] = await Promise.all([
    prisma.release.findMany({
      where: { status: 'DELIVERED' },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.testimonial.findMany({
      orderBy: { createdAt: 'asc' },
      take: 3,
    }),
    prisma.release.count(),
  ])

  return { releases, testimonials, totalTracks }
}

// 2. Server Action untuk Pendaftaran Artis Baru dari Modal
export async function registerArtistAction(formData: FormData) {
  const bandOrArtist = formData.get('bandOrArtist') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!bandOrArtist || !email) {
    return { ok: false, message: 'Nama band & email wajib diisi.' }
  }

  const artist = await prisma.artistUser.create({
    data: {
      bandOrArtist,
      email,
      passwordHash: password, // Gunakan bcrypt.hash() di production
    },
  })

  revalidatePath('/')
  return { ok: true, artistId: artist.id }
}

// 3. Server Action untuk Submit Rilisan Baru ke Katalog
export async function createReleaseAction(formData: FormData) {
  const title = formData.get('title') as string
  const artistName = formData.get('artistName') as string
  const city = formData.get('city') as string
  const genre = formData.get('genre') as string
  const format = formData.get('format') as string

  const randomCat = 'BRK-2026-' + Math.floor(100 + Math.random() * 900)

  await prisma.release.create({
    data: {
      catalogNo: randomCat,
      title,
      artistName,
      city: city.toUpperCase(),
      genre: genre.toUpperCase(),
      format: format.toUpperCase(),
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=700&q=80',
    },
  })

  revalidatePath('/')
  return { ok: true }
}`;

export default function App() {
  // State Database Simulasi Prisma (Real-time di Preview)
  const [releases, setReleases] = useState(INITIAL_RELEASES);
  const [testimonials] = useState(INITIAL_TESTIMONIALS);
  const [registeredArtists, setRegisteredArtists] = useState([
    { id: 'usr_1', bandOrArtist: 'The Monochrome Youth', email: 'monochrome@bandung.id' }
  ]);

  // State UI & Interaksi
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [deckPlaying, setDeckPlaying] = useState(true);
  const [vuBars, setVuBars] = useState(() => Array.from({ length: 32 }, () => 45));

  // State Kalkulator Royalti
  const [selectedPlat, setSelectedPlat] = useState({ id: 'spotify', rate: 42 });
  const [streams, setStreams] = useState(250000);

  // State FAQ
  const [openFaq, setOpenFaq] = useState(0);

  // State Modal Tambah Rilisan Prisma
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [codeDrawerOpen, setCodeDrawerOpen] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('prisma');
  const [copiedCode, setCopiedCode] = useState(false);

  const fullHeroCopy =
    'Nggak perlu gabung major label buat masuk Spotify, Apple Music, atau TikTok. Di BREAKOUT.ID, master lagu tetap 100% punya lo, proses rilis nggak pakai drama, dan royalti cair langsung ke rekening BCA, Mandiri, atau GoPay.';

  // 1. Efek Ketikan (Typewriter)
  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      if (idx <= fullHeroCopy.length) {
        setTypewriterText(fullHeroCopy.slice(0, idx));
        idx++;
      } else {
        clearInterval(timer);
      }
    }, 26);
    return () => clearInterval(timer);
  }, []);

  // 2. Efek Studio VU Meter Berjalan
  useEffect(() => {
    if (!deckPlaying) {
      setVuBars(Array.from({ length: 32 }, () => 12));
      return;
    }
    const interval = setInterval(() => {
      setVuBars(Array.from({ length: 32 }, () => Math.floor(15 + Math.random() * 85)));
    }, 160);
    return () => clearInterval(interval);
  }, [deckPlaying]);

  // Handler Tambah Rilisan ke Katalog (Simulasi prisma.release.create)
  const handleAddRelease = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRel = {
      id: `rel_${Date.now()}`,
      catalogNo: `BRK-2026-${Math.floor(100 + Math.random() * 899)}`,
      title: (formData.get('title') as string) || 'Untitled',
      artistName: (formData.get('artistName') as string) || 'Artist',
      city: ((formData.get('city') as string) || 'JAKARTA').toUpperCase(),
      genre: ((formData.get('genre') as string) || 'INDIE').toUpperCase(),
      format: ((formData.get('format') as string) || 'SINGLE').toUpperCase(),
      coverUrl:
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=700&q=80',
    };
    setReleases((prev) => [newRel, ...prev.slice(0, 3)]);
    setReleaseModalOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Render teks typewriter dengan highlight pada BREAKOUT.ID
  const renderHighlightedTypewriter = () => {
    const parts = typewriterText.split('BREAKOUT.ID');
    if (parts.length === 1) return parts[0];
    return (
      <>
        {parts[0]}
        <strong className="text-[#F4F1EA] font-semibold">BREAKOUT.ID</strong>
        {parts[1]}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A09] text-[#F4F1EA] antialiased selection:bg-[#FF4D1C] selection:text-[#F4F1EA] overflow-x-hidden font-sans">
      {/* Inject Google Fonts & Keyframe Marquee */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

        .font-display { font-family: 'Syne', sans-serif; }
        .font-serif-italic { font-family: 'Instrument Serif', serif; }
        .font-mono-code { font-family: 'JetBrains Mono', monospace; }
        .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }

        .bg-noise {
          background-image: radial-gradient(rgba(244, 241, 234, 0.06) 1px, transparent 0);
          background-size: 24px 24px;
        }

        @keyframes tickerLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes tickerRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-ticker-left {
          animation: tickerLeft 36s linear infinite;
        }
        .animate-ticker-right {
          animation: tickerRight 36s linear infinite;
        }
        .ticker-wrap:hover .ticker-move {
          animation-play-state: paused;
        }
        .hard-shadow {
          box-shadow: 6px 6px 0px #262623;
        }
        input[type=range] {
          -webkit-appearance: none;
          background: transparent;
        }
        input[type=range]::-webkit-slider-runnable-track {
          height: 4px;
          background: #262623;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 22px;
          width: 14px;
          background: #FF4D1C;
          cursor: ew-resize;
          margin-top: -9px;
          border: 2px solid #F4F1EA;
        }
      `}</style>

      <div className="bg-noise min-h-screen">
        {/* ================= HEADER NAVIGATION ================= */}
        <header className="sticky top-0 z-40 bg-[#0A0A09]/95 backdrop-blur-md border-b border-[#262623]">
          <div className="w-full px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-[#FF4D1C] text-[#0A0A09] flex items-center justify-center font-mono-code font-bold text-lg tracking-tighter group-hover:bg-[#F4F1EA] transition-colors">
                B//
              </div>
              <div className="leading-none">
                <span className="font-display font-extrabold text-xl tracking-tight text-[#F4F1EA] block">
                  BREAKOUT.ID
                </span>
                <span className="font-mono-code text-[10px] text-[#8E8D8A] tracking-widest">
                  INDEPENDENT AUDIO DISTRO
                </span>
              </div>
            </a>

            {/* Center Navigation */}
            <nav className="hidden xl:flex items-center gap-7 text-xs font-mono-code uppercase tracking-wider text-[#8E8D8A]">
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
              <Link
                href="/login"
                className="px-4 py-2.5 font-mono-code text-xs uppercase text-[#F4F1EA] hover:text-[#FF4D1C] transition-colors"
              >
                [Log Masuk]
              </Link>

              <Link
                href="/register"
                className="px-5 py-2.5 bg-[#F4F1EA] text-[#0A0A09] font-mono-code font-bold text-xs uppercase tracking-wider hover:bg-[#FF4D1C] hover:text-[#F4F1EA] transition-colors"
              >
                Upload Master →
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 border border-[#262623] text-[#F4F1EA]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#121210] border-b border-[#262623] px-4 py-6 space-y-4 font-mono-code text-xs uppercase">
              <a href="#dsp-ticker" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#8E8D8A] hover:text-[#F4F1EA]">
                01. Jaringan DSP
              </a>
              <a href="#katalog" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#8E8D8A] hover:text-[#F4F1EA]">
                02. Rilisan Lokal
              </a>
              <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#8E8D8A] hover:text-[#F4F1EA]">
                03. Sistem
              </a>
              <a href="#kalkulator" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#8E8D8A] hover:text-[#F4F1EA]">
                04. Hitung Royalti
              </a>
              <a href="#testimoni" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-[#8E8D8A] hover:text-[#F4F1EA]">
                05. Kata Musisi
              </a>
              <div className="pt-4 border-t border-[#262623] flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 border border-[#262623] text-[#F4F1EA] text-center"
                >
                  Log Masuk Artis
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 bg-[#FF4D1C] text-[#F4F1EA] font-bold text-center"
                >
                  Upload Master →
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* ================= HERO SECTION (FULL-BLEED GRID) ================= */}
        <section className="w-full border-b border-[#262623]">
          <div className="grid lg:grid-cols-12 min-h-[calc(100vh-5rem)] items-stretch">
            {/* Left 7 Cols */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#262623]">
              <div className="space-y-8 my-auto py-4">
                <div className="inline-flex items-center gap-3 px-3 py-1.5 border border-[#262623] bg-[#121210] font-mono-code text-xs text-[#8E8D8A]">
                  <span className="text-[#FF4D1C] font-bold">● REC</span>
                  <span>DISTRIBUTOR MUSIK TANPA POTONGAN HAK CIPTA</span>
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-6xl xl:text-[74px] leading-[0.94] tracking-tight text-[#F4F1EA]">
                  BIKIN LAGU DI KAMAR.
                  <br />
                  <span className="font-serif-italic italic font-normal text-[#FF4D1C]">
                    Tayangin
                  </span>{' '}
                  KE SELURUH DUNIA.
                </h1>

                {/* Typewriter Paragraph */}
                <p className="text-[#8E8D8A] text-base sm:text-lg max-w-2xl leading-relaxed font-normal min-h-[5.5rem] sm:min-h-[4.5rem]">
                  <span>{renderHighlightedTypewriter()}</span>
                  <span className="inline-block w-2.5 h-5 bg-[#FF4D1C] align-middle ml-1 animate-pulse" />
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <Link
                    href="/register"
                    className="px-8 py-4 bg-[#FF4D1C] text-[#F4F1EA] font-mono-code font-bold text-sm uppercase tracking-wider hover:bg-[#F4F1EA] hover:text-[#0A0A09] transition-colors hard-shadow flex items-center justify-center gap-3"
                  >
                    <span>Mulai Rilis Sekarang</span>
                    <ArrowUpRight className="w-5 h-5" />
                  </Link>
                  <a
                    href="#kalkulator"
                    className="px-6 py-4 bg-[#121210] border border-[#262623] text-[#F4F1EA] font-mono-code text-xs uppercase tracking-wider hover:border-[#F4F1EA] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Cek Simulasi Royalti</span>
                  </a>
                </div>
              </div>

              {/* Bottom Footnote Stats */}
              <div className="pt-8 mt-8 border-t border-[#262623] grid grid-cols-3 gap-6 font-mono-code">
                <div>
                  <span className="text-xs text-[#8E8D8A] block">KATALOG PRISMA</span>
                  <span className="text-2xl sm:text-4xl font-bold text-[#F4F1EA]">
                    {(18396 + releases.length).toLocaleString('id-ID')}+
                  </span>
                  <span className="text-[11px] text-[#D4FF33] block mt-0.5">Track Independen</span>
                </div>
                <div className="border-l border-[#262623] pl-6">
                  <span className="text-xs text-[#8E8D8A] block">ROYALTI ARTIS</span>
                  <span className="text-2xl sm:text-4xl font-bold text-[#F4F1EA]">100%</span>
                  <span className="text-[11px] text-[#8E8D8A] block mt-0.5">Tanpa Komisi Gelap</span>
                </div>
                <div className="border-l border-[#262623] pl-6">
                  <span className="text-xs text-[#8E8D8A] block">MINIMUM WD</span>
                  <span className="text-2xl sm:text-4xl font-bold text-[#FF4D1C]">Rp 50rb</span>
                  <span className="text-[11px] text-[#8E8D8A] block mt-0.5">Tarik Kapan Aja</span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Master Audio Console */}
            <div className="lg:col-span-5 bg-[#121210] p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#262623] pb-4 mb-6 font-mono-code text-xs">
                <div>
                  <span className="text-[#8E8D8A] block text-[10px]">
                    MASTER AUDIO INSPECTOR // FULL RACK
                  </span>
                  <span className="text-[#F4F1EA] font-bold text-sm">{releases[0]?.catalogNo}</span>
                </div>
                <span className="px-2.5 py-1 bg-[#D4FF33]/15 text-[#D4FF33] border border-[#D4FF33]/40 text-[10px] font-bold">
                  DELIVERED TO 154 DSPs
                </span>
              </div>

              {/* Deck Player */}
              <div className="flex items-center gap-5 bg-[#0A0A09] border border-[#262623] p-5 mb-6">
                <div className="relative w-24 h-24 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80"
                    alt="Artwork"
                    className="w-full h-full object-cover grayscale contrast-125 border border-[#262623] relative z-10"
                  />
                  <div
                    className={`w-20 h-20 rounded-full bg-zinc-900 border-4 border-zinc-800 absolute -right-5 top-2 flex items-center justify-center ${
                      deckPlaying ? 'animate-spin' : ''
                    }`}
                    style={{ animationDuration: '12s' }}
                  >
                    <div className="w-6 h-6 rounded-full bg-[#FF4D1C] border-2 border-[#0A0A09]" />
                  </div>
                </div>
                <div className="pl-4 min-w-0 flex-1">
                  <span className="font-mono-code text-[10px] text-[#FF4D1C] uppercase tracking-widest">
                    PREVIEW RILISAN
                  </span>
                  <h3 className="font-display font-bold text-xl text-[#F4F1EA] truncate">
                    Perjalanan Pulang
                  </h3>
                  <p className="font-mono-code text-xs text-[#8E8D8A] truncate">
                    Kamar Belakang • WAV 24-Bit / 48kHz
                  </p>
                </div>
                <button
                  onClick={() => setDeckPlaying(!deckPlaying)}
                  className="w-12 h-12 bg-[#FF4D1C] text-[#F4F1EA] flex items-center justify-center shrink-0 hover:bg-[#F4F1EA] hover:text-[#0A0A09] transition-colors"
                  title="Putar / Jeda Sample"
                >
                  {deckPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>

              {/* VU Equalizer */}
              <div className="mb-6">
                <div className="flex justify-between font-mono-code text-[10px] text-[#8E8D8A] mb-2">
                  <span>
                    {deckPlaying ? 'STATUS: STREAMING MASTER PREVIEW' : 'STATUS: DECK PAUSED'}
                  </span>
                  <span>PEAK: -0.8 dB // TRUE PEAK PASS</span>
                </div>
                <div className="h-16 bg-[#0A0A09] border border-[#262623] p-2.5 flex items-end justify-between gap-1">
                  {vuBars.map((height, i) => (
                    <div
                      key={i}
                      className={`flex-1 transition-all duration-150 ${
                        i > 26 ? 'bg-[#FF4D1C]' : 'bg-[#D4FF33]'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Payout Ledger */}
              <div className="border-t border-[#262623] pt-5 space-y-2.5 font-mono-code text-xs">
                <div className="flex justify-between items-center text-[11px] text-[#8E8D8A] mb-1">
                  <span>LOG TRANSAKSI ROYALTI (PRISMA DB)</span>
                  <span>REAL-TIME SETTLEMENT</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-[#0A0A09] border border-[#262623]">
                  <span className="flex items-center gap-2.5 text-[#F4F1EA]">
                    <span className="w-2 h-2 rounded-full bg-[#1DB954]" /> Spotify ID & SG
                  </span>
                  <span className="text-[#D4FF33] font-bold">+ Rp 4.820.000</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-[#0A0A09] border border-[#262623]">
                  <span className="flex items-center gap-2.5 text-[#F4F1EA]">
                    <span className="w-2 h-2 rounded-full bg-[#00F2FE]" /> TikTok Sound Usage
                  </span>
                  <span className="text-[#D4FF33] font-bold">+ Rp 1.945.000</span>
                </div>
                <div className="flex justify-between items-center py-3 px-4 bg-[#0A0A09] border border-[#262623]">
                  <span className="flex items-center gap-2.5 text-[#F4F1EA]">
                    <span className="w-2 h-2 rounded-full bg-[#FF0000]" /> YouTube Content ID
                  </span>
                  <span className="text-[#D4FF33] font-bold">+ Rp 2.310.000</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ANIMASI PLATFORM BERJALAN (DUAL MARQUEE 50+ DSPs) ================= */}
        <section id="dsp-ticker" className="border-b border-[#262623] bg-[#121210] relative overflow-hidden">
          <div className="w-full px-4 sm:px-8 lg:px-12 py-4 border-b border-[#262623] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono-code text-xs">
              <span className="px-2 py-0.5 bg-[#FF4D1C] text-[#F4F1EA] font-bold">LIVE FEED</span>
              <span className="text-[#F4F1EA] uppercase">
                JARINGAN RESMI 50+ DIGITAL SERVICE PROVIDERS (DSP) GLOBAL & ASIA
              </span>
            </div>
            <span className="font-mono-code text-[11px] text-[#8E8D8A]">
              ARAHKAN KURSOR UNTUK BERHENTI • LOGO RESMI GOOGLE VERIFIKASI
            </span>
          </div>

          {/* Baris 1: Ke Kiri */}
          <div className="ticker-wrap flex overflow-hidden border-b border-[#262623] select-none bg-[#0A0A09]">
            <div className="ticker-move flex animate-ticker-left min-w-max">
              {[...DSP_ROW_1, ...DSP_ROW_1].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 px-6 py-4 border-r border-[#262623] hover:bg-[#121210] transition-colors shrink-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-[#F4F1EA] text-sm">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="font-mono-code text-[10px] px-1.5 py-0.5 bg-[#262623] text-[#D4FF33]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="font-mono-code text-[11px] text-[#8E8D8A] truncate max-w-[240px]">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Baris 2: Ke Kanan */}
          <div className="ticker-wrap flex overflow-hidden select-none bg-[#0A0A09]">
            <div className="ticker-move flex animate-ticker-right min-w-max">
              {[...DSP_ROW_2, ...DSP_ROW_2].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 px-6 py-4 border-r border-[#262623] hover:bg-[#121210] transition-colors shrink-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-[#F4F1EA] text-sm">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="font-mono-code text-[10px] px-1.5 py-0.5 bg-[#262623] text-[#D4FF33]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="font-mono-code text-[11px] text-[#8E8D8A] truncate max-w-[240px]">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= KATALOG RILISAN (TERHUBUNG KE STATE PRISMA) ================= */}
        <section id="katalog" className="w-full border-b border-[#262623]">
          <div className="px-4 sm:px-8 lg:px-12 py-12 border-b border-[#262623] flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono-code text-xs text-[#FF4D1C] uppercase tracking-widest">
                // ARSIP RILISAN TERBARU (PRISMA MODEL: RELEASE)
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F4F1EA] mt-2">
                DARI GIGS KECIL SAMPAI{' '}
                <span className="font-serif-italic italic font-normal">Chart Viral.</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setReleaseModalOpen(true)}
                className="px-4 py-3 bg-[#121210] border border-[#D4FF33]/50 text-[#D4FF33] font-mono-code text-xs uppercase hover:bg-[#D4FF33] hover:text-[#0A0A09] transition-colors"
              >
                + Simulasi Insert Rilisan (Prisma)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#262623]">
            {releases.map((rel) => (
              <div
                key={rel.id}
                className="bg-[#121210] p-6 sm:p-8 lg:p-10 group hover:bg-[#0A0A09] transition-colors"
              >
                <div className="aspect-square overflow-hidden bg-[#0A0A09] mb-6 relative border border-[#262623]">
                  <img
                    src={rel.coverUrl}
                    alt={rel.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#0A0A09]/90 border border-[#262623] px-2.5 py-1 font-mono-code text-[10px] text-[#D4FF33]">
                    {rel.format}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-[#0A0A09]/90 border border-[#262623] px-2 py-0.5 font-mono-code text-[10px] text-[#8E8D8A]">
                    {rel.catalogNo}
                  </span>
                </div>
                <div className="font-mono-code text-xs text-[#FF4D1C]">
                  {rel.city} // {rel.genre}
                </div>
                <h3 className="font-display font-bold text-2xl text-[#F4F1EA] mt-1">{rel.title}</h3>
                <p className="text-sm text-[#8E8D8A] mt-0.5">{rel.artistName}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FITUR UTAMA (FULL-SCREEN 3 KOLOM) ================= */}
        <section id="fitur" className="w-full border-b border-[#262623]">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#262623]">
            <div className="p-8 sm:p-12 lg:p-16 space-y-5 bg-[#0A0A09] hover:bg-[#121210] transition-colors">
              <div className="flex items-center justify-between font-mono-code text-xs text-[#8E8D8A]">
                <span>[FITUR // 01]</span>
                <Banknote className="w-6 h-6 text-[#FF4D1C]" />
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F1EA]">
                Cair ke Rekening Lokal Tanpa Potongan Kurs
              </h3>
              <p className="text-[#8E8D8A] text-sm sm:text-base leading-relaxed">
                Kalau pakai agregator luar, lo kena biaya PayPal atau potongan wire transfer ratusan
                ribu. Di sini saldo royalti langsung cair ke BCA, Mandiri, BNI, BRI, atau GoPay
                dalam Rupiah.
              </p>
            </div>

            <div className="p-8 sm:p-12 lg:p-16 space-y-5 bg-[#0A0A09] hover:bg-[#121210] transition-colors">
              <div className="flex items-center justify-between font-mono-code text-xs text-[#8E8D8A]">
                <span>[FITUR // 02]</span>
                <Users className="w-6 h-6 text-[#D4FF33]" />
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F1EA]">
                Bagi Hasil Band & Produser Otomatis
              </h3>
              <p className="text-[#8E8D8A] text-sm sm:text-base leading-relaxed">
                Nggak perlu repot ngitung manual tiap bulan di grup WhatsApp band. Atur persentase
                royalti tiap personel atau featuring artist, uang langsung kebagi otomatis ke akun
                masing-masing.
              </p>
            </div>

            <div className="p-8 sm:p-12 lg:p-16 space-y-5 bg-[#0A0A09] hover:bg-[#121210] transition-colors">
              <div className="flex items-center justify-between font-mono-code text-xs text-[#8E8D8A]">
                <span>[FITUR // 03]</span>
                <Zap className="w-6 h-6 text-[#FF4D1C]" />
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F1EA]">
                Tim Kurator Manusia, Bukan Bot
              </h3>
              <p className="text-[#8E8D8A] text-sm sm:text-base leading-relaxed">
                Rilisan ketahan gara-gara salah ukuran cover atau penulisan judul? Tim A&R kita di
                Jakarta bakal bantu benerin via WhatsApp sampai lagu lo berhasil tayang.
              </p>
            </div>
          </div>
        </section>

        {/* ================= KALKULATOR ROYALTI ================= */}
        <section id="kalkulator" className="w-full border-b border-[#262623] bg-[#121210]/40">
          <div className="grid lg:grid-cols-12 items-stretch">
            <div className="lg:col-span-5 p-6 sm:p-10 lg:p-16 flex flex-col justify-center space-y-5 border-b lg:border-b-0 lg:border-r border-[#262623]">
              <span className="font-mono-code text-xs text-[#FF4D1C] uppercase tracking-widest">
                // SIMULASI PENDAPATAN
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F4F1EA] leading-tight">
                BERAPA RUPIAH DARI STREAMING LO?
              </h2>
              <p className="text-[#8E8D8A] text-sm sm:text-base leading-relaxed">
                Angka di samping adalah hitungan rata-rata tarif Pay-Per-Stream bersih untuk
                pendengar region Indonesia & Asia Tenggara. Pilih platform dan geser jumlah streams.
              </p>
              <div className="pt-2 font-mono-code text-xs text-[#8E8D8A] space-y-1.5">
                <p>
                  • Artis terima <strong className="text-[#F4F1EA]">100% penuh</strong>
                </p>
                <p>• Sudah termasuk kode ISRC & UPC resmi</p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0A0A09] p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 font-mono-code text-xs">
                {[
                  { id: 'spotify', label: '01. Spotify', rate: 42 },
                  { id: 'apple', label: '02. Apple', rate: 78 },
                  { id: 'youtube', label: '03. YouTube', rate: 28 },
                  { id: 'tiktok', label: '04. TikTok', rate: 35 },
                ].map((plat) => (
                  <button
                    key={plat.id}
                    onClick={() => setSelectedPlat(plat)}
                    className={`py-4 px-4 border uppercase text-left transition-colors ${
                      selectedPlat.id === plat.id
                        ? 'border-[#FF4D1C] bg-[#FF4D1C] text-[#F4F1EA] font-bold'
                        : 'border-[#262623] bg-[#121210] text-[#8E8D8A] hover:text-[#F4F1EA]'
                    }`}
                  >
                    {plat.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-baseline font-mono-code">
                  <span className="text-xs text-[#8E8D8A]">JUMLAH PLAYS / STREAMS:</span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#F4F1EA]">
                    {streams.toLocaleString('id-ID')} PLAYS
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="10000"
                  value={streams}
                  onChange={(e) => setStreams(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between font-mono-code text-[10px] text-[#8E8D8A]">
                  <span>10.000</span>
                  <span>1.000.000</span>
                  <span>2.500.000</span>
                  <span>5.000.000</span>
                </div>
              </div>

              <div className="bg-[#121210] border border-[#262623] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono-code text-[11px] text-[#8E8D8A] block">
                    ESTIMASI ROYALTI BERSIH (100%):
                  </span>
                  <span className="font-mono-code font-bold text-3xl sm:text-5xl text-[#D4FF33] block mt-1">
                    Rp {(streams * selectedPlat.rate).toLocaleString('id-ID')}
                  </span>
                </div>
                <Link
                  href="/register"
                  className="px-6 py-4 bg-[#F4F1EA] text-[#0A0A09] font-mono-code font-bold text-xs uppercase hover:bg-[#FF4D1C] hover:text-[#F4F1EA] transition-colors shrink-0 text-center"
                >
                  Upload Lagu →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONI MUSISI (FULL-BLEED GRID) ================= */}
        <section id="testimoni" className="w-full border-b border-[#262623]">
          <div className="px-4 sm:px-8 lg:px-12 py-12 border-b border-[#262623] flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono-code text-xs text-[#FF4D1C] uppercase tracking-widest">
                // SUARA DARI BACKSTAGE (PRISMA MODEL: TESTIMONIAL)
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F4F1EA] mt-2">
                KATA MEREKA YANG UDAH{' '}
                <span className="font-serif-italic italic font-normal text-[#D4FF33]">
                  Pindah Ke Sini.
                </span>
              </h2>
            </div>
            <p className="font-mono-code text-xs text-[#8E8D8A] max-w-sm">
              Catatan jujur dari band independen, produser kamar, sampai kolektif label yang rilis
              lewat BREAKOUT.ID.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#262623] items-stretch">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className={`${
                  item.highlighted ? 'bg-[#0A0A09]' : 'bg-[#121210] hover:bg-[#0A0A09]'
                } p-8 sm:p-12 lg:p-14 flex flex-col justify-between transition-colors`}
              >
                <div>
                  <div className="flex justify-between items-center font-mono-code text-xs text-[#8E8D8A] pb-4 border-b border-[#262623]">
                    <span className={item.highlighted ? 'text-[#FF4D1C]' : ''}>
                      LOG // {item.city}
                    </span>
                    <span className="text-[#D4FF33]">{item.roleTag}</span>
                  </div>
                  <p className="font-sans text-lg sm:text-xl text-[#F4F1EA] leading-relaxed mt-8">
                    "{item.quote}"
                  </p>
                </div>
                <div className="mt-10 pt-6 border-t border-[#262623] flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-lg text-[#F4F1EA]">
                      {item.artistName}
                    </h4>
                    <span
                      className={`font-mono-code text-xs block ${
                        item.highlighted ? 'text-[#D4FF33]' : 'text-[#FF4D1C]'
                      }`}
                    >
                      {item.project}
                    </span>
                  </div>
                  <span className="font-mono-code text-[11px] px-2.5 py-1 bg-[#0A0A09] border border-[#262623] text-[#8E8D8A]">
                    {item.statsBadge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="w-full border-b border-[#262623]">
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-4 p-6 sm:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#262623]">
              <span className="font-mono-code text-xs text-[#FF4D1C] uppercase">// TANYA JAWAB</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F4F1EA] mt-2">
                YANG SERING DITANYAIN MUSISI.
              </h2>
              <p className="text-[#8E8D8A] text-xs font-mono-code mt-3">
                Masih bingung? Chat langsung tim A&R kita di jam kerja.
              </p>
            </div>
            <div className="lg:col-span-8 divide-y divide-[#262623]">
              {[
                {
                  q: 'Kalau tahun depan gue lupa perpanjang, lagu gue kehapus nggak?',
                  a: 'Nggak bakal langsung kita takedown. Kalau masa aktif habis dan belum diperpanjang, lagu lo tetap tayang dan cuma dialihkan otomatis ke skema bagi hasil 90/10 dari royalti yang masuk.',
                },
                {
                  q: 'Bisa sekalian urus centang biru Spotify for Artists & Official Artist Channel YouTube?',
                  a: 'Bisa banget. Begitu rilisan pertama lo terdeliver ke Spotify dan YouTube, tombol klaim instan langsung kebuka di dashboard BREAKOUT.ID tanpa perlu syarat minimal jumlah followers.',
                },
                {
                  q: 'Spek file audio dan artwork yang wajib disiapin apa aja?',
                  a: 'File master audio wajib format WAV (minimal 16-bit / 44.1 kHz Stereo, jangan MP3 hasil convert). Buat cover art ukurannya persegi 3000 x 3000 pixel format JPG/PNG.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="p-6 sm:p-10">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full flex items-center justify-between text-left font-display font-bold text-lg sm:text-xl text-[#F4F1EA]"
                  >
                    <span>{faq.q}</span>
                    <span className="font-mono-code text-[#FF4D1C] text-xl ml-4">
                      {openFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === idx && (
                    <p className="mt-3 text-sm sm:text-base text-[#8E8D8A] leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="w-full px-4 sm:px-8 lg:px-12 py-12 font-mono-code text-xs text-[#8E8D8A]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-10 border-b border-[#262623]">
            <div>
              <span className="font-display font-extrabold text-2xl text-[#F4F1EA] block">
                BREAKOUT.ID
              </span>
              <span>PT BREAKOUT DISTRIBUSI MUSIK INDONESIA — INDEPENDENT AUDIO DISTRO</span>
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
            <span>© 2026 BREAKOUT.ID — HAK CIPTA MILIK MASING-MASING MUSISI.</span>
            <span>ARTIS TERDAFTAR SESI INI: {registeredArtists.length} AKUN</span>
          </div>
        </footer>
      </div>

      {/* ================= MODAL SIMULASI INSERT RILISAN PRISMA ================= */}
      {releaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A09]/90 backdrop-blur-sm">
          <div className="bg-[#121210] border-2 border-[#D4FF33] max-w-md w-full p-6 sm:p-8 relative hard-shadow">
            <button
              onClick={() => setReleaseModalOpen(false)}
              className="absolute top-4 right-4 px-2 py-1 border border-[#262623] font-mono-code text-xs text-[#8E8D8A] hover:text-[#F4F1EA]"
            >
              [X]
            </button>
            <span className="font-mono-code text-[11px] text-[#D4FF33] uppercase">
              // PRISMA MUTATION: prisma.release.create()
            </span>
            <h3 className="font-display font-bold text-2xl text-[#F4F1EA] mt-1">
              Tambah Rilisan Baru
            </h3>
            <form onSubmit={handleAddRelease} className="space-y-4 font-mono-code text-xs mt-4">
              <div>
                <label className="block text-[#F4F1EA] mb-1">Judul Lagu / Album</label>
                <input
                  name="title"
                  required
                  placeholder="Contoh: Senja di Cicalengka"
                  className="w-full px-3 py-2.5 bg-[#0A0A09] border border-[#262623] text-[#F4F1EA]"
                />
              </div>
              <div>
                <label className="block text-[#F4F1EA] mb-1">Nama Band / Artis</label>
                <input
                  name="artistName"
                  required
                  placeholder="Contoh: Unit Selatan"
                  className="w-full px-3 py-2.5 bg-[#0A0A09] border border-[#262623] text-[#F4F1EA]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4F1EA] mb-1">Kota</label>
                  <input
                    name="city"
                    required
                    placeholder="BANDUNG"
                    className="w-full px-3 py-2.5 bg-[#0A0A09] border border-[#262623] text-[#F4F1EA]"
                  />
                </div>
                <div>
                  <label className="block text-[#F4F1EA] mb-1">Genre</label>
                  <input
                    name="genre"
                    required
                    placeholder="SHOEGAZE"
                    className="w-full px-3 py-2.5 bg-[#0A0A09] border border-[#262623] text-[#F4F1EA]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#F4F1EA] mb-1">Format</label>
                <select
                  name="format"
                  className="w-full px-3 py-2.5 bg-[#0A0A09] border border-[#262623] text-[#F4F1EA]"
                >
                  <option value="SINGLE">SINGLE</option>
                  <option value="EP • 5 TRACKS">EP • 5 TRACKS</option>
                  <option value="LP • 10 TRACKS">LP • 10 TRACKS</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-[#D4FF33] text-[#0A0A09] font-bold uppercase"
              >
                Insert ke Katalog →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= DRAWER KODE NEXT.JS + PRISMA UNTUK DI-COPAS ================= */}
      {codeDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#0A0A09]/85 backdrop-blur-sm">
          <div className="bg-[#121210] border-l-2 border-[#D4FF33] w-full max-w-3xl h-full flex flex-col">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#262623] flex items-center justify-between">
              <div>
                <span className="font-mono-code text-[11px] text-[#D4FF33] uppercase block">
                  // FULL-STACK BOILERPLATE UNTUK PROYEK NEXT.JS ANDA
                </span>
                <h3 className="font-display font-bold text-xl text-[#F4F1EA]">
                  File Schema Prisma & Server Actions Next.js
                </h3>
              </div>
              <button
                onClick={() => setCodeDrawerOpen(false)}
                className="px-3 py-1.5 border border-[#262623] font-mono-code text-xs text-[#F4F1EA] hover:border-[#FF4D1C]"
              >
                [TUTUP X]
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#262623] font-mono-code text-xs bg-[#0A0A09]">
              <button
                onClick={() => setActiveCodeTab('prisma')}
                className={`px-5 py-3.5 border-r border-[#262623] flex items-center gap-2 ${
                  activeCodeTab === 'prisma'
                    ? 'bg-[#FF4D1C] text-[#F4F1EA] font-bold'
                    : 'text-[#8E8D8A] hover:text-[#F4F1EA]'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>1. prisma/schema.prisma</span>
              </button>
              <button
                onClick={() => setActiveCodeTab('actions')}
                className={`px-5 py-3.5 border-r border-[#262623] flex items-center gap-2 ${
                  activeCodeTab === 'actions'
                    ? 'bg-[#FF4D1C] text-[#F4F1EA] font-bold'
                    : 'text-[#8E8D8A] hover:text-[#F4F1EA]'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>2. src/app/actions/music.ts</span>
              </button>
              <button
                onClick={() => setActiveCodeTab('setup')}
                className={`px-5 py-3.5 flex items-center gap-2 ${
                  activeCodeTab === 'setup'
                    ? 'bg-[#FF4D1C] text-[#F4F1EA] font-bold'
                    : 'text-[#8E8D8A] hover:text-[#F4F1EA]'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>3. Cara Pasang di Next.js</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="p-6 overflow-y-auto flex-1 font-mono-code text-xs">
              {activeCodeTab === 'prisma' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#8E8D8A]">
                      Salin kode ini ke dalam file <code>prisma/schema.prisma</code>:
                    </span>
                    <button
                      onClick={() => copyToClipboard(PRISMA_SCHEMA_CODE)}
                      className="px-3 py-1.5 bg-[#D4FF33] text-[#0A0A09] font-bold flex items-center gap-1.5"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'TERSALIN!' : 'COPY SCHEMA'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-[#0A0A09] border border-[#262623] text-[#D4FF33] overflow-x-auto leading-relaxed">
                    {PRISMA_SCHEMA_CODE}
                  </pre>
                </div>
              )}

              {activeCodeTab === 'actions' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[#8E8D8A]">
                      Salin kode ini ke dalam file <code>src/app/actions/music.ts</code>:
                    </span>
                    <button
                      onClick={() => copyToClipboard(SERVER_ACTIONS_CODE)}
                      className="px-3 py-1.5 bg-[#D4FF33] text-[#0A0A09] font-bold flex items-center gap-1.5"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'TERSALIN!' : 'COPY SERVER ACTIONS'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-[#0A0A09] border border-[#262623] text-[#F4F1EA] overflow-x-auto leading-relaxed">
                    {SERVER_ACTIONS_CODE}
                  </pre>
                </div>
              )}

              {activeCodeTab === 'setup' && (
                <div className="space-y-4 text-[#F4F1EA] leading-relaxed">
                  <div className="p-4 bg-[#0A0A09] border border-[#262623]">
                    <p className="text-[#D4FF33] font-bold mb-2">
                      LANGKAH 1 — Install Dependency di Proyek Next.js Anda:
                    </p>
                    <code className="block bg-[#121210] p-3 text-[#F4F1EA]">
                      npm install prisma @prisma/client lucide-react
                    </code>
                  </div>

                  <div className="p-4 bg-[#0A0A09] border border-[#262623]">
                    <p className="text-[#D4FF33] font-bold mb-2">
                      LANGKAH 2 — Copy Komponen UI Ini:
                    </p>
                    <p className="text-[#8E8D8A]">
                      Seluruh kode di editor sebelah kanan ini sudah menggunakan sintaks{' '}
                      <code>'use client'</code> React/Next.js dengan <code>lucide-react</code>. Anda
                      tinggal copy seluruh isi file ini ke{' '}
                      <code>src/app/page.tsx</code> atau <code>src/components/LandingBreakout.tsx</code>.
                    </p>
                  </div>

                  <div className="p-4 bg-[#0A0A09] border border-[#262623]">
                    <p className="text-[#D4FF33] font-bold mb-2">
                      LANGKAH 3 — Push Schema Prisma ke Database:
                    </p>
                    <code className="block bg-[#121210] p-3 text-[#F4F1EA]">
                      npx prisma generate && npx prisma db push
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
