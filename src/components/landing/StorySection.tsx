"use client";

import React, { useRef } from "react";
import AnimatedTitle from "./AnimatedTitle";
import {
  UploadCloud,
  Layers,
  Globe2,
  LineChart,
  CircleDollarSign,
  UserCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

const PILLARS = [
  {
    icon: UploadCloud,
    title: "Easy Music Submission",
    desc: "Drag and drop high-res audio, cover artwork, and auto-populate metadata in minutes.",
    color: "from-orange-500/20 to-orange-500/5",
    border: "group-hover:border-orange-500/50",
    badge: "Fast Upload",
  },
  {
    icon: Layers,
    title: "Release Management",
    desc: "Full catalogue moderation, schedule release dates, manage UPC barcodes & ISRC codes.",
    color: "from-purple-500/20 to-purple-500/5",
    border: "group-hover:border-purple-500/50",
    badge: "Smart Catalog",
  },
  {
    icon: Globe2,
    title: "Global Music Distribution",
    desc: "Simultaneous distribution to Spotify, Apple Music, TikTok, YouTube Music, and 150+ DSPs.",
    color: "from-blue-500/20 to-blue-500/5",
    border: "group-hover:border-blue-500/50",
    badge: "190+ Countries",
  },
  {
    icon: LineChart,
    title: "Streaming Analytics",
    desc: "Real-time stream velocity, listener geographic breakdown, and demographic audience insights.",
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "group-hover:border-emerald-500/50",
    badge: "Live Telemetry",
  },
  {
    icon: CircleDollarSign,
    title: "Royalty Reporting",
    desc: "Itemized monthly statements, transparent earnings without hidden cuts, and automated split pay.",
    color: "from-amber-500/20 to-amber-500/5",
    border: "group-hover:border-amber-500/50",
    badge: "Transparent Pay",
  },
  {
    icon: UserCheck,
    title: "Artist Account Management",
    desc: "Dedicated artist profile, label multiple-artist rosters, and direct rights management.",
    color: "from-pink-500/20 to-pink-500/5",
    border: "group-hover:border-pink-500/50",
    badge: "Artist Control",
  },
];

export default function StorySection() {
  const frameRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((yPos - centerY) / centerY) * -12;
    const rotateY = ((xPos - centerX) / centerX) * 12;

    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 800,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = () => {
    const element = frameRef.current;
    if (!element) return;

    gsap.to(element, {
      duration: 0.4,
      rotateX: 0,
      rotateY: 0,
      ease: "power1.inOut",
    });
  };

  return (
    <section id="artists" className="relative min-h-screen bg-[#050508] py-28 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-orange-400">
            <Sparkles className="h-3.5 w-3.5" />
            Artist Empowerment
          </div>

          <AnimatedTitle
            title="BUILT FOR ARTISTS.<br />POWERED BY MUSIC."
            containerClass="mt-4 text-center"
            wordClass="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-zentry"
          />

          <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed font-normal">
            Every tool you need to release, analyze, and monetize your music catalog,
            all unified in one intuitive artist-centric operating system.
          </p>
        </div>

        {/* 3D Interactive Visual Composition (Zentry Story Tilt Effect) */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative mb-20 flex justify-center items-center py-6"
        >
          <div className="relative w-full max-w-4xl h-[320px] md:h-[480px] overflow-hidden rounded-3xl border border-white/20 shadow-2xl shadow-orange-500/10">
            <img
              ref={frameRef}
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop"
              alt="Artist Studio Creation"
              className="size-full object-cover filter brightness-[0.55] saturate-[1.25] transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-transparent to-purple-600/20" />

            {/* In-Frame Floating Overlay */}
            <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-orange-400">
                  BREAKOUT ID WORKFLOW
                </span>
                <h3 className="text-2xl md:text-4xl font-bold font-zentry text-white mt-1">
                  FROM DAW TO EVERY STREAMING APP
                </h3>
              </div>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all hover:scale-105"
              >
                <span>JOIN AS ARTIST</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 6 Key Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className={`group relative rounded-2xl border border-white/10 bg-gradient-to-b ${pillar.color} p-6 backdrop-blur-sm transition-all duration-300 ${pillar.border} hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                    {pillar.badge}
                  </span>
                </div>

                <h4 className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors">
                  {pillar.title}
                </h4>

                <p className="mt-2 text-xs md:text-sm text-white/70 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

