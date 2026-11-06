"use client";

import React, { useState } from "react";
import { FilmPreset, FILM_PRESETS } from "@/lib/filmPresets";
import { soundFX } from "@/lib/soundEffects";

interface CameraControlsProps {
  currentFilm: FilmPreset;
  onOpenFilmSelector: () => void;
  onSelectFilmQuick: (film: FilmPreset) => void;
  onShutterPress: () => void;
  onOpenGallery: () => void;
  onTriggerUpload: () => void;
  disabled?: boolean;
  latestPhotoThumbnail?: string | null;
  galleryCount: number;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  currentFilm,
  onOpenFilmSelector,
  onSelectFilmQuick,
  onShutterPress,
  onOpenGallery,
  disabled = false,
  latestPhotoThumbnail,
  galleryCount,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Quick preset palette for the physical circular dial
  const dialPresets = [
    { id: "original", color: "#F3EEE5", border: "#B5AA98", label: "ORIG" },
    { id: "warm", color: "#E88E44", border: "#A7571B", label: "WARM" },
    { id: "cool", color: "#4A7BB0", border: "#254870", label: "COOL" },
    { id: "vintage", color: "#C49A45", border: "#7E5C1B", label: "VINT" },
    { id: "film90s", color: "#D9534F", border: "#8C2A27", label: "90s" },
    { id: "bw", color: "#2B2724", border: "#5C5650", label: "B&W" },
  ];

  const handleShutterDown = () => {
    if (disabled) return;
    setIsPressed(true);
    soundFX.playTap();
  };

  const handleShutterUp = () => {
    if (disabled || !isPressed) return;
    setIsPressed(false);
    onShutterPress();
  };

  return (
    <div className="relative z-30 w-full px-5 py-4 bg-gradient-to-t from-[#DCD4C6] via-[#EAE3D5] to-[#F5EFE4] border-t border-[#C5BBA7] shadow-[0_-4px_12px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] select-none pb-[calc(1.2rem+env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* LEFT: Physical Circular Film / Filter Cluster Selector */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              onOpenFilmSelector();
            }}
            disabled={disabled}
            className="group relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-b from-[#FAF7F0] to-[#DDD4C4] border-2 border-[#BDB29E] shadow-[0_4px_8px_rgba(0,0,0,0.18),inset_0_2px_2px_rgba(255,255,255,0.9),inset_0_-2px_2px_rgba(0,0,0,0.1)] flex items-center justify-center btn-tactile cursor-pointer"
            title="Film Cartridge Dial"
            aria-label="Select Film Cartridge"
          >
            {/* Inner Recessed Metal Dial Well */}
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#2B2724] to-[#1C1A18] shadow-inner p-1 flex items-center justify-center relative">
              {/* Circular Cluster of Colored Film Pips */}
              <div className="grid grid-cols-3 gap-1 items-center justify-items-center">
                {dialPresets.map((dp) => {
                  const isCur = dp.id === currentFilm.id;
                  const targetFilm = FILM_PRESETS.find((f) => f.id === dp.id);

                  return (
                    <span
                      key={dp.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (targetFilm) {
                          soundFX.playTap();
                          onSelectFilmQuick(targetFilm);
                        }
                      }}
                      className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                        isCur
                          ? "scale-130 shadow-[0_0_8px_currentColor] ring-1 ring-white"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      style={{
                        backgroundColor: dp.color,
                        borderColor: dp.border,
                        borderWidth: "1px",
                      }}
                      title={targetFilm?.name}
                    />
                  );
                })}
              </div>
            </div>
          </button>

          {/* Active film name badge */}
          <span className="text-[9px] font-black text-[#5C5549] tracking-wider uppercase mt-1.5 font-mono truncate max-w-[68px]">
            {currentFilm.name.split(" ")[0]}
          </span>
        </div>

        {/* CENTER: Large Raised Red Shutter Button with Metallic Bezel */}
        <div className="relative flex flex-col items-center">
          {/* Metallic brushed outer ring with concentric bevel */}
          <div className="p-2 sm:p-2.5 rounded-full bg-gradient-to-b from-[#EFEAE0] via-[#C5BBA7] to-[#8C8270] shadow-[0_8px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_#fff] border border-[#A69C89]">
            {/* Dark inner well */}
            <div className="p-1 sm:p-1.5 rounded-full bg-gradient-to-b from-[#25221F] to-[#141210] shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)]">
              {/* The Red Tactile Shutter */}
              <button
                type="button"
                disabled={disabled}
                onPointerDown={handleShutterDown}
                onPointerUp={handleShutterUp}
                onPointerLeave={() => setIsPressed(false)}
                className={`w-18 h-18 sm:w-21 sm:h-21 rounded-full shutter-button-3d transition-all duration-75 flex items-center justify-center select-none touch-none ${
                  isPressed ? "translate-y-1 brightness-95" : "hover:brightness-105"
                } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                aria-label="Capture Instant Photo"
              >
                {/* Concentric tactile inner groove */}
                <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border border-red-300/30 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-red-400/20 shadow-inner" />
                </div>
              </button>
            </div>
          </div>

          <span className="text-[10px] font-black text-[#4A4039] tracking-widest uppercase mt-1.5 font-mono">
            SHUTTER
          </span>
        </div>

        {/* RIGHT: Physical Photo Stack / Film Holder Control */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              onOpenGallery();
            }}
            disabled={disabled}
            className="group relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-b from-[#FAF7F0] to-[#DDD4C4] border-2 border-[#BDB29E] shadow-[0_4px_8px_rgba(0,0,0,0.18),inset_0_2px_2px_rgba(255,255,255,0.9),inset_0_-2px_2px_rgba(0,0,0,0.1)] flex items-center justify-center btn-tactile cursor-pointer"
            title="Film Roll Photo Stack"
            aria-label="Open Photo Stack"
          >
            {/* Dark physical cartridge holder well */}
            <div className="relative w-12 h-13 sm:w-13 sm:h-14 rounded-lg bg-[#25221F] border border-[#3E3833] p-1 flex items-center justify-center shadow-inner overflow-visible">
              {/* Stacked Instant Photos Simulation */}
              <div className="absolute inset-x-2 -top-1 h-3 bg-[#E5DFD3] rounded-t-xs border border-[#C5BBA7] shadow-xs rotate-[-4deg]" />
              <div className="absolute inset-x-1.5 -top-0.5 h-3 bg-[#F0EBE0] rounded-t-xs border border-[#C5BBA7] shadow-xs rotate-[2deg]" />

              {/* Front Photo Card */}
              <div className="relative z-10 w-full h-full bg-[#FAF7F0] rounded-xs p-1 pb-2 shadow-sm border border-[#D5CBB9] flex flex-col items-center justify-center">
                {latestPhotoThumbnail ? (
                  <img
                    src={latestPhotoThumbnail}
                    alt="Latest instant print"
                    className="w-full h-full object-cover rounded-2xs"
                  />
                ) : (
                  <div className="w-full h-full bg-[#35312C] rounded-2xs flex items-center justify-center">
                    <span className="text-[7.5px] font-mono text-[#D5CBB9] font-bold">
                      EMPTY
                    </span>
                  </div>
                )}
              </div>

              {/* Badge Counter on Holder */}
              {galleryCount > 0 && (
                <div className="absolute -bottom-1 -right-1 z-20 px-1.5 py-0.2 rounded-full bg-[#D9534F] text-white font-mono font-black text-[8.5px] border border-white shadow-sm">
                  {galleryCount}
                </div>
              )}
            </div>
          </button>

          <span className="text-[9px] font-black text-[#5C5549] tracking-wider uppercase mt-1.5 font-mono">
            PRINTS
          </span>
        </div>
      </div>
    </div>
  );
};
