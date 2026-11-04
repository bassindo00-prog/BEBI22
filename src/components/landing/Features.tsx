"use client";

import React, { useRef } from "react";
import BentoTilt from "./BentoTilt";
import { ArrowUpRight, Zap, Check, Radio } from "lucide-react";
import Link from "next/link";

const PLATFORMS = [
  {
    name: "Spotify",
    type: "Lossless • Canvas • Discovery",
    color: "#1DB954",
    reach: "600M+ Listeners",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.216.353-.674.464-1.027.249-2.812-1.718-6.352-2.107-10.522-1.155-.403.092-.804-.16-.896-.563-.092-.402.16-.804.563-.896 4.568-1.044 8.484-.604 11.633 1.328.353.216.464.674.249 1.037zm1.468-3.262c-.272.441-.853.582-1.294.31-3.218-1.977-8.125-2.55-11.93-1.394-.497.151-1.026-.134-1.177-.631-.151-.497.134-1.026.631-1.177 4.35-1.32 9.774-.68 13.46 1.588.441.272.582.853.31 1.304zm.126-3.41c-3.858-2.29-10.222-2.502-13.916-1.381-.592.18-1.222-.158-1.402-.75-.18-.592.158-1.222.75-1.402 4.25-1.29 11.282-1.045 15.72 1.591.533.316.707 1.008.391 1.541-.316.533-1.008.707-1.543.391z" />
      </svg>
    ),
  },
  {
    name: "Apple Music",
    type: "Spatial Audio • Dolby Atmos",
    color: "#FA243C",
    reach: "167 Countries",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.56-.68.94-1.63.84-2.58-.81.03-1.8.54-2.38 1.22-.51.59-.96 1.55-.84 2.48.9.07 1.82-.44 2.38-1.12z" />
      </svg>
    ),
  },
  {
    name: "YouTube Music",
    type: "Content ID • Official Artist Channel",
    color: "#FF0000",
    reach: "2 Billion+ Viewers",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    type: "Sound Sync • Creator Clips",
    color: "#00F2FE",
    reach: "1 Billion+ Users",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.05 1.1 1.93 2.13 2.22 1.09.33 2.37.13 3.28-.56.64-.47 1.05-1.17 1.17-1.96.09-.76.07-1.52.07-2.28V.02z" />
      </svg>
    ),
  },
  {
    name: "Deezer",
    type: "HiFi FLAC • Flow Engine",
    color: "#A238FF",
    reach: "180+ Territories",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.81 4.19v3.42H24V4.19h-5.19zM12.54 8.28v3.42h5.19V8.28h-5.19zm6.27 0v3.42H24V8.28h-5.19zM6.27 12.38v3.42h5.19v-3.42H6.27zm6.27 0v3.42h5.19v-3.42h-5.19zm6.27 0v3.42H24v-3.42h-5.19zM0 16.47v3.42h5.19v-3.42H0zm6.27 0v3.42h5.19v-3.42H6.27zm6.27 0v3.42h5.19v-3.42h-5.19zm6.27 0v3.42H24v-3.42h-5.19z" />
      </svg>
    ),
  },
  {
    name: "Amazon Music",
    type: "Ultra HD • Alexa Voice Stream",
    color: "#00A8E1",
    reach: "Prime Ecosystem",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.88 15.65c-2.37 1.72-5.75 2.65-8.68 2.65-4.12 0-7.83-1.63-10.63-4.36-.22-.21-.02-.5.25-.34 3.03 1.76 6.72 2.82 10.5 2.82 2.6 0 5.58-.6 8.3-1.89.41-.2.74.28.26.56v-.44zm1.31-1.34c-.3-.39-2.02-.18-2.79-.09-.24.03-.27-.18-.06-.33 1.37-.99 3.63-.7 3.9-.36.27.35-.07 2.62-1.37 3.7-.2.17-.39.08-.3-.15.29-.71.92-2.38.62-2.77zm8.81 2.37c-.33-.26-.78-.25-1.07.03-1.5 1.45-3.35 2.47-5.4 2.97-.4.1-.64.49-.54.89.1.4.49.64.89.54 2.37-.58 4.51-1.76 6.25-3.44.29-.29.27-.75-.13-.99zM15.93 6.9c-.39 0-.74.19-.94.49l-.08.12V7.1c0-.4-.32-.72-.72-.72h-1.6c-.4 0-.72.32-.72.72v8.83c0 .4.32.72.72.72h1.6c.4 0 .72-.32.72-.72v-4.9c0-1.57.94-2.58 2.22-2.58 1.25 0 2.05.9 2.05 2.31v5.17c0 .4.32.72.72.72h1.6c.4 0 .72-.32.72-.72v-5.63c0-2.48-1.54-4.08-3.79-4.08-.2 0-.39.01-.58.03z" />
      </svg>
    ),
  },
  {
    name: "Instagram & Meta",
    type: "Reels • Stories • Sound Library",
    color: "#E1306C",
    reach: "3B+ Users",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="distribution" className="relative bg-[#050508] pb-36 pt-24 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-orange-400">
            <Radio className="h-3.5 w-3.5" />
            Global DSP Network
          </div>

          <h2 className="font-zentry text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-white mt-4 leading-[0.95]">
            ONE RELEASE.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-purple-400">
              GLOBAL REACH.
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm md:text-base text-white/70 leading-relaxed font-normal">
            Upload your tracks once and deliver simultaneously to every top streaming
            service, social platform, and digital radio provider across 190+ countries.
          </p>
        </div>

        {/* Feature 1 — Master Video Bento Card (feature-1.mp4) */}
        <BentoTilt className="relative mb-7 h-96 w-full overflow-hidden rounded-3xl border border-white/20 md:h-[65vh]">
          <video
            src="/videos/feature-1.mp4"
            loop
            playsInline
            autoPlay
            muted
            className="absolute inset-0 size-full object-cover object-center filter brightness-[0.45] saturate-[1.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <div className="relative z-10 flex size-full flex-col justify-between p-8 md:p-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-orange-400">
                FLAGSHIP DIRECT INGEST
              </span>
              <h3 className="font-zentry text-3xl md:text-6xl font-black uppercase text-white mt-2">
                DIRECT DSP PIPELINE
              </h3>
              <p className="mt-3 max-w-lg text-xs md:text-sm text-white/80 leading-relaxed font-normal">
                Skip the middleman. BREAKOUT ID delivers via automated DDEX direct feeds
                with zero transcoding loss, supporting 24-bit/192kHz WAV, Dolby Atmos, and Apple Digital Masters.
              </p>
            </div>

            {/* Platform Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
              {PLATFORMS.slice(0, 4).map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur-md"
                >
                  <div style={{ color: p.color }}>{p.icon}</div>
                  <div>
                    <h5 className="font-bold text-xs text-white leading-tight">{p.name}</h5>
                    <span className="text-[10px] text-white/50 font-mono">{p.reach}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BentoTilt>

        {/* Bento Grid with feature-2.mp4, feature-3.mp4, feature-4.mp4, feature-5.mp4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {/* Bento Tilt 1: feature-2.mp4 */}
          <BentoTilt className="relative min-h-[360px] overflow-hidden rounded-3xl border border-white/15 group">
            <video
              src="/videos/feature-2.mp4"
              loop
              playsInline
              autoPlay
              muted
              className="absolute inset-0 size-full object-cover filter brightness-[0.4] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="relative z-10 flex size-full flex-col justify-between p-7">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-purple-400">
                  PRIORITY VELOCITY
                </span>
                <h4 className="font-zentry text-2xl md:text-3xl font-black uppercase text-white mt-1">
                  24-48 HOUR GO-LIVE
                </h4>
                <p className="mt-2 text-xs text-white/70 leading-relaxed font-normal">
                  Fast-track catalog review queue ensures your release hits digital storefronts on your scheduled rollout.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-2">
                <Check className="h-4 w-4" /> <span>ISRC & UPC Automated</span>
              </div>
            </div>
          </BentoTilt>

          {/* Bento Tilt 2: feature-3.mp4 */}
          <BentoTilt className="relative min-h-[360px] overflow-hidden rounded-3xl border border-white/15 group">
            <video
              src="/videos/feature-3.mp4"
              loop
              playsInline
              autoPlay
              muted
              className="absolute inset-0 size-full object-cover filter brightness-[0.4] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="relative z-10 flex size-full flex-col justify-between p-7">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-orange-400">
                  VIRAL SYNC
                </span>
                <h4 className="font-zentry text-2xl md:text-3xl font-black uppercase text-white mt-1">
                  TIKTOK & REELS SOUND
                </h4>
                <p className="mt-2 text-xs text-white/70 leading-relaxed font-normal">
                  Earn micro-sync royalties every time a creator uses your sound in clips, stories, or viral trends.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs font-mono text-orange-300 flex items-center gap-2">
                <Zap className="h-4 w-4" /> <span>Auto Content ID Claim</span>
              </div>
            </div>
          </BentoTilt>

          {/* Bento Tilt 3: feature-4.mp4 */}
          <BentoTilt className="relative min-h-[360px] overflow-hidden rounded-3xl border border-white/15 group">
            <video
              src="/videos/feature-4.mp4"
              loop
              playsInline
              autoPlay
              muted
              className="absolute inset-0 size-full object-cover filter brightness-[0.4] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="relative z-10 flex size-full flex-col justify-between p-7">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  AUDIOPHILE CHANNELS
                </span>
                <h4 className="font-zentry text-2xl md:text-3xl font-black uppercase text-white mt-1">
                  AMAZON & DEEZER HIFI
                </h4>
                <p className="mt-2 text-xs text-white/70 leading-relaxed font-normal">
                  High-definition audio encoding with Alexa voice streaming and lossless FLAC distribution worldwide.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-white/60">
                <div className="text-[#00A8E1]">{PLATFORMS[5].icon}</div>
                <div className="text-[#A238FF]">{PLATFORMS[4].icon}</div>
                <span className="font-mono text-[11px]">Lossless FLAC</span>
              </div>
            </div>
          </BentoTilt>

          {/* Bento Tilt 4: CTA Card with feature-5.mp4 */}
          <BentoTilt className="relative min-h-[280px] md:col-span-2 lg:col-span-2 overflow-hidden rounded-3xl border border-orange-500/40 group">
            <video
              src="/videos/feature-5.mp4"
              loop
              playsInline
              autoPlay
              muted
              className="absolute inset-0 size-full object-cover filter brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="relative z-10 flex size-full flex-col justify-between p-8 md:p-10">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-orange-400">
                  START DISTRIBUTING TODAY
                </span>
                <h4 className="font-zentry text-3xl md:text-4xl font-black uppercase text-white mt-1">
                  TAKE YOUR MUSIC WORLDWIDE
                </h4>
                <p className="mt-2 text-xs md:text-sm text-white/80 max-w-md leading-relaxed">
                  Join thousands of independent artists and record labels launching music globally with BREAKOUT ID.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <span>CREATE ACCOUNT</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="text-xs uppercase font-mono tracking-wider text-white/80 hover:text-white px-4 py-2"
                >
                  ARTIST LOGIN →
                </Link>
              </div>
            </div>
          </BentoTilt>

          {/* Bento Tilt 5: Quick Stats */}
          <BentoTilt className="relative min-h-[280px] overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-purple-950/40 via-black to-[#050508] p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-300">
                PLATFORM SCALE
              </span>
              <div className="mt-3">
                <span className="font-zentry text-5xl font-black text-white">190+</span>
                <p className="text-xs text-white/60 mt-1 font-mono">GLOBAL TERRITORIES</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs font-mono text-white/50 space-y-1">
              <p>• 150+ Direct DSP Deals</p>
              <p>• Zero Cut on Masters</p>
              <p>• Instant Payout Routing</p>
            </div>
          </BentoTilt>
        </div>
      </div>
    </section>
  );
}
