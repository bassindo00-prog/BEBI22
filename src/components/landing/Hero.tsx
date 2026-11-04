"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Play, Disc3, Sparkles } from "lucide-react";

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const totalVideos = 4;
  const upcomingVideoIndex = (currentIndex + 1) % totalVideos;
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleMiniVideoClick = () => {
    setHasClicked(true);
    setCurrentIndex(upcomingVideoIndex);

    const animatedVideo = `#video-${upcomingVideoIndex}`;
    const otherVideos = ["#video-0", "#video-1", "#video-2", "#video-3"].filter(
      (v) => v !== animatedVideo
    );

    gsap.set(animatedVideo, { zIndex: 30, width: "16rem", height: "16rem" });
    const videoElement: HTMLVideoElement | null = document.querySelector(animatedVideo);
    if (videoElement) {
      videoElement.pause();
      videoElement.currentTime = 0;
      videoElement.play();
    }

    gsap.set(otherVideos, { zIndex: 20 });
    gsap.to(animatedVideo, {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      transformOrigin: "center center",
      duration: 1,
      width: "100%",
      height: "100%",
    });
  };

  const getVideoSrc = (index: number) => `/videos/hero-${index}.mp4`;
  const handleVideoLoad = () => setLoadedVideos((prev) => prev + 1);

  useEffect(() => {
    if (loadedVideos >= totalVideos - 1) {
      setIsLoading(false);
    }
  }, [loadedVideos]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Zentry-style clip-path scroll interaction on the hero frame
      gsap.set("#video-frame", {
        clipPath: "polygon(14% 0, 72% 0, 90% 97%, 0 96%)",
        borderRadius: "0 0 40% 10%",
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
    });

    return () => ctx.revert();
  }, []);

  // Mouse-following clip-path reveal on mini video
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!backgroundVideoRef.current) return;
      const { clientX, clientY } = e;
      const maxOffsetX = 100;
      const maxOffsetY = 150;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const constrainedX = Math.min(Math.max(clientX, centerX - maxOffsetX), centerX + maxOffsetX);
      const constrainedY = Math.min(Math.max(clientY, centerY - maxOffsetY), centerY + maxOffsetY);

      const polygonClipPath = `polygon(
        ${Math.max(constrainedX - 100, 0)}px ${Math.max(constrainedY - 100, 0)}px,
        ${Math.min(constrainedX + 100, window.innerWidth)}px ${Math.max(constrainedY - 100, 0)}px,
        ${Math.min(constrainedX + 100, window.innerWidth)}px ${Math.min(constrainedY + 100, window.innerHeight)}px,
        ${Math.max(constrainedX - 100, 0)}px ${Math.min(constrainedY + 100, window.innerHeight)}px
      )`;

      gsap.to(backgroundVideoRef.current, {
        clipPath: polygonClipPath,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const heroEl = heroRef.current;
    if (heroEl) {
      heroEl.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      heroEl?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative h-screen w-screen overflow-x-hidden bg-[#050508]">
      {/* Three-Body Zentry Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center absolute z-[100] h-screen w-screen overflow-hidden bg-[#050508]">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      {/* Main Zentry Scrollytelling Video Frame */}
      <div
        id="video-frame"
        className="relative z-10 h-screen w-screen overflow-hidden rounded-lg bg-[#08080c]"
      >
        <div className="video-container relative size-full">
          {[...Array(4)].reverse().map((_, index) => (
            <video
              key={index}
              src={getVideoSrc(index)}
              autoPlay
              id={`video-${index}`}
              loop
              muted
              playsInline
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover object-center filter brightness-[0.45] saturate-[1.3]"
              onLoadedData={handleVideoLoad}
            />
          ))}

          {/* Mouse Hover Mini Interactive Video Frame */}
          <video
            ref={backgroundVideoRef}
            src={getVideoSrc(upcomingVideoIndex)}
            onClick={handleMiniVideoClick}
            loop
            muted
            playsInline
            autoPlay
            className="absolute top-0 left-0 z-50 h-full w-full object-cover cursor-pointer border-2 border-orange-500/50 rounded-2xl transition-all"
            style={{
              clipPath: "polygon(40% 40%, 60% 40%, 60% 60%, 40% 60%)",
            }}
          />
        </div>

        {/* Ambient Dark Overlay to enhance readability */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/60" />

        {/* Hero Background Huge Typography Layer (Zentry signature) */}
        <h1 className="special-font font-zentry font-black uppercase text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] absolute bottom-5 right-5 z-20 text-white/10 select-none pointer-events-none leading-none">
          DISTRIBUTE
        </h1>

        {/* Foreground Content */}
        <div className="relative z-40 flex h-full flex-col justify-between px-6 pb-12 pt-28 md:px-16 md:pb-16 md:pt-36">
          {/* Top Tagline */}
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-orange-400">
              BREAKOUT ID • GLOBAL MUSIC DISTRIBUTION
            </span>
          </div>

          {/* Main Editorial Headline */}
          <div className="max-w-4xl">
            <h1 className="font-zentry text-5xl font-black uppercase tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9]">
              YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">MUSIC.</span>
              <br />
              YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">WORLD.</span>
              <br />
              YOUR <span className="text-white">RULES.</span>
            </h1>

            <p className="mt-6 max-w-xl text-sm font-normal text-white/85 leading-relaxed md:text-base">
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
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/40"
              >
                <span>EXPLORE PLATFORM</span>
              </a>

              <div
                onClick={handleMiniVideoClick}
                className="inline-flex items-center gap-2 text-xs font-mono text-orange-300 cursor-pointer bg-black/40 px-4 py-2.5 rounded-full border border-orange-500/30 hover:border-orange-500 transition-colors ml-0 sm:ml-2"
              >
                <Play className="h-3 w-3 fill-orange-400 text-orange-400" />
                <span>CLICK TO SWITCH VISUAL ({upcomingVideoIndex + 1}/4)</span>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-between border-t border-white/15 pt-4 text-xs font-mono text-white/70">
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
    </section>
  );
}
