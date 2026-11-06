"use client";

import React from "react";

interface RetroChassisProps {
  children: React.ReactNode;
  isShaking?: boolean;
}

export const RetroChassis: React.FC<RetroChassisProps> = ({ children, isShaking = false }) => {
  return (
    <div className="relative w-full h-[100dvh] bg-[#12100E] flex items-center justify-center overflow-hidden">
      {/* Background vintage workbench / desk texture for desktop presentation */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(#4A4039 1px, transparent 1px), radial-gradient(#2E2722 1px, #12100E 1px)",
          backgroundSize: "28px 28px",
          backgroundPosition: "0 0, 14px 14px",
        }}
      />

      {/* Virtual Physical Camera Body */}
      <main
        className={`relative w-full h-full sm:h-[95dvh] sm:max-h-[900px] sm:max-w-[430px] sm:rounded-[42px] camera-plastic-body border-0 sm:border-[10px] sm:border-[#E8E1D3] shadow-none sm:shadow-[0_30px_70px_rgba(0,0,0,0.85),0_10px_20px_rgba(0,0,0,0.5),inset_0_2px_4px_#fff,inset_0_-2px_4px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden transition-transform duration-100 ${
          isShaking ? "animate-shake" : ""
        }`}
      >
        {/* Subtle camera chassis side bevels for 3D depth */}
        <div className="hidden sm:block absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-r from-black/20 via-black/5 to-transparent pointer-events-none z-30" />
        <div className="hidden sm:block absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-l from-black/20 via-black/5 to-transparent pointer-events-none z-30" />

        {/* Top Speaker / Sensor Grill imitations */}
        <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 z-30 items-center gap-1.5 opacity-50">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4A4039] shadow-inner" />
          <div className="w-12 h-1 rounded-full bg-[#4A4039] shadow-inner" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#4A4039] shadow-inner" />
        </div>

        {/* Plastic Matte Texture Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-15 z-25"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* App Content */}
        <div className="relative w-full h-full flex flex-col overflow-hidden z-10">
          {children}
        </div>
      </main>
    </div>
  );
};
