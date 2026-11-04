"use client";

import React from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import AnalyticsSection from "@/components/landing/AnalyticsSection";
import RoyaltiesSection from "@/components/landing/RoyaltiesSection";
import StorySection from "@/components/landing/StorySection";
import ContactCTA from "@/components/landing/ContactCTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-[#050508] text-white selection:bg-orange-500 selection:text-white">
      {/* Floating Dynamic Navbar with Web Audio Equalizer */}
      <Navbar />

      {/* SECTION 1 — HERO */}
      <Hero />

      {/* SECTION 2 — INTRODUCTION */}
      <About />

      {/* SECTION 3 — GLOBAL DISTRIBUTION */}
      <Features />

      {/* SECTION 4 — MUSIC ANALYTICS */}
      <AnalyticsSection />

      {/* SECTION 5 — ROYALTIES */}
      <RoyaltiesSection />

      {/* SECTION 6 — ARTIST EXPERIENCE */}
      <StorySection />

      {/* SECTION 7 — FINAL CTA */}
      <ContactCTA />

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
