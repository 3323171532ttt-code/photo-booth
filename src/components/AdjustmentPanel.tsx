"use client";

import React from "react";
import { RotateCcw, Sun, Contrast, Droplet, Thermometer, Aperture, Sparkles, CloudRain } from "lucide-react";
import { Adjustments, DEFAULT_ADJUSTMENTS } from "@/lib/filmPresets";
import { soundFX } from "@/lib/soundEffects";

interface AdjustmentPanelProps {
  adjustments: Adjustments;
  onChange: (adjustments: Adjustments) => void;
}

export const AdjustmentPanel: React.FC<AdjustmentPanelProps> = ({
  adjustments,
  onChange,
}) => {
  const updateField = (key: keyof Adjustments, val: number) => {
    onChange({
      ...adjustments,
      [key]: val,
    });
  };

  const handleReset = () => {
    soundFX.playTap();
    onChange(DEFAULT_ADJUSTMENTS);
  };

  const sliders = [
    { key: "brightness" as const, label: "LIGHT", icon: Sun, min: -50, max: 50, step: 1 },
    { key: "contrast" as const, label: "CONTRAST", icon: Contrast, min: -50, max: 50, step: 1 },
    { key: "saturation" as const, label: "COLOR", icon: Droplet, min: -50, max: 50, step: 1 },
    { key: "temperature" as const, label: "TEMP", icon: Thermometer, min: -50, max: 50, step: 1 },
    { key: "exposure" as const, label: "EXPOSURE", icon: Aperture, min: -50, max: 50, step: 1 },
    { key: "grain" as const, label: "GRAIN", icon: Sparkles, min: 0, max: 100, step: 1 },
    { key: "fade" as const, label: "FADE", icon: CloudRain, min: 0, max: 100, step: 1 },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-[#EAE3D5] to-[#DFD7C7] p-3.5 rounded-2xl border border-[#BDB29E] shadow-[0_4px_10px_rgba(0,0,0,0.12),inset_0_1px_0_#fff]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#C5BBA7]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#E5983B]" />
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#4A4039]">
            HARDWARE ANALOG CONTROLS
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF7F0] hover:bg-white text-[#5C5549] text-[10px] font-mono font-bold border border-[#C5BBA7] shadow-xs transition-colors btn-tactile"
        >
          <RotateCcw className="w-3 h-3" />
          RESET
        </button>
      </div>

      {/* Analog Hardware Sliders with Grooved Metal Tracks */}
      <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1 no-scrollbar">
        {sliders.map((s) => {
          const Icon = s.icon;
          const currentVal = adjustments[s.key];

          return (
            <div key={s.key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#4A4039]">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3 h-3 text-[#7C7468]" />
                  <span>{s.label}</span>
                </div>
                <span className="text-[#E88E44] bg-[#2B2724] px-1.5 py-0.2 rounded font-mono text-[9px] min-w-[28px] text-center">
                  {currentVal > 0 ? `+${currentVal}` : currentVal}
                </span>
              </div>

              {/* Recessed slider track */}
              <div className="p-0.5 bg-[#25221F] rounded-full shadow-inner border border-[#3E3833]">
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={currentVal}
                  onChange={(e) => updateField(s.key, Number(e.target.value))}
                  className="w-full h-2 bg-transparent appearance-none cursor-pointer block"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
