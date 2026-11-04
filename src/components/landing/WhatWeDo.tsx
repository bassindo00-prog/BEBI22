"use client";

import { useEffect } from "react";
import AnimatedTitle from "./AnimatedTitle";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const WhatWeDo = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".whatwedo",
        start: "top 70%",
        scroller: ".main-container",
        animation: gsap.to(".whatwedo", { backgroundColor: "#DFDFF0" }),
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="whatwedo py-8 lg:py-32 h-full min-h-dvh w-screen bg-yellow-300 overflow-hidden flex-col gap-10 flex justify-center items-center">
      <p className="font-general text-sm uppercase md:text-[10px]">WHO WE ARE</p>
      <AnimatedTitle
        className="!gap-1 !text-black text-center"
        title="WE'RE BUILDING<br/> A NEW REALITY <br/> THAT REWARDS <br/> PLAYERS AND <br/>ENCOURAGES<br/>COMMUNITIES<br/>TO THRIVE"
      />
      <p className="text-center text-xs lg:text-sm font-circular-web max-w-md px-4">
        Zentry is on a mission to unite diverse player networks to forge the world's largest shared adventure.
      </p>
      <Button id="discover" title="DISCOVER WHO WE ARE" containerClass="!bg-black !text-white" />
    </section>
  );
};

export default WhatWeDo;

