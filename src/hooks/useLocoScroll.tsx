"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

const useLocoScroll = () => {
  gsap.registerPlugin(ScrollTrigger);
  const [locoScroll, setLocoScroll] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let locoScrollInstance: any = null;
    let lsUpdate: any = null;

    import("locomotive-scroll").then((LocomotiveScrollModule) => {
      const LocomotiveScroll = LocomotiveScrollModule.default || LocomotiveScrollModule;
      const scrollEl: HTMLElement | null = document.querySelector(".main-container");
      if (!scrollEl) return;

      locoScrollInstance = new (LocomotiveScroll as any)({
        el: scrollEl,
        smooth: true,
        multiplier: 1.5,
        mobile: {
          smooth: true,
        },
      });
      setLocoScroll(locoScrollInstance);

      locoScrollInstance.on("scroll", ScrollTrigger.update);
      locoScrollInstance.on("scroll", (args: any) => setProgress(args?.scroll?.y || 0));

      ScrollTrigger.scrollerProxy(scrollEl, {
        scrollTop(value) {
          return arguments.length
            ? locoScrollInstance.scrollTo(value, 0)
            : locoScrollInstance.scroll.instance.scroll.y;
        },
        scrollLeft(value) {
          return arguments.length
            ? locoScrollInstance.scrollTo(value, 0)
            : locoScrollInstance.scroll.instance.scroll.x;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: scrollEl?.style.transform ? "transform" : "fixed",
      });

      lsUpdate = () => locoScrollInstance && locoScrollInstance.update();

      ScrollTrigger.addEventListener("refresh", lsUpdate);
      ScrollTrigger.refresh();
    });

    return () => {
      if (locoScrollInstance) {
        if (lsUpdate) ScrollTrigger.removeEventListener("refresh", lsUpdate);
        locoScrollInstance.destroy();
      }
    };
  }, []);

  return { locoScroll, progress };
};

export default useLocoScroll;
