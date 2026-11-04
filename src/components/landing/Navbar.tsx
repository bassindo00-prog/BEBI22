"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight, Music, Volume2, VolumeX } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Distribution", href: "#distribution" },
  { label: "Platform", href: "#platform" },
  { label: "Artists", href: "#artists" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Web Audio Synthesizer for ambient music landscape
  const startAmbientAudio = () => {
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }

      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime); // A3 ambient root
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.warn("Audio Context init fallback:", e);
    }
  };

  const stopAmbientAudio = () => {
    try {
      if (gainNodeRef.current && audioContextRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioContextRef.current.currentTime + 0.5
        );
        setTimeout(() => {
          oscillatorRef.current?.stop();
          oscillatorRef.current?.disconnect();
          oscillatorRef.current = null;
        }, 550);
      }
    } catch (e) {
      console.warn("Audio stop error:", e);
    }
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      stopAmbientAudio();
      setIsAudioPlaying(false);
      setIsIndicatorActive(false);
    } else {
      startAmbientAudio();
      setIsAudioPlaying(true);
      setIsIndicatorActive(true);
    }
  };

  // Scroll visibility management with GSAP
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setIsNavVisible(true);
        if (navContainerRef.current) {
          gsap.to(navContainerRef.current, {
            y: 0,
            backgroundColor: "rgba(10, 10, 16, 0.4)",
            backdropFilter: "blur(12px)",
            duration: 0.3,
          });
        }
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down -> hide navbar
        setIsNavVisible(false);
        if (navContainerRef.current) {
          gsap.to(navContainerRef.current, {
            y: -110,
            duration: 0.35,
            ease: "power2.inOut",
          });
        }
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show navbar
        setIsNavVisible(true);
        if (navContainerRef.current) {
          gsap.to(navContainerRef.current, {
            y: 0,
            backgroundColor: "rgba(10, 10, 16, 0.85)",
            backdropFilter: "blur(16px)",
            duration: 0.35,
            ease: "power2.out",
          });
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:px-6 pointer-events-none">
      <div
        ref={navContainerRef}
        className="pointer-events-auto w-full max-w-6xl rounded-full border border-white/15 bg-[#0a0a10]/60 backdrop-blur-xl px-4 sm:px-6 py-2.5 transition-shadow duration-300 shadow-2xl flex items-center justify-between gap-4"
      >
        {/* Brand Logo: BREAKOUT ID */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff5e00] via-[#ff7a1a] to-[#a855f7] p-[1.5px] transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-[#0b0a12] flex items-center justify-center">
              <span className="font-zentry text-xs font-black text-white tracking-tighter">B</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5e00] ml-0.5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-zentry font-black text-sm tracking-widest text-white uppercase group-hover:text-[#ff5e00] transition-colors">
              BREAKOUT <span className="text-[#a855f7]">ID</span>
            </span>
            <span className="text-[9px] text-white/50 tracking-widest uppercase -mt-0.5">
              Music Distribution
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-medium uppercase tracking-wider text-white/80">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative py-1 hover:text-[#ff5e00] transition-colors group"
            >
              <span>{link.label}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#ff5e00] to-[#a855f7] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right Action Controls: Audio Indicator, LOGIN, GET STARTED */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Equalizer Toggle Button */}
          <button
            type="button"
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[11px] font-medium transition-all"
            title={isAudioPlaying ? "Mute Ambient Soundscape" : "Play Ambient Soundscape"}
          >
            <div className="flex items-center gap-0.5 h-4">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`indicator-line ${isIndicatorActive ? "active" : ""}`}
                  style={{
                    animationDelay: `${bar * 0.12}s`,
                  }}
                />
              ))}
            </div>
            <span className="hidden sm:inline text-[10px] uppercase font-semibold text-white/70">
              {isAudioPlaying ? "Live" : "Audio"}
            </span>
          </button>

          {/* Login Button -> Existing Auth Route */}
          <Link
            href="/login"
            className="text-xs uppercase font-bold tracking-wider text-white/90 hover:text-white px-3 py-1.5 transition-colors"
          >
            Login
          </Link>

          {/* Get Started Button -> Existing Register Route */}
          <Link
            href="/register"
            className="relative group overflow-hidden px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#ff5e00] to-[#a855f7] text-white text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-[#ff5e00]/25 transition-all hover:scale-105 flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

