"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Play, Disc3, Sparkles, Volume2 } from "lucide-react";

const HERO_TRACKS = [
  {
    title: "Midnight Synth",
    artist: "Avelin FX",
    genre: "Synthwave / Cyberpunk",
    bpm: "128 BPM",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop",
    gradient: "from-orange-500/30 via-purple-600/20 to-black",
  },
  {
    title: "Velvet Horizon",
    artist: "Hermes Sound",
    genre: "Chill R&B / Neo-Soul",
    bpm: "92 BPM",
    cover: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop",
    gradient: "from-purple-600/30 via-orange-500/20 to-black",
  },
  {
    title: "Neon Pulse",
    artist: "District 22",
    genre: "Melodic Techno",
    bpm: "126 BPM",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    gradient: "from-amber-500/30 via-fuchsia-600/20 to-black",
  },
];

export default function Hero() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const miniTileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Zentry-style clip-path scroll interaction on the hero frame
      gsap.set("#video-frame", {
        clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
        borderRadius: "0 0 35% 15%",
      });

      gsap.from("#video-frame", {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        borderRadius: "0 0 0 0",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#video-frame",
          start: "center center",
          end: "bottom center",
          scrub: true,
        },
      });

      // Ambient pulse for floating elements
      gsap.to(".hero-float", {
        y: -10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 3,
        stagger: 0.3,
      });
    });

    return () => ctx.revert();
  }, []);

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % HERO_TRACKS.length);
    setIsPlaying(true);

    if (miniTileRef.current) {
      gsap.fromTo(
        miniTileRef.current,
        { scale: 0.85, opacity: 0.6, rotate: -6 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.45, ease: "back.out(1.7)" }
      );
    }
  };

  const track = HERO_TRACKS[currentTrackIndex];

  return (
    <section id="hero" className="relative h-screen w-screen overflow-hidden bg-[#050508]">
      {/* Dynamic Zentry Video/Visual Frame */}
      <div
        id="video-frame"
        ref={videoFrameRef}
        className="relative z-10 h-screen w-screen overflow-hidden bg-[#08080c]"
      >
        {/* Background Visual Composition */}
        <div className="absolute inset-0 z-0">
          <img
            src={track.cover}
            alt={track.title}
            className="h-full w-full object-cover object-center filter brightness-[0.4] saturate-[1.3] transition-all duration-1000 scale-105"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${track.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/80 via-transparent to-[#050508]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#050508_90%)]" />
        </div>

        {/* Floating Sound Waves & Grid Overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-15">
          <div className="w-[85vw] h-[85vh] rounded-full border border-orange-500/30 animate-pulse" />
          <div className="absolute w-[60vw] h-[60vh] rounded-full border border-purple-500/20" />
        </div>

        {/* Center Interactive Music Card (Zentry Mini-Expander Feature) */}
        <div
          ref={miniTileRef}
          onClick={handleNextTrack}
          className="group absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
        >
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-black/60 p-4 backdrop-blur-xl shadow-2xl shadow-orange-500/10 md:p-6 w-[240px] md:w-[280px]">
            <div className="relative mb-3 h-28 w-full overflow-hidden rounded-xl bg-neutral-900 md:h-36">
              <img
                src={track.cover}
                alt="Track preview"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 backdrop-blur-md">
                <Disc3 className="h-3 w-3 text-orange-400 animate-spin" />
                <span className="text-[10px] font-mono text-orange-200 tracking-wider">
                  {track.bpm}
                </span>
              </div>
              <div className="absolute top-2 right-2 rounded-full bg-orange-500 p-2 text-white shadow-lg shadow-orange-500/40">
                <Play className="h-3.5 w-3.5 fill-white" />
              </div>
            </div>

            <div className="w-full text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-purple-300">
                {track.genre}
              </span>
              <h4 className="text-sm font-bold text-white tracking-wide truncate">
                {track.title}
              </h4>
              <p className="text-xs text-white/60 truncate">{track.artist}</p>
            </div>

            <div className="mt-3 flex w-full items-center justify-between border-t border-white/10 pt-2 text-[10px] font-mono text-white/50">
              <span className="flex items-center gap-1 text-orange-400">
                <Sparkles className="h-3 w-3" /> CLICK TO PREVIEW
              </span>
              <span>0{currentTrackIndex + 1}/03</span>
            </div>
          </div>
        </div>

        {/* Hero Content & Headlines */}
        <div className="relative z-20 flex h-full flex-col justify-between px-6 pb-12 pt-28 md:px-16 md:pb-16 md:pt-36">
          {/* Top Tagline */}
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-400">
              BREAKOUT ID • GLOBAL MUSIC DISTRIBUTION
            </span>
          </div>

          {/* Main Massive Editorial Headline */}
          <div className="max-w-4xl">
            <h1 className="font-zentry text-5xl font-black uppercase tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9]">
              YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">MUSIC.</span>
              <br />
              YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">WORLD.</span>
              <br />
              YOUR <span className="text-white">RULES.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm font-normal text-white/80 leading-relaxed md:text-base">
              Distribute your music worldwide. Reach millions of listeners, grow
              your audience, and manage your music career with BREAKOUT ID.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-orange-500/25 transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:scale-105 active:scale-95"
              >
                <span>GET STARTED</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <a
                href="#distribution"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/40"
              >
                <span>EXPLORE PLATFORM</span>
              </a>
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-white/60">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                150+ DSP NETWORKS
              </span>
              <span className="hidden sm:inline">100% ARTIST OWNERSHIP</span>
              <span className="hidden md:inline">24-HR FAST-TRACK REVIEW</span>
            </div>
            <div className="text-right">
              <span className="text-orange-400 font-bold">BREAKOUT ID</span> v2.4
            </div>
          </div>
        </div>
      </div>

      {/* Background Section Ambient Text Underneath Clip-Path Frame (Zentry Layer Effect) */}
      <div className="pointer-events-none absolute bottom-5 right-5 z-0 select-none opacity-10">
        <span className="font-zentry text-[16vw] font-black uppercase text-white leading-none">
          DISTRIBUTE
        </span>
      </div>
    </section>
  );
}

