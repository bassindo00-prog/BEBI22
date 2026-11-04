"use client";

import React from "react";
import Link from "next/link";
import { Disc3, ArrowUp, Globe } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#030305] text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-orange-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                <Disc3 className="h-5 w-5 animate-spin" />
              </div>
              <span className="font-zentry text-xl font-black uppercase tracking-wider text-white">
                BREAKOUT ID
              </span>
            </Link>
            <p className="mt-4 text-xs text-white/60 leading-relaxed font-normal">
              Next-generation digital music distribution and artist operations platform. Empowering independent creators across 190+ territories.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h5 className="text-xs font-mono uppercase tracking-widest text-orange-400 mb-4">
              Navigation
            </h5>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Platform
                </a>
              </li>
              <li>
                <a href="#distribution" className="hover:text-white transition-colors">
                  Global Distribution
                </a>
              </li>
              <li>
                <a href="#platform" className="hover:text-white transition-colors">
                  Streaming Analytics
                </a>
              </li>
              <li>
                <a href="#artists" className="hover:text-white transition-colors">
                  Artist Experience
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Authentication & Portal */}
          <div>
            <h5 className="text-xs font-mono uppercase tracking-widest text-purple-400 mb-4">
              Artist Portal
            </h5>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Artist Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Register Account
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Catalog Moderation
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Royalty Withdrawal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: DSP Standards & Back to Top */}
          <div>
            <h5 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4">
              Standards
            </h5>
            <div className="space-y-2 text-xs text-white/60 font-mono">
              <p>• DDEX 3.8.2 Certified</p>
              <p>• Apple Digital Masters Compliant</p>
              <p>• 24-bit Lossless Audio Processing</p>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-mono text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
          <p>© {new Date().getFullYear()} BREAKOUT ID. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>DSP Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

