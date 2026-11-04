"use client";

import React from "react";
import AnimatedTitle from "./AnimatedTitle";
import BentoTilt from "./BentoTilt";
import { Wallet, ShieldCheck, ArrowUpRight, Split, FileSpreadsheet, Lock } from "lucide-react";

export default function RoyaltiesSection() {
  return (
    <section className="relative bg-[#050508] py-28 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-orange-400">
            <Wallet className="h-3.5 w-3.5" />
            Transparent Financial Reporting
          </div>

          <h2 className="font-zentry text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase text-white mt-4 leading-[0.95]">
            YOUR MUSIC.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-purple-400">
              YOUR ROYALTIES.
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm md:text-base text-white/70 leading-relaxed font-normal">
            Keep track of your music earnings with transparent royalty reporting
            and accessible financial information.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Transparent Accounting */}
          <BentoTilt className="rounded-3xl border border-white/15 bg-neutral-900/60 p-8 flex flex-col justify-between group hover:border-orange-500/30 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-6">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-orange-400">
                LINE-BY-LINE AUDIT
              </span>
              <h3 className="font-zentry text-2xl md:text-3xl font-black uppercase text-white mt-2">
                DETAILED DSP STATEMENTS
              </h3>
              <p className="mt-2 text-xs md:text-sm text-white/70 leading-relaxed font-normal">
                Every stream, country code, platform, and payout tier broken down with precision. Export CSV and PDF statements at any time.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>MONTHLY CYCLE</span>
              <span className="text-emerald-400">100% RECONCILED</span>
            </div>
          </BentoTilt>

          {/* Card 2: Automated Split Pay */}
          <BentoTilt className="rounded-3xl border border-white/15 bg-neutral-900/60 p-8 flex flex-col justify-between group hover:border-purple-500/30 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <Split className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400">
                COLLABORATION MADE EASY
              </span>
              <h3 className="font-zentry text-2xl md:text-3xl font-black uppercase text-white mt-2">
                AUTOMATED REVENUE SPLITS
              </h3>
              <p className="mt-2 text-xs md:text-sm text-white/70 leading-relaxed font-normal">
                Collaborating with producers, vocalists, or featured artists? Define percentages once and our system automatically routes their share directly.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>MULTI-USER ROUTING</span>
              <span className="text-purple-300">AUTO-DEPOSIT</span>
            </div>
          </BentoTilt>

          {/* Card 3: Secure Direct Withdrawals */}
          <BentoTilt className="rounded-3xl border border-white/15 bg-neutral-900/60 p-8 flex flex-col justify-between group hover:border-white/30 transition-all">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                DIRECT TO BANK
              </span>
              <h3 className="font-zentry text-2xl md:text-3xl font-black uppercase text-white mt-2">
                ACCESSIBLE WITHDRAWALS
              </h3>
              <p className="mt-2 text-xs md:text-sm text-white/70 leading-relaxed font-normal">
                Withdraw your accumulated earnings via Indonesian Local Bank Transfer (BCA, Mandiri, BRI, BNI), e-wallets, or global wire transfers securely.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
              <span>LOCAL & GLOBAL</span>
              <span className="text-emerald-400 font-bold">256-BIT ENCRYPTION</span>
            </div>
          </BentoTilt>
        </div>
      </div>
    </section>
  );
}

