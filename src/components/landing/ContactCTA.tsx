"use client";

import React from "react";
import Link from "next/link";
import AnimatedTitle from "./AnimatedTitle";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function ContactCTA() {
  return (
    <section className="relative my-20 min-h-96 w-screen px-6 md:px-12">
      <div className="relative rounded-3xl bg-gradient-to-br from-neutral-900 via-black to-[#130b24] border border-white/20 py-24 text-white overflow-hidden shadow-2xl shadow-orange-500/10">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-orange-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/25 blur-[120px]" />

        {/* Decorative Geometric Clip Path Images (Zentry Signature Contact Styling with contact-1 & contact-2) */}
        <div className="absolute -left-16 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-12 lg:w-96 opacity-60 hover:opacity-90 transition-opacity">
          <div className="contact-clip-path-1 size-full">
            <img
              src="/img/contact-1.webp"
              alt="BREAKOUT ID Studio visual 1"
              className="size-full object-cover filter brightness-[0.7] saturate-[1.3]"
            />
          </div>
          <div className="contact-clip-path-2 size-full -translate-y-20">
            <img
              src="/img/contact-2.webp"
              alt="BREAKOUT ID Studio visual 2"
              className="size-full object-cover filter brightness-[0.7] saturate-[1.3]"
            />
          </div>
        </div>

        {/* Right Corner Swordman Floating Visual Asset */}
        <div className="absolute -right-16 top-0 hidden h-full w-72 overflow-hidden sm:block lg:right-12 lg:w-96 opacity-60 hover:opacity-90 transition-opacity">
          <div className="sword-man-clip-path size-full">
            <img
              src="/img/swordman.webp"
              alt="BREAKOUT ID Artist Icon"
              className="size-full object-cover filter brightness-[0.7] saturate-[1.3]"
            />
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-orange-400 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Global Music Launchpad
          </div>

          <AnimatedTitle
            title="READY TO<br />BREAK OUT?"
            containerClass="text-center"
            wordClass="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-zentry font-black"
          />

          <p className="mt-6 max-w-lg text-sm md:text-base text-white/80 leading-relaxed font-normal">
            Your next release starts here. Join BREAKOUT ID and take your music to the next level with worldwide distribution.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-9 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-2xl shadow-orange-500/40 hover:from-orange-600 hover:to-orange-700 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>CREATE YOUR ACCOUNT</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              <span>ARTIST LOGIN</span>
            </Link>
          </div>

          {/* Quick Perks Bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Free Registration
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Keep 100% Rights
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Fast Ingestion
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
