"use client";

import React, { useRef, useEffect } from "react";
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
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PILLARS = [
  {
    icon: UploadCloud,
    title: "Easy Music Submission",
    desc: "Drag and drop high-res audio, cover artwork, and auto-populate metadata in minutes.",
    badge: "Fast Upload",
  },
  {
    icon: Layers,
    title: "Release Management",
    desc: "Full catalogue moderation, schedule release dates, manage UPC barcodes & ISRC codes.",
    badge: "Smart Catalog",
  },
  {
    icon: Globe2,
    title: "Global Music Distribution",
    desc: "Simultaneous distribution to Spotify, Apple Music, TikTok, YouTube Music, and 150+ DSPs.",
    badge: "190+ Countries",
  },
  {
    icon: LineChart,
    title: "Streaming Analytics",
    desc: "Real-time stream velocity, listener geographic breakdown, and demographic audience insights.",
    badge: "Live Telemetry",
  },
  {
    icon: CircleDollarSign,
    title: "Royalty Reporting",
    desc: "Itemized monthly statements, transparent earnings without hidden cuts, and automated split pay.",
    badge: "Transparent Pay",
  },
  {
    icon: UserCheck,
    title: "Artist Account Management",
    desc: "Dedicated artist profile, label multiple-artist rosters, and direct rights management.",
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
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -22;
    const rotateY = ((x - centerX) / centerX) * 22;

    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 700,
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".story-img-container",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        })
        .to(".story-img-content img", { y: 60 });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="artists" className="relative min-h-screen bg-[#050508] py-28 text-white overflow-hidden">
      {/* SVG RoundedCorners Filter definition */}
      <svg className="invisible absolute size-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="flt_tag">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="flt_tag"
            />
            <feComposite in="SourceGraphic" in2="flt_tag" operator="atop" />
          </filter>
        </defs>
      </svg>

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

        {/* 3D Interactive Visual Composition (Zentry Story Tilt Effect with entrance.webp) */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative mb-20 flex justify-center items-center py-6"
        >
          <div className="story-img-container relative w-full max-w-4xl h-[340px] md:h-[500px]">
            <div className="story-img-mask size-full overflow-hidden rounded-3xl border border-white/20 shadow-2xl shadow-orange-500/10">
              <div className="story-img-content size-full">
                <img
                  ref={frameRef}
                  src="/img/entrance.webp"
                  alt="BREAKOUT ID Gateway"
                  className="size-full object-cover filter brightness-[0.6] saturate-[1.3] transition-transform duration-300"
                />
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none rounded-3xl" />

            {/* In-Frame Floating Overlay */}
            <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 z-20">
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
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 hover:scale-105 transition-all"
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
                className="group relative rounded-2xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/40 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
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
