"use client";

import React from "react";
import "locomotive-scroll/dist/locomotive-scroll.css";
import { SmoothScrollProvider } from "@/context/ScrollProviderContext";
import NavBar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import AboutUs from "@/components/landing/AboutUs";
import Features from "@/components/landing/Features";
import Story from "@/components/landing/Story";
import Pinned from "@/components/landing/Pinned";
import WhatWeDo from "@/components/landing/WhatWeDo";
import ContactUs from "@/components/landing/ContactUs";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <SmoothScrollProvider>
      <NavBar />
      <div className="overflow-hidden main-container relative min-h-screen w-screen">
        <Hero />
        <AboutUs />
        <Features />
        <Story />
        <Pinned />
        <WhatWeDo />
        <ContactUs />
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
