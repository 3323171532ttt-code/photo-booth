"use client";

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { FilmPreset } from "@/lib/filmPresets";
import { soundFX } from "@/lib/soundEffects";

interface DevelopingPhotoProps {
  photoDataUrl: string;
  filmPreset: FilmPreset;
  onDevelopingComplete: () => void;
}

export const DevelopingPhoto: React.FC<DevelopingPhotoProps> = ({
  photoDataUrl,
  filmPreset,
  onDevelopingComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [isEjected, setIsEjected] = useState(false);

  useEffect(() => {
    // 1. Play film motor ejection whirr
    soundFX.playMotorEject();

    // After 1.3s mechanical slide out from slot, it has fully emerged
    const ejectTimer = setTimeout(() => {
      setIsEjected(true);
    }, 1300);

    // Chemical developing timer: 3.5s total
    const duration = 3500;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const pct = Math.min(100, Math.round((currentStep / steps) * 100));
      setProgress(pct);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          onDevelopingComplete();
        }, 400);
      }
    }, intervalTime);

    return () => {
      clearTimeout(ejectTimer);
      clearInterval(timer);
    };
  }, [onDevelopingComplete]);

  return (
    <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-start pt-2 overflow-hidden pointer-events-none">
      {/* Container emerging directly from the film slot */}
      <div className="relative w-full flex flex-col items-center animate-emerge-slot">
        {/* Physical Instant Print Card */}
        <div
          className="relative w-72 sm:w-80 p-3.5 pb-16 sm:pb-20 rounded-xl shadow-[0_25px_50px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.3)] border border-[#E5DFD3] flex flex-col items-center transition-transform"
          style={{
            backgroundColor: "#FAF7F0",
          }}
        >
          {/* Subtle instant print paper texture overlay */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(#C5BBA7 0.8px, transparent 0.8px)",
              backgroundSize: "6px 6px",
            }}
          />

          {/* Photo Aperture cutout */}
          <div className="relative w-full aspect-[4/4.5] bg-[#12141C] rounded-md overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] border border-[#D5CBB9]">
            {/* The Raw Image with chemical developing CSS animation */}
            <img
              src={photoDataUrl}
              alt="Developing photograph"
              className="w-full h-full object-cover animate-develop"
              style={{
                filter: filmPreset.cssFilter,
              }}
            />

            {/* Chemical reaction emulsion sheen */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                opacity: Math.max(0, 1 - progress / 85),
                background:
                  "radial-gradient(circle at 50% 40%, rgba(20, 25, 40, 0.7) 0%, rgba(10, 15, 25, 0.95) 100%)",
              }}
            />

            {/* Liquid chemical developing glint */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.1) 100%)",
              }}
            />
          </div>

          {/* Bottom Border / Chin: Status & Progress */}
          <div className="w-full mt-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E88E44] animate-spin" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#5C5549]">
                {progress < 100 ? "DEVELOPING EMULSION..." : "DEVELOPED!"}
              </span>
            </div>
            <span className="text-[10px] font-mono font-black text-[#7C7468]">
              {progress}%
            </span>
          </div>

          {/* Progress bar line */}
          <div className="w-full h-1 bg-[#E8E1D3] rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-[#D9534F] via-[#E88E44] to-[#5B9E6A] transition-all duration-75 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Ejection indicator text */}
        <div className="mt-4 px-3 py-1 rounded-full bg-[#1C1A18]/80 border border-white/20 text-[#FAF7F0] text-[9px] font-mono tracking-widest uppercase flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>EMERGING FROM FILM SLOT</span>
        </div>
      </div>
    </div>
  );
};
