"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";
import { Sparkles, Radio, Globe2, ShieldCheck } from "lucide-react";

export default function About() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Zentry Pin & Expand ScrollTrigger Animation
      const clipAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: "#about-clip",
          start: "center center",
          end: "+=800 center",
          scrub: 0.6,
          pin: true,
          pinSpacing: true,
        },
      });

      clipAnimation.to(".about-mask-clip", {
        width: "100vw",
        height: "100vh",
        borderRadius: "0px",
        ease: "power2.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="relative min-h-screen w-screen bg-[#050508] text-white overflow-hidden">
      {/* Top Section Intro */}
      <div className="relative mb-8 mt-24 flex flex-col items-center gap-5 px-6 text-center md:mt-32">
        <div className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          <p className="font-mono text-xs uppercase tracking-widest text-orange-300">
            Welcome to BREAKOUT ID
          </p>
        </div>

        <AnimatedTitle
          title="YOUR SOUND<br />DESERVES THE WORLD."
          containerClass="mt-4 text-center"
          wordClass="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-zentry"
        />

        <div className="max-w-2xl text-center">
          <p className="text-sm font-normal text-white/80 leading-relaxed md:text-base">
            BREAKOUT ID empowers independent artists and record labels to distribute
            their music across major digital streaming platforms with a streamlined,
            high-fidelity distribution experience.
          </p>
        </div>
      </div>

      {/* Zentry Scrollytelling Pinned Mask Container */}
      <div id="about-clip" className="h-dvh w-screen relative flex items-center justify-center overflow-hidden">
        <div className="about-mask-clip relative w-[75vw] h-[55vh] md:w-[45vw] md:h-[65vh] overflow-hidden rounded-[2.5rem] border border-white/20 shadow-2xl shadow-orange-500/20 transition-all duration-300">
          <img
            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop"
            alt="Studio Mixing & Mastering Console"
            className="absolute left-0 top-0 size-full object-cover filter brightness-[0.6] saturate-[1.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/20 via-transparent to-purple-600/30" />

          {/* Floating Telemetry within the expanding image */}
          <div className="absolute bottom-10 left-6 right-6 md:left-12 md:right-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-orange-400">
                PRO AUDIO INFRASTRUCTURE
              </span>
              <h3 className="text-2xl md:text-4xl font-bold font-zentry text-white mt-1">
                STUDIO FIDELITY. GLOBAL PIPELINE.
              </h3>
              <p className="text-xs md:text-sm text-white/70 max-w-md mt-1">
                Direct lossless WAV/FLAC automated ingest with Apple Digital Masters & Dolby Atmos compliance.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-white/90">
                100% Artist Royalties Kept
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Value Pillars Bar */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:border-orange-500/30 transition-colors">
          <Globe2 className="h-6 w-6 text-orange-400 mb-3" />
          <h4 className="text-base font-bold text-white">150+ Digital Storefronts</h4>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">
            From Spotify and Apple Music to regional DSPs across Asia, Europe, and the Americas.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
          <ShieldCheck className="h-6 w-6 text-purple-400 mb-3" />
          <h4 className="text-base font-bold text-white">Full Rights & Ownership</h4>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">
            You retain 100% of your master rights and creative freedom. No lock-in contracts.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:border-orange-500/30 transition-colors">
          <Radio className="h-6 w-6 text-amber-400 mb-3" />
          <h4 className="text-base font-bold text-white">Automated Content ID</h4>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">
            Monetize every usage of your sound on YouTube, TikTok, Instagram Reels, and Shorts.
          </p>
        </div>
      </div>
    </section>
  );
}

