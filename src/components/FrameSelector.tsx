"use client";

import React from "react";
import { Check } from "lucide-react";
import { FRAME_OPTIONS, FrameId } from "@/lib/types";
import { soundFX } from "@/lib/soundEffects";

interface FrameSelectorProps {
  selectedFrameId: FrameId;
  onSelectFrame: (frameId: FrameId) => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  selectedFrameId,
  onSelectFrame,
}) => {
  return (
    <div className="w-full bg-retro-cream-dark/95 p-3 rounded-2xl border border-stone-300 shadow-md">
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-stone-300">
        <span className="text-xs font-black uppercase tracking-wider text-stone-700">
          Instant Film Paper Stock
        </span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto py-1 no-scrollbar -mx-1 px-1">
        {FRAME_OPTIONS.map((frame) => {
          const isSelected = frame.id === selectedFrameId;

          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => {
                soundFX.playTap();
                onSelectFrame(frame.id);
              }}
              className={`flex-shrink-0 w-24 p-2 rounded-xl flex flex-col items-center border-2 transition-all btn-tactile ${
                isSelected
                  ? "border-amber-500 shadow-md ring-2 ring-amber-400/50 bg-white"
                  : "border-stone-300 bg-stone-100 hover:border-stone-400"
              }`}
            >
              {/* Paper sample card preview */}
              <div
                className="w-12 h-16 rounded border shadow-inner mb-1.5 flex flex-col items-center justify-between p-1 relative"
                style={{
                  backgroundColor: frame.paperColor,
                  borderColor: frame.borderColor,
                }}
              >
                <div className="w-full h-9 bg-stone-800 rounded-2xs" />
                {frame.id === "color_edge" && (
                  <div className="flex w-full h-0.5 rounded-full overflow-hidden">
                    <span className="flex-1 bg-red-500" />
                    <span className="flex-1 bg-amber-400" />
                    <span className="flex-1 bg-blue-500" />
                  </div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded">
                    <Check className="w-4 h-4 text-white drop-shadow-sm stroke-[3]" />
                  </div>
                )}
              </div>

              <span className="text-[10px] font-bold text-stone-800 tracking-tight text-center truncate w-full">
                {frame.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
