"use client";

import React from "react";
import { STICKERS } from "@/lib/stickers";
import { soundFX } from "@/lib/soundEffects";

interface StickerPanelProps {
  onAddSticker: (svgName: string) => void;
}

export const StickerPanel: React.FC<StickerPanelProps> = ({ onAddSticker }) => {
  return (
    <div className="w-full bg-gradient-to-b from-[#EAE3D5] to-[#DFD7C7] p-3 rounded-2xl border border-[#BDB29E] shadow-[0_4px_10px_rgba(0,0,0,0.12),inset_0_1px_0_#fff]">
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#C5BBA7]">
        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#4A4039]">
          SCRAPBOOK STICKER TRAY (TAP TO PEEL)
        </span>
        <span className="text-[9px] text-[#7C7468] font-mono">
          Drag &bull; Rotate &bull; Pinch
        </span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto py-1 no-scrollbar -mx-1 px-1">
        {STICKERS.map((stk) => (
          <button
            key={stk.id}
            type="button"
            onClick={() => {
              soundFX.playTap();
              onAddSticker(stk.id);
            }}
            className="flex-shrink-0 w-13 h-13 p-1.5 rounded-xl bg-[#FAF7F0] border border-[#C5BBA7] shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_1px_#fff] hover:border-[#E88E44] hover:scale-105 active:scale-95 transition-all flex items-center justify-center btn-tactile cursor-pointer"
            title={`Peel ${stk.name}`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {stk.svg({ className: "w-full h-full drop-shadow-xs" })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
