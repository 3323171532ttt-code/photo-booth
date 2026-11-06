"use client";

import React, { useRef } from "react";
import { FRAME_OPTIONS } from "@/lib/types";
import { FilmPreset, Adjustments } from "@/lib/filmPresets";
import { StickerItem, TextItem, DateStampConfig, FrameId } from "@/lib/types";
import { StickerLayer } from "./StickerLayer";
import { DateStamp } from "./DateStamp";
import { TextTool } from "./TextTool";

interface InstantPhotoFrameProps {
  photoDataUrl: string;
  filmPreset: FilmPreset;
  adjustments: Adjustments;
  frameId: FrameId;
  stickers: StickerItem[];
  onUpdateSticker: (id: string, updates: Partial<StickerItem>) => void;
  onRemoveSticker: (id: string) => void;
  selectedStickerId: string | null;
  onSelectSticker: (id: string | null) => void;
  dateStamp: DateStampConfig;
  onUpdateDateStamp: (updates: Partial<DateStampConfig>) => void;
  isDateStampSelected: boolean;
  onSelectDateStamp: () => void;
  textItems: TextItem[];
  onUpdateTextItem: (id: string, updates: Partial<TextItem>) => void;
  onRemoveTextItem: (id: string) => void;
  selectedTextId: string | null;
  onSelectTextId: (id: string | null) => void;
  onDeselectAll: () => void;
}

export const InstantPhotoFrame: React.FC<InstantPhotoFrameProps> = ({
  photoDataUrl,
  filmPreset,
  adjustments,
  frameId,
  stickers,
  onUpdateSticker,
  onRemoveSticker,
  selectedStickerId,
  onSelectSticker,
  dateStamp,
  onUpdateDateStamp,
  isDateStampSelected,
  onSelectDateStamp,
  textItems,
  onUpdateTextItem,
  onRemoveTextItem,
  selectedTextId,
  onSelectTextId,
  onDeselectAll,
}) => {
  const photoContainerRef = useRef<HTMLDivElement>(null);

  const frameInfo =
    FRAME_OPTIONS.find((f) => f.id === frameId) || FRAME_OPTIONS[0];

  // Calculate live CSS filter string combining preset and sliders
  const brightnessVal = 1 + (adjustments.brightness + adjustments.exposure * 1.2) / 100;
  const contrastVal = 1 + adjustments.contrast / 100;
  const saturationVal = Math.max(0, 1 + adjustments.saturation / 100);
  const hueRotateVal = adjustments.temperature * -0.4;
  const sepiaVal = adjustments.temperature > 0 ? (adjustments.temperature / 100) * 0.35 : 0;

  const combinedFilter = `${filmPreset.cssFilter} brightness(${brightnessVal}) contrast(${contrastVal}) saturate(${saturationVal}) hue-rotate(${hueRotateVal}deg) sepia(${sepiaVal})`;

  const grainOpacity = Math.min(0.45, Math.max(0.04, (filmPreset.defaultGrain + adjustments.grain) / 250));
  const fadeOpacity = Math.min(0.35, Math.max(0, (filmPreset.fade + adjustments.fade) / 180));

  return (
    <div
      onClick={onDeselectAll}
      className="relative flex flex-col items-center justify-center p-2 sm:p-4 select-none"
    >
      {/* Outer Instant Print Paper Card sitting on camera chassis */}
      <div
        className={`relative w-72 sm:w-82 p-3.5 pb-16 sm:pb-20 shadow-[0_22px_45px_rgba(0,0,0,0.38),0_4px_10px_rgba(0,0,0,0.22)] border transition-all duration-200 ${
          frameId === "rounded" ? "rounded-3xl" : "rounded-xl"
        }`}
        style={{
          backgroundColor: frameInfo.paperColor,
          borderColor: frameInfo.borderColor,
        }}
      >
        {/* Paper texture overlay flecks */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(#A69C89 0.7px, transparent 0.7px)",
            backgroundSize: "6px 6px",
          }}
        />

        {/* Color Edge Stripe (if selected) */}
        {frameId === "color_edge" && (
          <div className="absolute bottom-12 sm:bottom-14 left-4 right-4 flex h-1.5 rounded-full overflow-hidden shadow-xs">
            <span className="flex-1 bg-[#D9534F]" />
            <span className="flex-1 bg-[#E88E44]" />
            <span className="flex-1 bg-[#E5B53B]" />
            <span className="flex-1 bg-[#5B9E6A]" />
            <span className="flex-1 bg-[#4A7BB0]" />
          </div>
        )}

        {/* Inner Photo Area */}
        <div
          ref={photoContainerRef}
          className="relative w-full aspect-[4/4.5] bg-[#12141C] rounded-md overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.7)] border border-black/20"
        >
          {/* Photo Image */}
          <img
            src={photoDataUrl}
            alt="Developed instant photograph"
            className="w-full h-full object-cover transition-[filter] duration-150 pointer-events-none"
            style={{
              filter: combinedFilter,
            }}
          />

          {/* Film Fade Matte Overlay */}
          {fadeOpacity > 0 && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              style={{
                backgroundColor: "rgba(235, 225, 210, 0.9)",
                opacity: fadeOpacity,
              }}
            />
          )}

          {/* Film Grain Texture simulation */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              opacity: grainOpacity,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Glossy Sheen Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.08) 100%)",
            }}
          />

          {/* Interactive Date Stamp */}
          <DateStamp
            config={dateStamp}
            onUpdateConfig={onUpdateDateStamp}
            containerRef={photoContainerRef}
            isSelected={isDateStampSelected}
            onSelect={onSelectDateStamp}
          />

          {/* Interactive Stickers Layer */}
          <StickerLayer
            stickers={stickers}
            onUpdateSticker={onUpdateSticker}
            onRemoveSticker={onRemoveSticker}
            selectedStickerId={selectedStickerId}
            onSelectSticker={onSelectSticker}
            containerRef={photoContainerRef}
          />

          {/* Interactive Text Layer */}
          <TextTool
            items={textItems}
            onUpdateItem={onUpdateTextItem}
            onRemoveItem={onRemoveTextItem}
            selectedId={selectedTextId}
            onSelectId={onSelectTextId}
            containerRef={photoContainerRef}
          />
        </div>

        {/* Bottom Chin Info / Brand Details */}
        <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[10px] font-mono pointer-events-none">
          <span
            className={`font-black tracking-widest ${
              frameId === "obsidian_black" ? "text-stone-400" : "text-[#7C7468]"
            }`}
          >
            FRAME★80
          </span>
          <span
            className={`font-bold uppercase tracking-wider ${
              frameId === "obsidian_black" ? "text-stone-500" : "text-[#8C8477]"
            }`}
          >
            {filmPreset.name}
          </span>
        </div>
      </div>
    </div>
  );
};
