"use client";

import React from "react";
import { Zap, ZapOff, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { soundFX } from "@/lib/soundEffects";

interface CameraHeaderProps {
  filmCount: number;
  flashMode: "on" | "off";
  onToggleFlash: () => void;
  onSwitchCamera: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  hasMultipleCameras: boolean;
}

export const CameraHeader: React.FC<CameraHeaderProps> = ({
  filmCount,
  flashMode,
  onToggleFlash,
  onSwitchCamera,
  soundEnabled,
  onToggleSound,
  hasMultipleCameras,
}) => {
  return (
    <header className="relative z-30 flex flex-col w-full bg-gradient-to-b from-[#FAF7F0] via-[#F3EEE5] to-[#EBE4D8] border-b border-[#D5CBB9] shadow-sm select-none pt-[calc(0.5rem+env(safe-area-inset-top))]">
      {/* Top hardware bar */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Brand Area & Vertical Muted Retro Stripes */}
        <div className="flex items-center gap-2.5">
          {/* Muted Vertical Film Rainbow Stripes */}
          <div className="flex h-7 w-5 rounded-xs overflow-hidden shadow-[inset_0_1px_1px_rgba(0,0,0,0.2),0_1px_0_rgba(255,255,255,0.8)] border border-[#C5BBA7]/60">
            <span className="flex-1 bg-[#D9534F]" />
            <span className="flex-1 bg-[#E88E44]" />
            <span className="flex-1 bg-[#E5B53B]" />
            <span className="flex-1 bg-[#5B9E6A]" />
            <span className="flex-1 bg-[#4A7BB0]" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-[#3A3938] uppercase font-sans leading-none">
              FRAME
            </span>
            <span className="text-[7.5px] font-mono font-bold tracking-widest text-[#7C7468] uppercase mt-0.5">
              INSTANT • 80
            </span>
          </div>
        </div>

        {/* Center: Recessed LED Exposure Counter */}
        <div className="flex flex-col items-center">
          <div className="bg-[#1C1A18] px-3 py-1 rounded-md border-2 border-[#383430] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.6)] flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-[#E5983B]/70 tracking-wider font-mono">
              EXP
            </span>
            <span className="led-display text-[#FFA733] text-sm font-black tracking-widest min-w-[20px] text-center">
              {String(Math.max(0, filmCount)).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Right Hardware: Flash Reflector + Mechanical Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Flash Toggle Button & Reflector Diode */}
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              onToggleFlash();
            }}
            className={`p-1.5 rounded-full border transition-all btn-tactile flex items-center justify-center ${
              flashMode === "on"
                ? "bg-gradient-to-b from-amber-300 to-amber-500 text-stone-950 border-amber-600 shadow-[0_2px_4px_rgba(217,119,6,0.5),inset_0_1px_1px_#fff]"
                : "bg-gradient-to-b from-[#E8E1D3] to-[#D5CBB9] text-[#5C5549] border-[#B8AC97] shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_1px_1px_#fff]"
            }`}
            title={flashMode === "on" ? "Flash Strobe Armed" : "Flash OFF"}
            aria-label="Toggle Flash"
          >
            {flashMode === "on" ? (
              <Zap className="w-3.5 h-3.5 fill-current" />
            ) : (
              <ZapOff className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-1.5 rounded-full border transition-all btn-tactile ${
              soundEnabled
                ? "bg-gradient-to-b from-[#E8E1D3] to-[#D5CBB9] text-[#4A4338] border-[#B8AC97] shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_1px_1px_#fff]"
                : "bg-[#D5CBB9] text-[#8C8477] border-[#B8AC97]"
            }`}
            title={soundEnabled ? "Mute mechanical sounds" : "Enable mechanical sounds"}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Camera Switch Mechanical Toggle */}
          {hasMultipleCameras && (
            <button
              type="button"
              onClick={() => {
                soundFX.playTap();
                onSwitchCamera();
              }}
              className="p-1.5 rounded-full bg-gradient-to-b from-[#E8E1D3] to-[#D5CBB9] text-[#4A4338] border border-[#B8AC97] shadow-[0_1px_2px_rgba(0,0,0,0.15),inset_0_1px_1px_#fff] hover:brightness-105 active:scale-95 transition-all btn-tactile"
              title="Switch front / rear camera"
              aria-label="Switch Camera"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
