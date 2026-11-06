export interface FilmPreset {
  id: string;
  name: string;
  code: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  cssFilter: string;
  defaultGrain: number;
  temperature: number; // -100 to 100
  tint: number; // -100 to 100
  saturation: number; // 0 to 200
  contrast: number; // 50 to 150
  brightness: number; // 50 to 150
  fade: number; // 0 to 100
}

export interface Adjustments {
  brightness: number; // -50 to 50
  contrast: number; // -50 to 50
  saturation: number; // -50 to 50
  temperature: number; // -50 to 50
  exposure: number; // -50 to 50
  grain: number; // 0 to 100
  fade: number; // 0 to 100
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  temperature: 0,
  exposure: 0,
  grain: 30,
  fade: 0,
};

export const FILM_PRESETS: FilmPreset[] = [
  {
    id: "original",
    name: "Original",
    code: "ORIG-100",
    description: "Crisp, balanced natural instant color tones",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    badgeText: "ORIG",
    cssFilter: "contrast(1.05) saturate(1.05)",
    defaultGrain: 20,
    temperature: 0,
    tint: 0,
    saturation: 105,
    contrast: 105,
    brightness: 100,
    fade: 5,
  },
  {
    id: "warm",
    name: "Warm Film",
    code: "GOLD-400",
    description: "Golden hour glow with rich amber and honey tones",
    badgeBg: "bg-orange-100 text-orange-900 border-orange-300",
    badgeText: "WARM",
    cssFilter: "sepia(0.22) saturate(1.2) hue-rotate(-8deg) contrast(1.08)",
    defaultGrain: 35,
    temperature: 40,
    tint: -10,
    saturation: 120,
    contrast: 108,
    brightness: 102,
    fade: 10,
  },
  {
    id: "cool",
    name: "Cool Film",
    code: "AERO-200",
    description: "Cyan shadows and nostalgic moody blue highlights",
    badgeBg: "bg-cyan-100 text-cyan-900 border-cyan-300",
    badgeText: "COOL",
    cssFilter: "hue-rotate(15deg) saturate(0.95) contrast(1.1) brightness(1.02)",
    defaultGrain: 30,
    temperature: -40,
    tint: 15,
    saturation: 95,
    contrast: 110,
    brightness: 102,
    fade: 8,
  },
  {
    id: "vintage",
    name: "Vintage",
    code: "VINT-70",
    description: "1970s analog feel with sepia tint and lifted shadows",
    badgeBg: "bg-yellow-100 text-yellow-900 border-yellow-300",
    badgeText: "VINT",
    cssFilter: "sepia(0.4) contrast(0.95) brightness(1.05) saturate(0.85)",
    defaultGrain: 45,
    temperature: 30,
    tint: 20,
    saturation: 85,
    contrast: 95,
    brightness: 105,
    fade: 25,
  },
  {
    id: "film90s",
    name: "90s Film",
    code: "DISPO-96",
    description: "Punchy disposable camera with high saturation and bold pop",
    badgeBg: "bg-pink-100 text-pink-900 border-pink-300",
    badgeText: "90s",
    cssFilter: "contrast(1.25) saturate(1.35) brightness(0.98)",
    defaultGrain: 40,
    temperature: 10,
    tint: 5,
    saturation: 135,
    contrast: 125,
    brightness: 98,
    fade: 12,
  },
  {
    id: "faded",
    name: "Faded Film",
    code: "MIST-160",
    description: "Dreamy milky shadows and pastel matte wash",
    badgeBg: "bg-violet-100 text-violet-900 border-violet-300",
    badgeText: "FADE",
    cssFilter: "contrast(0.85) brightness(1.12) saturate(0.8)",
    defaultGrain: 35,
    temperature: 5,
    tint: 0,
    saturation: 80,
    contrast: 85,
    brightness: 112,
    fade: 40,
  },
  {
    id: "flash",
    name: "Flash Film",
    code: "POPR-800",
    description: "Direct pop-flash contrast with vivid crisp details",
    badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
    badgeText: "FLSH",
    cssFilter: "brightness(1.15) contrast(1.3) saturate(1.1)",
    defaultGrain: 25,
    temperature: -5,
    tint: 0,
    saturation: 110,
    contrast: 130,
    brightness: 115,
    fade: 5,
  },
  {
    id: "bw",
    name: "Black & White",
    code: "SILV-400",
    description: "Timeless monochrome with deep shadows and silver grain",
    badgeBg: "bg-stone-200 text-stone-900 border-stone-400",
    badgeText: "B&W",
    cssFilter: "grayscale(1) contrast(1.3) brightness(1.02)",
    defaultGrain: 50,
    temperature: 0,
    tint: 0,
    saturation: 0,
    contrast: 130,
    brightness: 102,
    fade: 10,
  },
];

/**
 * Apply film effect and user adjustments to an ImageData array.
 */
export function applyFilmEffectToImageData(
  imgData: ImageData,
  preset: FilmPreset,
  adj: Adjustments
): void {
  const data = imgData.data;
  const len = data.length;

  // Combine preset settings and user adjustments
  const totalBrightness = ((preset.brightness - 100) + adj.brightness * 1.2 + adj.exposure * 1.5) / 100;
  const totalContrast = Math.max(0.2, (preset.contrast + adj.contrast * 1.2) / 100);
  const totalSaturation = Math.max(0, (preset.saturation + adj.saturation * 1.2) / 100);
  const totalTemp = (preset.temperature + adj.temperature * 1.2) / 100; // positive = warmer (more red/yellow, less blue)
  const totalTint = preset.tint / 100; // positive = magenta/green
  const totalFade = Math.min(1, Math.max(0, (preset.fade + adj.fade) / 100));
  const grainLevel = Math.max(0, Math.min(100, (preset.defaultGrain + adj.grain * 0.7))) / 100;
  const isBW = preset.id === "bw" || (preset.saturation === 0 && adj.saturation <= 0);

  // Pre-calculate contrast factor
  // Standard contrast formula: (color - 128) * factor + 128
  const contrastFactor = totalContrast;

  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // 1. Exposure / Brightness offset
    if (totalBrightness !== 0) {
      const bOffset = totalBrightness * 128;
      r += bOffset;
      g += bOffset;
      b += bOffset;
    }

    // 2. Contrast
    if (contrastFactor !== 1) {
      r = (r - 128) * contrastFactor + 128;
      g = (g - 128) * contrastFactor + 128;
      b = (b - 128) * contrastFactor + 128;
    }

    // 3. Black & White or Saturation
    if (isBW) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray;
      g = gray;
      b = gray;
    } else if (totalSaturation !== 1) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * totalSaturation;
      g = gray + (g - gray) * totalSaturation;
      b = gray + (b - gray) * totalSaturation;
    }

    // 4. Color Temperature & Tint
    if (!isBW && (totalTemp !== 0 || totalTint !== 0)) {
      // Warm: boost red, reduce blue
      r += totalTemp * 35;
      b -= totalTemp * 35;
      // Tint: positive = magenta (boost R & B, reduce G)
      g -= totalTint * 20;
    }

    // 5. Film Fade (lift shadows, compress dynamic range for analog matte feel)
    if (totalFade > 0) {
      const fadeOffset = totalFade * 50;
      r = r * (1 - totalFade * 0.25) + fadeOffset;
      g = g * (1 - totalFade * 0.25) + fadeOffset;
      b = b * (1 - totalFade * 0.25) + fadeOffset;
    }

    // 6. Realistic Procedural Grain
    if (grainLevel > 0) {
      // Fast pseudo-random noise
      const noise = (Math.random() - 0.5) * grainLevel * 70;
      r += noise;
      g += noise;
      b += noise;
    }

    // Clamp
    data[i] = r < 0 ? 0 : r > 255 ? 255 : r;
    data[i + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
    data[i + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
  }
}
