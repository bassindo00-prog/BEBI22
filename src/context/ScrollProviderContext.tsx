"use client";
import React, { createContext, useContext } from "react";
import useLocoScroll from "../hooks/useLocoScroll";

export const SmoothScrollContext = createContext<{ locoScroll: any; progress: number }>({
  locoScroll: null,
  progress: 0,
});

export const SmoothScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const { locoScroll, progress } = useLocoScroll();

  return (
    <SmoothScrollContext.Provider value={{ locoScroll, progress }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export const useSmoothScroll = () => useContext(SmoothScrollContext);
SmoothScrollContext.displayName = "SmoothScrollContext";
SmoothScrollProvider.displayName = "SmoothScrollProvider";

