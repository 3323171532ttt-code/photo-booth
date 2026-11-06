"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Trash2, RotateCw } from "lucide-react";
import { TextItem } from "@/lib/types";

interface TextToolProps {
  items: TextItem[];
  onUpdateItem: (id: string, updates: Partial<TextItem>) => void;
  onRemoveItem: (id: string) => void;
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const TextTool: React.FC<TextToolProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
  selectedId,
  onSelectId,
  containerRef,
}) => {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origRotation: number;
  }>({
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
    origRotation: 0,
  });

  const modeRef = useRef<"move" | "rotate" | null>(null);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!activeDragId || !containerRef.current || !modeRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;

      const target = items.find((i) => i.id === activeDragId);
      if (!target) return;

      if (modeRef.current === "move") {
        const dxPct = (dx / rect.width) * 100;
        const dyPct = (dy / rect.height) * 100;
        const newX = Math.max(5, Math.min(95, dragRef.current.origX + dxPct));
        const newY = Math.max(5, Math.min(115, dragRef.current.origY + dyPct)); // can drag into bottom border chin too!
        onUpdateItem(activeDragId, { x: newX, y: newY });
      } else if (modeRef.current === "rotate") {
        const centerPxX = rect.left + (rect.width * target.x) / 100;
        const centerPxY = rect.top + (rect.height * target.y) / 100;
        const angleRad = Math.atan2(e.clientY - centerPxY, e.clientX - centerPxX);
        let angleDeg = Math.round((angleRad * 180) / Math.PI);
        onUpdateItem(activeDragId, { rotation: angleDeg });
      }
    },
    [activeDragId, containerRef, items, onUpdateItem]
  );

  const handlePointerUp = useCallback(() => {
    setActiveDragId(null);
    modeRef.current = null;
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
    <div className="absolute inset-0 pointer-events-none z-25 overflow-visible">
      {items.map((item) => {
        const isSelected = selectedId === item.id;

        return (
          <div
            key={item.id}
            className="absolute pointer-events-auto select-none touch-none"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
              transformOrigin: "center center",
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onSelectId(item.id);
              setActiveDragId(item.id);
              modeRef.current = "move";
              dragRef.current = {
                startX: e.clientX,
                startY: e.clientY,
                origX: item.x,
                origY: item.y,
                origRotation: item.rotation,
              };
            }}
          >
            <div
              className={`relative px-2 py-1 rounded transition-all cursor-grab active:cursor-grabbing ${
                isSelected
                  ? "ring-2 ring-dashed ring-amber-400 bg-black/40 backdrop-blur-xs"
                  : "hover:ring-1 hover:ring-white/40"
              }`}
            >
              <span
                style={{
                  fontFamily: item.fontFamily,
                  fontSize: `${item.fontSize}px`,
                  color: item.color,
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}
                className="font-bold whitespace-nowrap block"
              >
                {item.text || "Type caption..."}
              </span>

              {/* Action Handles when selected */}
              {isSelected && (
                <>
                  {/* Delete Button */}
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                    className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md border border-white hover:bg-red-700 btn-tactile cursor-pointer"
                    title="Delete Text"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>

                  {/* Rotate Handle */}
                  <div
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      setActiveDragId(item.id);
                      modeRef.current = "rotate";
                      dragRef.current = {
                        startX: e.clientX,
                        startY: e.clientY,
                        origX: item.x,
                        origY: item.y,
                        origRotation: item.rotation,
                      };
                    }}
                    className="absolute -top-3 -left-3 w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shadow-md border border-white cursor-ew-resize hover:bg-amber-400 btn-tactile"
                    title="Rotate"
                  >
                    <RotateCw className="w-2.5 h-2.5" />
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
