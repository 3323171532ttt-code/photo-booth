"use client";

import React from "react";
import { X, Check } from "lucide-react";
import { FILM_PRESETS, FilmPreset } from "@/lib/filmPresets";
import { soundFX } from "@/lib/soundEffects";

interface FilmSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilm: FilmPreset;
  onSelectFilm: (film: FilmPreset) => void;
}

export const FilmSelector: React.FC<FilmSelectorProps> = ({
  isOpen,
  onClose,
  selectedFilm,
  onSelectFilm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end transition-opacity">
      <div className="flex-1" onClick={onClose} />

      {/* Cartridge Magazine Tray Sheet */}
      <div className="relative w-full bg-gradient-to-b from-[#FAF7F0] via-[#F3EEE5] to-[#EBE4D8] border-t-4 border-[#C5BBA7] rounded-t-3xl p-5 shadow-[0_-15px_35px_rgba(0,0,0,0.4)] animate-eject max-w-lg mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#C5BBA7]">
          <div className="flex items-center gap-2">
            {/* Faded vertical film stripes */}
            <div className="flex h-4 w-3 rounded-2xs overflow-hidden border border-[#A69C89]">
              <span className="flex-1 bg-[#D9534F]" />
              <span className="flex-1 bg-[#E88E44]" />
              <span className="flex-1 bg-[#E5B53B]" />
              <span className="flex-1 bg-[#5B9E6A]" />
              <span className="flex-1 bg-[#4A7BB0]" />
            </div>
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-[#3A3938]">
              FILM CARTRIDGE MAGAZINE ({FILM_PRESETS.length})
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFX.playTap();
              onClose();
            }}
            className="p-1.5 rounded-full bg-[#E8E1D3] hover:bg-[#DDD4C4] text-[#4A4039] border border-[#BDB29E] transition-colors btn-tactile cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Horizontal Film Cartridge Reel */}
        <div className="flex gap-3 overflow-x-auto py-4 no-scrollbar -mx-2 px-2 snap-x">
          {FILM_PRESETS.map((film) => {
            const isSelected = film.id === selectedFilm.id;

            return (
              <button
                key={film.id}
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  onSelectFilm(film);
                }}
                className={`relative flex-shrink-0 w-28 p-2 rounded-2xl flex flex-col items-center border-2 transition-all snap-start btn-tactile text-left ${
                  isSelected
                    ? "bg-[#FAF7F0] border-[#E88E44] shadow-lg scale-102 ring-2 ring-[#E88E44]/40"
                    : "bg-[#EAE3D5] border-[#C5BBA7] hover:border-[#8C8477] shadow-xs"
                }`}
              >
                {/* Film roll cartridge graphic */}
                <div
                  className="w-full h-15 rounded-lg mb-2 relative overflow-hidden flex flex-col justify-between p-1.5 shadow-inner border border-black/20"
                  style={{
                    filter: film.cssFilter,
                    background:
                      "linear-gradient(135deg, #a78bfa 0%, #f472b6 40%, #fbbf24 100%)",
                  }}
                >
                  <div className="flex justify-between items-center text-[7.5px] font-mono font-bold text-white drop-shadow-xs">
                    <span>{film.code}</span>
                    <span>ISO 400</span>
                  </div>

                  <div className="text-[10px] font-black text-white text-center drop-shadow-md tracking-wider">
                    {film.badgeText}
                  </div>

                  {/* Sprocket holes imitation */}
                  <div className="flex justify-between">
                    <span className="w-1.5 h-1 bg-black/50 rounded-2xs" />
                    <span className="w-1.5 h-1 bg-black/50 rounded-2xs" />
                    <span className="w-1.5 h-1 bg-black/50 rounded-2xs" />
                  </div>
                </div>

                {/* Film title */}
                <span className="text-xs font-black text-[#3A3938] tracking-tight text-center w-full truncate font-mono">
                  {film.name}
                </span>

                <span className="text-[8.5px] text-[#7C7468] text-center line-clamp-1 mt-0.5 font-mono">
                  {film.code}
                </span>

                {/* Active Checkmark */}
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#E88E44] text-stone-950 flex items-center justify-center shadow-md border-2 border-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Film Info */}
        <div className="mt-1 p-2.5 bg-[#DDD4C4]/80 rounded-xl border border-[#C5BBA7] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#3A3938] font-mono">
              {selectedFilm.name} &bull; {selectedFilm.code}
            </span>
            <span className="text-[10px] text-[#6B6255]">
              {selectedFilm.description}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#2B2724] text-[#FFA733] text-xs font-mono font-bold shadow-xs hover:bg-black transition-colors btn-tactile"
          >
            LOAD
          </button>
        </div>
      </div>
    </div>
  );
};
