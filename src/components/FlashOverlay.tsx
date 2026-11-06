"use client";

import React from "react";

interface FlashOverlayProps {
  isFlashing: boolean;
}

export const FlashOverlay: React.FC<FlashOverlayProps> = ({ isFlashing }) => {
  if (!isFlashing) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none bg-white animate-strobe" />
  );
};
