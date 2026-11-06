"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Download,
  Share2,
  Film,
  Sliders,
  Smile,
  Calendar,
  Type,
  Frame,
  Plus,
} from "lucide-react";
import confetti from "canvas-confetti";
import { FilmPreset, FILM_PRESETS } from "@/lib/filmPresets";
import { PhotoCaptureResult, FrameId, StickerItem, TextItem } from "@/lib/types";
import { InstantPhotoFrame } from "./InstantPhotoFrame";
import { AdjustmentPanel } from "./AdjustmentPanel";
import { StickerPanel } from "./StickerPanel";
import { FrameSelector } from "./FrameSelector";
import { FilmSlot } from "./FilmSlot";
import { renderFinalCompositeCanvas } from "@/lib/canvasExport";
import { savePhotoToGallery } from "@/lib/galleryStorage";
import { soundFX } from "@/lib/soundEffects";

interface PhotoEditorProps {
  photoData: PhotoCaptureResult;
  onRetake: () => void;
  onSavedToGallery: () => void;
}

type TabType = "film" | "adjust" | "stickers" | "text" | "date" | "frame";

export const PhotoEditor: React.FC<PhotoEditorProps> = ({
  photoData,
  onRetake,
  onSavedToGallery,
}) => {
  const [activeTab, setActiveTab] = useState<TabType | null>(null);

  const [currentFilm, setCurrentFilm] = useState<FilmPreset>(photoData.filmPreset);
  const [adjustments, setAdjustments] = useState(photoData.adjustments);
  const [frameId, setFrameId] = useState<FrameId>(photoData.frameId);
  const [stickers, setStickers] = useState<StickerItem[]>(photoData.stickers);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [dateStamp, setDateStamp] = useState(photoData.dateStamp);
  const [isDateStampSelected, setIsDateStampSelected] = useState(false);
  const [textItems, setTextItems] = useState<TextItem[]>(photoData.textItems);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  const [textDraft, setTextDraft] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textFont, setTextFont] = useState("'Courier New', Courier, monospace");

  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const deselectAll = () => {
    setSelectedStickerId(null);
    setIsDateStampSelected(false);
    setSelectedTextId(null);
  };

  const handleAddSticker = (svgName: string) => {
    const newSticker: StickerItem = {
      id: "stk_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      svgName,
      x: 35 + Math.random() * 30,
      y: 35 + Math.random() * 30,
      scale: 1,
      rotation: Math.round((Math.random() - 0.5) * 30),
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const handleUpdateSticker = (id: string, updates: Partial<StickerItem>) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleRemoveSticker = (id: string) => {
    soundFX.playTap();
    setStickers((prev) => prev.filter((s) => s.id !== id));
    if (selectedStickerId === id) setSelectedStickerId(null);
  };

  const handleAddText = () => {
    if (!textDraft.trim()) return;
    soundFX.playTap();
    const newItem: TextItem = {
      id: "txt_" + Date.now(),
      text: textDraft.trim(),
      x: 50,
      y: 85,
      fontSize: 18,
      fontFamily: textFont,
      color: textColor,
      rotation: 0,
    };
    setTextItems((prev) => [...prev, newItem]);
    setSelectedTextId(newItem.id);
    setTextDraft("");
  };

  const handleUpdateTextItem = (id: string, updates: Partial<TextItem>) => {
    setTextItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const handleRemoveTextItem = (id: string) => {
    soundFX.playTap();
    setTextItems((prev) => prev.filter((t) => t.id !== id));
    if (selectedTextId === id) setSelectedTextId(null);
  };

  const buildCurrentCaptureResult = (): PhotoCaptureResult => ({
    ...photoData,
    filmPreset: currentFilm,
    adjustments,
    frameId,
    stickers,
    textItems,
    dateStamp,
  });

  const handleSaveImage = async () => {
    try {
      setIsExporting(true);
      setExportMessage("Printing instant photograph...");
      soundFX.playShutter();

      const composite = buildCurrentCaptureResult();
      const canvas = await renderFinalCompositeCanvas(composite);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

      await savePhotoToGallery({
        id: "snap_" + Date.now(),
        timestamp: Date.now(),
        dataUrl,
        filmId: currentFilm.id,
        filmName: currentFilm.name,
      });

      onSavedToGallery();

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `frame80-${currentFilm.code.toLowerCase()}-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      confetti({
        particleCount: 65,
        spread: 55,
        origin: { y: 0.8 },
      });

      setExportMessage("Saved to Gallery & Photos!");
      setTimeout(() => setExportMessage(null), 2500);
    } catch (err) {
      console.error("Save error:", err);
      setExportMessage("Failed to save image.");
      setTimeout(() => setExportMessage(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsExporting(true);
      setExportMessage("Preparing share sheet...");

      const composite = buildCurrentCaptureResult();
      const canvas = await renderFinalCompositeCanvas(composite);

      if (navigator.share) {
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              handleSaveImage();
              return;
            }
            const file = new File([blob], "frame80_instant.jpg", { type: "image/jpeg" });
            try {
              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                  files: [file],
                  title: "Retro Instant Photo",
                  text: `Shot with FRAME 80 using ${currentFilm.name}!`,
                });
                setExportMessage(null);
              } else {
                await navigator.share({
                  title: "Retro Instant Photo",
                  text: `Shot with FRAME 80 using ${currentFilm.name}!`,
                  url: window.location.href,
                });
                setExportMessage(null);
              }
            } catch (err: unknown) {
              if ((err as Error).name !== "AbortError") {
                handleSaveImage();
              } else {
                setExportMessage(null);
              }
            }
          },
          "image/jpeg",
          0.95
        );
      } else {
        handleSaveImage();
      }
    } catch (err) {
      console.warn("Share fallback:", err);
      handleSaveImage();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden camera-plastic-body select-none">
      {/* Top Camera Header in Edit Mode */}
      <header className="relative z-30 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-[#FAF7F0] to-[#EAE3D5] border-b border-[#D5CBB9] shadow-xs pt-[calc(0.5rem+env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          {/* Faded retro rainbow stripes */}
          <div className="flex h-5 w-3.5 rounded-2xs overflow-hidden border border-[#C5BBA7]">
            <span className="flex-1 bg-[#D9534F]" />
            <span className="flex-1 bg-[#E88E44]" />
            <span className="flex-1 bg-[#E5B53B]" />
            <span className="flex-1 bg-[#5B9E6A]" />
            <span className="flex-1 bg-[#4A7BB0]" />
          </div>
          <span className="text-xs font-black uppercase tracking-tight text-[#3A3938] font-sans">
            FRAME • {currentFilm.name}
          </span>
        </div>

        {/* Retake Button styled as mechanical camera reset */}
        <button
          type="button"
          onClick={() => {
            soundFX.playTap();
            onRetake();
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-b from-[#FAF7F0] to-[#DDD4C4] hover:bg-white text-[#4A4039] text-xs font-bold border border-[#BDB29E] shadow-xs transition-colors btn-tactile font-mono"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          RETAKE
        </button>
      </header>

      {/* Film Slot underneath header */}
      <FilmSlot />

      {/* Main Viewport: The Instant Print sitting on camera body */}
      <div className="flex-1 relative flex items-center justify-center p-2 overflow-y-auto no-scrollbar">
        <InstantPhotoFrame
          photoDataUrl={photoData.rawImage}
          filmPreset={currentFilm}
          adjustments={adjustments}
          frameId={frameId}
          stickers={stickers}
          onUpdateSticker={handleUpdateSticker}
          onRemoveSticker={handleRemoveSticker}
          selectedStickerId={selectedStickerId}
          onSelectSticker={(id) => {
            deselectAll();
            setSelectedStickerId(id);
          }}
          dateStamp={dateStamp}
          onUpdateDateStamp={(updates) => setDateStamp((prev) => ({ ...prev, ...updates }))}
          isDateStampSelected={isDateStampSelected}
          onSelectDateStamp={() => {
            deselectAll();
            setIsDateStampSelected(true);
          }}
          textItems={textItems}
          onUpdateTextItem={handleUpdateTextItem}
          onRemoveTextItem={handleRemoveTextItem}
          selectedTextId={selectedTextId}
          onSelectTextId={(id) => {
            deselectAll();
            setSelectedTextId(id);
          }}
          onDeselectAll={deselectAll}
        />

        {/* Export Toast Notification */}
        {exportMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#1C1A18]/90 text-[#FFA733] text-xs font-mono font-bold tracking-wider border border-[#E5983B]/50 shadow-xl backdrop-blur-sm animate-bounce z-50">
            {exportMessage}
          </div>
        )}
      </div>

      {/* Editing Toolbar Drawer (If a tool is active) */}
      {activeTab && (
        <div className="relative z-30 px-3 pb-2 max-w-lg mx-auto w-full animate-eject">
          {activeTab === "film" && (
            <div className="w-full bg-gradient-to-b from-[#EAE3D5] to-[#DFD7C7] p-3 rounded-2xl border border-[#BDB29E] shadow-[0_4px_10px_rgba(0,0,0,0.12),inset_0_1px_0_#fff]">
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#C5BBA7]">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#4A4039]">
                  FILM CARTRIDGE SELECT
                </span>
                <span className="text-[9px] text-[#7C7468] font-mono">
                  {currentFilm.code}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar -mx-1 px-1">
                {FILM_PRESETS.map((f) => {
                  const isSel = f.id === currentFilm.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        soundFX.playTap();
                        setCurrentFilm(f);
                      }}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border transition-all btn-tactile ${
                        isSel
                          ? "bg-[#E88E44] text-stone-950 border-[#A7571B] shadow-md scale-102"
                          : "bg-[#FAF7F0] text-[#4A4039] border-[#C5BBA7] hover:border-[#8C8477]"
                      }`}
                    >
                      {f.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "adjust" && (
            <AdjustmentPanel
              adjustments={adjustments}
              onChange={(adj) => setAdjustments(adj)}
            />
          )}

          {activeTab === "stickers" && (
            <StickerPanel onAddSticker={handleAddSticker} />
          )}

          {activeTab === "text" && (
            <div className="w-full bg-gradient-to-b from-[#EAE3D5] to-[#DFD7C7] p-3 rounded-2xl border border-[#BDB29E] shadow-md">
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#C5BBA7]">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#4A4039]">
                  TYPEWRITER CAPTION
                </span>
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Type a memory or note..."
                  value={textDraft}
                  onChange={(e) => setTextDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddText()}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#C5BBA7] text-xs font-semibold text-[#3A3938] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#E88E44]"
                />
                <button
                  type="button"
                  onClick={handleAddText}
                  className="px-3 py-1.5 rounded-lg bg-[#2B2724] hover:bg-black text-[#FFA733] text-xs font-bold transition-colors flex items-center gap-1 btn-tactile"
                >
                  <Plus className="w-3.5 h-3.5" />
                  ADD
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono font-bold text-[#7C7468]">
                    INK:
                  </span>
                  {["#ffffff", "#ffde00", "#ff4b6e", "#38bdf8", "#1c1917"].map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setTextColor(col)}
                      className={`w-4.5 h-4.5 rounded-full border border-stone-400 shadow-xs transition-transform ${
                        textColor === col ? "scale-125 ring-2 ring-[#E88E44]" : ""
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setTextFont("'Courier New', Courier, monospace")}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                      textFont.includes("Courier")
                        ? "bg-[#E88E44] text-stone-950 border-[#A7571B] font-bold"
                        : "bg-white text-stone-700 border-[#C5BBA7]"
                    }`}
                  >
                    Typewriter
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextFont("Impact, fantasy, sans-serif")}
                    className={`px-2 py-0.5 rounded text-[9px] font-sans border uppercase ${
                      textFont.includes("Impact")
                        ? "bg-[#E88E44] text-stone-950 border-[#A7571B] font-bold"
                        : "bg-white text-stone-700 border-[#C5BBA7]"
                    }`}
                  >
                    Retro Bold
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "date" && (
            <div className="w-full bg-gradient-to-b from-[#EAE3D5] to-[#DFD7C7] p-3 rounded-2xl border border-[#BDB29E] shadow-md">
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#C5BBA7]">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#4A4039]">
                  VINTAGE DATE STAMP
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <span className="text-[10px] font-mono font-bold text-[#4A4039]">
                    {dateStamp.enabled ? "ACTIVE" : "OFF"}
                  </span>
                  <input
                    type="checkbox"
                    checked={dateStamp.enabled}
                    onChange={(e) =>
                      setDateStamp((prev) => ({ ...prev, enabled: e.target.checked }))
                    }
                    className="w-4 h-4 rounded accent-[#E88E44] cursor-pointer"
                  />
                </label>
              </div>

              {dateStamp.enabled && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDateStamp((prev) => ({ ...prev, type: "date" }))}
                      className={`flex-1 py-1 rounded text-xs font-mono font-bold border ${
                        dateStamp.type === "date"
                          ? "bg-[#E88E44] text-stone-950 border-[#A7571B]"
                          : "bg-white text-stone-700 border-[#C5BBA7]"
                      }`}
                    >
                      DATE
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateStamp((prev) => ({ ...prev, type: "time" }))}
                      className={`flex-1 py-1 rounded text-xs font-mono font-bold border ${
                        dateStamp.type === "time"
                          ? "bg-[#E88E44] text-stone-950 border-[#A7571B]"
                          : "bg-white text-stone-700 border-[#C5BBA7]"
                      }`}
                    >
                      TIME
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateStamp((prev) => ({ ...prev, type: "custom" }))}
                      className={`flex-1 py-1 rounded text-xs font-mono font-bold border ${
                        dateStamp.type === "custom"
                          ? "bg-[#E88E44] text-stone-950 border-[#A7571B]"
                          : "bg-white text-stone-700 border-[#C5BBA7]"
                      }`}
                    >
                      CUSTOM
                    </button>
                  </div>

                  {dateStamp.type === "custom" && (
                    <input
                      type="text"
                      placeholder="e.g. RETRO 1986"
                      value={dateStamp.customText}
                      onChange={(e) =>
                        setDateStamp((prev) => ({ ...prev, customText: e.target.value }))
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#C5BBA7] text-xs font-mono font-bold text-[#E88E44] focus:outline-none"
                    />
                  )}

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold text-[#7C7468]">
                        LED:
                      </span>
                      {["#ff7a00", "#ff2a2a", "#39ff14"].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setDateStamp((prev) => ({ ...prev, color: col }))}
                          className={`w-4 h-4 rounded-full border border-stone-400 shadow-xs transition-transform ${
                            dateStamp.color === col ? "scale-125 ring-2 ring-[#E88E44]" : ""
                          }`}
                          style={{ backgroundColor: col }}
                        />
                      ))}
                    </div>
                    <span className="text-[9px] text-[#7C7468] font-mono">
                      Drag to position on print
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "frame" && (
            <FrameSelector
              selectedFrameId={frameId}
              onSelectFrame={(f) => setFrameId(f)}
            />
          )}
        </div>
      )}

      {/* Bottom Physical Tool Switcher & Action Dock */}
      <footer className="relative z-30 w-full bg-gradient-to-t from-[#DCD4C6] via-[#EAE3D5] to-[#F5EFE4] border-t border-[#C5BBA7] p-3 shadow-lg pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        {/* Physical Tool Category Buttons */}
        <div className="flex items-center justify-around max-w-md mx-auto mb-3">
          {[
            { id: "film" as const, label: "FILM", icon: Film },
            { id: "adjust" as const, label: "LIGHT", icon: Sliders },
            { id: "stickers" as const, label: "STICKER", icon: Smile },
            { id: "text" as const, label: "TEXT", icon: Type },
            { id: "date" as const, label: "DATE", icon: Calendar },
            { id: "frame" as const, label: "FRAME", icon: Frame },
          ].map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTab === tool.id;

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => {
                  soundFX.playTap();
                  setActiveTab((prev) => (prev === tool.id ? null : tool.id));
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all btn-tactile ${
                  isActive
                    ? "bg-[#E88E44] text-stone-950 font-black shadow-sm scale-105 border border-[#A7571B]"
                    : "text-[#5C5549] hover:text-[#3A3938] hover:bg-[#E0D8C8] border border-transparent"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-mono font-bold tracking-tight mt-0.5">
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Primary Action Buttons: Share & Save Instant Photo */}
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button
            type="button"
            onClick={handleShare}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-b from-[#FAF7F0] to-[#DDD4C4] hover:bg-white text-[#4A4039] border border-[#BDB29E] font-bold text-xs uppercase tracking-wider shadow-sm transition-all btn-tactile disabled:opacity-50 font-mono"
          >
            <Share2 className="w-3.5 h-3.5" />
            SHARE
          </button>

          <button
            type="button"
            onClick={handleSaveImage}
            disabled={isExporting}
            className="flex-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D9534F] to-[#E88E44] hover:brightness-105 text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_6px_14px_rgba(217,83,79,0.4),inset_0_1px_1px_#fff] transition-all btn-tactile disabled:opacity-50 font-mono"
          >
            <Download className="w-4 h-4" />
            SAVE PHOTO
          </button>
        </div>
      </footer>
    </div>
  );
};
