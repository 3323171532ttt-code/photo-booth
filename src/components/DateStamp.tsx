"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { DateStampConfig } from "@/lib/types";

interface DateStampProps {
  config: DateStampConfig;
  onUpdateConfig: (updates: Partial<DateStampConfig>) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isSelected: boolean;
  onSelect: () => void;
}

export const DateStamp: React.FC<DateStampProps> = ({
  config,
  onUpdateConfig,
  containerRef,
  isSelected,
  onSelect,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number }>({
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: config.x,
      origY: config.y,
    };
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragRef.current.startX) / rect.width) * 100;
      const dy = ((e.clientY - dragRef.current.startY) / rect.height) * 100;

      const newX = Math.max(5, Math.min(85, dragRef.current.origX + dx));
      const newY = Math.max(5, Math.min(95, dragRef.current.origY + dy));

      onUpdateConfig({ x: newX, y: newY });
    },
    [containerRef, isDragging, onUpdateConfig]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  if (!config.enabled) return null;

  // Format string
  let displayStr = "";
  const now = new Date();
  if (config.type === "date") {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const m = months[now.getMonth()];
    const d = String(now.getDate()).padStart(2, "0");
    const y = String(now.getFullYear()).slice(-2);
    displayStr = `${m} ${d} '${y}`;
  } else if (config.type === "time") {
    const hours = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");
    displayStr = `${hours}:${mins}`;
  } else {
    displayStr = config.customText || "RETRO '86";
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      className={`absolute z-20 cursor-grab active:cursor-grabbing select-none touch-none transition-all ${
        isSelected ? "ring-2 ring-dashed ring-amber-400 bg-black/40 px-2 py-0.5 rounded" : ""
      }`}
      style={{
        left: `${config.x}%`,
        top: `${config.y}%`,
        transform: `translate(-10%, -50%) scale(${config.scale || 1})`,
        transformOrigin: "left center",
      }}
    >
      <span
        className="font-mono font-black text-sm tracking-widest drop-shadow-[0_0_8px_currentColor]"
        style={{
          color: config.color || "#ff7a00",
          fontFamily: "'Courier New', Courier, monospace",
        }}
      >
        {displayStr}
      </span>
    </div>
  );
};
