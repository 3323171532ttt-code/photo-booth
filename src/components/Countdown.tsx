"use client";

import React from "react";

interface CountdownProps {
  count: number | null;
}

export const Countdown: React.FC<CountdownProps> = ({ count }) => {
  if (count === null || count <= 0) return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none bg-black/25 backdrop-blur-[2px]">
      <div className="relative flex items-center justify-center">
        {/* Glow ring */}
        <div className="absolute w-40 h-40 sm:w-52 sm:h-52 rounded-full border-4 border-amber-400/40 animate-ping" />
        
        {/* Center badge */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-stone-900/90 border-4 border-amber-400 flex items-center justify-center shadow-2xl">
          <span className="led-display text-amber-400 text-6xl sm:text-7xl font-black drop-shadow-[0_0_20px_rgba(251,191,36,0.9)] animate-bounce">
            {count}
          </span>
        </div>
      </div>
    </div>
  );
};
