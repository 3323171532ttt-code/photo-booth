"use client";

import React from "react";

interface FilmSlotProps {
  isEjecting?: boolean;
}

export const FilmSlot: React.FC<FilmSlotProps> = ({ isEjecting = false }) => {
  return (
    <div className="relative z-30 w-full px-5 py-1.5 flex flex-col items-center select-none bg-gradient-to-b from-[#EBE4D8] to-[#E2DAD0] border-b border-[#C8BEAE]">
      {/* Upper plastic bezel lip with subtle shadow */}
      <div className="w-full max-w-[340px] flex items-center justify-between mb-0.5 px-2">
        <span className="text-[8px] font-mono font-bold tracking-widest text-[#7C7468] uppercase">
          FILM OUTPUT SLOT
        </span>
        <div className="flex items-center gap-1">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              isEjecting
                ? "bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-pulse"
                : "bg-[#7A7366]"
            }`}
          />
          <span className="text-[8px] font-mono text-[#8C8477]">
            {isEjecting ? "EJECTING" : "READY"}
          </span>
        </div>
      </div>

      {/* Physical Recessed Film Cavity */}
      <div className="relative w-full max-w-[340px] h-3.5 sm:h-4 rounded-full film-slot-cavity flex items-center justify-center p-0.5">
        {/* Deep black interior opening */}
        <div className="w-[94%] h-1.5 sm:h-2 rounded-full bg-black/95 shadow-inner relative overflow-hidden">
          {/* Subtle metallic roller glint inside slot */}
          <div className="absolute inset-x-4 top-0.5 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Lower metallic guide edge */}
        <div className="absolute -bottom-1 inset-x-8 h-0.5 bg-white/40 rounded-full blur-[0.5px]" />
      </div>
    </div>
  );
};
