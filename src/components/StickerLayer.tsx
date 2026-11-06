"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Trash2, RotateCw, Move } from "lucide-react";
import { StickerItem } from "@/lib/types";
import { STICKERS } from "@/lib/stickers";

interface StickerLayerProps {
  stickers: StickerItem[];
  onUpdateSticker: (id: string, updates: Partial<StickerItem>) => void;
  onRemoveSticker: (id: string) => void;
  selectedStickerId: string | null;
  onSelectSticker: (id: string | null) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const StickerLayer: React.FC<StickerLayerProps> = ({
  stickers,
  onUpdateSticker,
  onRemoveSticker,
  selectedStickerId,
  onSelectSticker,
  containerRef,
}) => {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origRotation: number;
    origScale: number;
  }>({
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    origRotation: 0,
    origScale: 1,
  });

  const activeModeRef = useRef<"move" | "rotate" | "scale" | null>(null);

  // Global mouse / touch move
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!activeDragId || !containerRef.current || !activeModeRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX;
      const currentY = e.clientY;
      const dx = currentX - dragStartRef.current.startX;
      const dy = currentY - dragStartRef.current.startY;

      const targetSticker = stickers.find((s) => s.id === activeDragId);
      if (!targetSticker) return;

      if (activeModeRef.current === "move") {
        const dxPct = (dx / rect.width) * 100;
        const dyPct = (dy / rect.height) * 100;

        const newX = Math.max(5, Math.min(95, dragStartRef.current.origX + dxPct));
        const newY = Math.max(5, Math.min(95, dragStartRef.current.origY + dyPct));

        onUpdateSticker(activeDragId, { x: newX, y: newY });
      } else if (activeModeRef.current === "scale") {
        // Dragging diagonal scale handle
        const scaleDelta = (dx + dy) / 120;
        const newScale = Math.max(0.4, Math.min(2.8, dragStartRef.current.origScale + scaleDelta));
        onUpdateSticker(activeDragId, { scale: Number(newScale.toFixed(2)) });
      } else if (activeModeRef.current === "rotate") {
        // Dragging rotate handle
        const stickerCenterPxX = rect.left + (rect.width * targetSticker.x) / 100;
        const stickerCenterPxY = rect.top + (rect.height * targetSticker.y) / 100;
        const angleRad = Math.atan2(currentY - stickerCenterPxY, currentX - stickerCenterPxX);
        let angleDeg = Math.round((angleRad * 180) / Math.PI);
        if (angleDeg < -180) angleDeg += 360;
        if (angleDeg > 180) angleDeg -= 360;
        onUpdateSticker(activeDragId, { rotation: angleDeg });
      }
    },
    [activeDragId, containerRef, onUpdateSticker, stickers]
  );

  const handlePointerUp = useCallback(() => {
    setActiveDragId(null);
    activeModeRef.current = null;
  }, []);

  useEffect(() => {
    if (activeDragId) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [activeDragId, handlePointerMove, handlePointerUp]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {stickers.map((stk) => {
        const meta = STICKERS.find((s) => s.id === stk.svgName);
        if (!meta) return null;
        const isSelected = selectedStickerId === stk.id;

        return (
          <div
            key={stk.id}
            className="absolute pointer-events-auto select-none touch-none"
            style={{
              left: `${stk.x}%`,
              top: `${stk.y}%`,
              transform: `translate(-50%, -50%) rotate(${stk.rotation}deg) scale(${stk.scale})`,
              transformOrigin: "center center",
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onSelectSticker(stk.id);
              setActiveDragId(stk.id);
              activeModeRef.current = "move";
              dragStartRef.current = {
                startX: e.clientX,
                startY: e.clientY,
                origX: stk.x,
                origY: stk.y,
                origRotation: stk.rotation,
                origScale: stk.scale,
              };
            }}
          >
            {/* Sticker Graphic Container */}
            <div
              className={`relative p-1 transition-shadow ${
                isSelected
                  ? "ring-2 ring-dashed ring-amber-400 bg-amber-400/10 rounded-xl shadow-lg"
                  : "hover:ring-1 hover:ring-amber-300/40 rounded-xl"
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md cursor-grab active:cursor-grabbing">
                {meta.svg({ className: "w-full h-full" })}
              </div>

              {/* Control Handles (Visible when selected) */}
              {isSelected && (
                <>
                  {/* Delete Button (Top-Right) */}
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onRemoveSticker(stk.id);
                    }}
                    className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-red-700 btn-tactile cursor-pointer"
                    title="Delete Sticker"
                  >
                    <Trash2 className="w-3 h-3 stroke-[2.5]" />
                  </button>

                  {/* Rotate Button (Top-Left) */}
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setActiveDragId(stk.id);
                      activeModeRef.current = "rotate";
                      dragStartRef.current = {
                        startX: e.clientX,
                        startY: e.clientY,
                        origX: stk.x,
                        origY: stk.y,
                        origRotation: stk.rotation,
                        origScale: stk.scale,
                      };
                    }}
                    className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-md border-2 border-white cursor-ew-resize hover:bg-amber-400 btn-tactile"
                    title="Drag to Rotate"
                  >
                    <RotateCw className="w-3 h-3 stroke-[2.5]" />
                  </div>

                  {/* Scale Handle (Bottom-Right) */}
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setActiveDragId(stk.id);
                      activeModeRef.current = "scale";
                      dragStartRef.current = {
                        startX: e.clientX,
                        startY: e.clientY,
                        origX: stk.x,
                        origY: stk.y,
                        origRotation: stk.rotation,
                        origScale: stk.scale,
                      };
                    }}
                    className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md border-2 border-white cursor-se-resize hover:bg-blue-700 btn-tactile"
                    title="Drag to Resize"
                  >
                    <Move className="w-3 h-3 stroke-[2.5]" />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
