"use client";

import React, { useState } from "react";
import AnimatedTitle from "./AnimatedTitle";
import BentoTilt from "./BentoTilt";
import { TrendingUp, BarChart3, Users, Globe2, Radio, Play, Sparkles } from "lucide-react";

export default function AnalyticsSection() {
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily");

  const streamMetrics = {
    daily: { streams: "148,920", growth: "+18.4%", listeners: "34,210", saves: "8,940" },
    weekly: { streams: "982,450", growth: "+24.2%", listeners: "215,600", saves: "54,200" },
    monthly: { streams: "4,190,000", growth: "+31.8%", listeners: "840,100", saves: "210,500" },
  };

  const current = streamMetrics[activeTab];

  return (
    <section id="platform" className="relative bg-[#050508] py-28 text-white overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-purple-300">
            <BarChart3 className="h-3.5 w-3.5" />
            Real-Time DSP Telemetry
          </div>

          <AnimatedTitle
            title="KNOW YOUR NUMBERS.<br />GROW YOUR MUSIC."
            containerClass="mt-4 text-center"
            wordClass="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-zentry"
          />

          <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed font-normal">
            Monitor streaming performance, track audience growth, and understand
            how your music performs across digital platforms.
          </p>
        </div>

        {/* Dashboard Preview Composition */}
        <BentoTilt className="relative rounded-3xl border border-white/20 bg-[#090810]/90 backdrop-blur-xl p-6 md:p-10 shadow-2xl shadow-purple-500/10">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  TELEMETRY DASHBOARD PREVIEW
                </h4>
                <p className="text-xs text-white/50 font-mono">
                  Live sync with Spotify, Apple Music & DSPs
                </p>
              </div>
            </div>

            {/* Time Toggle */}
            <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1 text-xs font-mono">
              {(["daily", "weekly", "monthly"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full capitalize transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold shadow-md"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-[11px] font-mono uppercase text-white/50">Total Streams</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black font-zentry text-white">
                  {current.streams}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {current.growth}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-[11px] font-mono uppercase text-white/50">Unique Listeners</span>
              <div className="mt-1">
                <span className="text-2xl md:text-3xl font-black font-zentry text-white">
                  {current.listeners}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-[11px] font-mono uppercase text-white/50">Playlist Adds</span>
              <div className="mt-1">
                <span className="text-2xl md:text-3xl font-black font-zentry text-white">
                  {current.saves}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <span className="text-[11px] font-mono uppercase text-white/50">Top Territory</span>
              <div className="mt-1">
                <span className="text-2xl md:text-3xl font-black font-zentry text-orange-400">
                  ID • US • UK
                </span>
              </div>
            </div>
          </div>

          {/* Main Chart Graphic & Streaming Bar Visualization */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-6">
            <div className="flex items-center justify-between mb-4 text-xs font-mono text-white/60">
              <span>STREAM VELOCITY (HOURLY INGEST)</span>
              <span className="text-emerald-400 font-bold">LIVE UPDATES ACTIVE</span>
            </div>

            {/* Stylized Animated Bar Visualizer */}
            <div className="h-40 md:h-52 w-full flex items-end gap-1.5 md:gap-3 pt-6 pb-2">
              {[
                { h: "35%", label: "00:00" },
                { h: "25%", label: "02:00" },
                { h: "20%", label: "04:00" },
                { h: "30%", label: "06:00" },
                { h: "55%", label: "08:00" },
                { h: "70%", label: "10:00" },
                { h: "85%", label: "12:00", highlight: true },
                { h: "78%", label: "14:00" },
                { h: "92%", label: "16:00", highlight: true },
                { h: "98%", label: "18:00", peak: true },
                { h: "88%", label: "20:00" },
                { h: "65%", label: "22:00" },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div
                    style={{ height: bar.h }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      bar.peak
                        ? "bg-gradient-to-t from-orange-600 to-orange-400 shadow-lg shadow-orange-500/30"
                        : bar.highlight
                        ? "bg-gradient-to-t from-purple-600 to-purple-400"
                        : "bg-white/15 hover:bg-white/30"
                    }`}
                  />
                  <span className="text-[10px] font-mono text-white/40 hidden md:inline">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-white/60 font-mono gap-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-500" /> Peak Hour (18:00 WIB)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-500" /> High Velocity
                </span>
              </div>
              <span>DDEX Automated Ingest v2.4</span>
            </div>
          </div>
        </BentoTilt>
      </div>
    </section>
  );
}

