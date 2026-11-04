"use client";

import React, { useRef, useState } from "react";

type BentoTiltProps = {
  children: React.ReactNode;
  className?: string;
  tiltIntensity?: number;
};

export default function BentoTilt({
  children,
  className = "",
  tiltIntensity = 18,
}: BentoTiltProps) {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * tiltIntensity;
    const tiltY = (relativeX - 0.5) * -tiltIntensity;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.985, 0.985, 0.985)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: "transform 0.15s ease-out",
      }}
    >
      {children}
    </div>
  );
}

