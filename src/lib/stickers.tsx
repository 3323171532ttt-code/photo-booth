import React from "react";

export interface StickerMeta {
  id: string;
  name: string;
  category: string;
  svg: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
}

export const STICKERS: StickerMeta[] = [
  {
    id: "retro_heart",
    name: "Heart",
    category: "Cute",
    svg: (props) => (
      <svg viewBox="0 0 100 100" fill="none" {...props}>
        <path
          d="M50 88C50 88 12 60 12 32C12 18 24 10 37 10C44 10 50 14 50 14C50 14 56 10 63 10C76 10 88 18 88 32C88 60 50 88 50 88Z"
          fill="#ff4b6e"
          stroke="#331118"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M26 26C30 18 40 18 42 22"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "sparkles",
    name: "Sparkles",
    category: "Cute",
    svg: (props) => (
      <svg viewBox="0 0 100 100" fill="none" {...props}>
        <path
          d="M50 5 C50 35 65 50 95 50 C65 50 50 65 50 95 C50 65 35 50 5 50 C35 50 50 35 50 5 Z"
          fill="#ffca28"
          stroke="#422a00"
          strokeWidth="3.5"
        />
        <circle cx="80" cy="20" r="5" fill="#ffeb3b" stroke="#422a00" strokeWidth="2" />
        <circle cx="20" cy="80" r="4" fill="#ffeb3b" stroke="#422a00" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "daisy",
    name: "Daisy",
    category: "Retro",
    svg: (props) => (
      <svg viewBox="0 0 100 100" fill="none" {...props}>
        {/* Petals */}
        <circle cx="50" cy="22" r="14" fill="#ffffff" stroke="#2b231d" strokeWidth="3" />
        <circle cx="78" cy="50" r="14" fill="#ffffff" stroke="#2b231d" strokeWidth="3" />
        <circle cx="50" cy="78" r="14" fill="#ffffff" stroke="#2b231d" strokeWidth="3" />
        <circle cx="22" cy="50" r="14" fill="#ffffff" stroke="#2b231d" strokeWidth="3" />
        <circle cx="30" cy="30" r="14" fill="#ffffff" stroke="#2b231d" strokeWidth="3" />
        <circle cx="70" cy="30" r="14" fill="#ffffff" stroke="#2b231d" strokeWidth="3" />
        <circle cx="30" cy="70" r="14" fill="#ffffff" stroke="#2b231d" strokeWidth="3" />
        <circle cx="70" cy="70" r="14" fill="#ffffff" stroke="#2b231d" strokeWidth="3" />
        {/* Center */}
        <circle cx="50" cy="50" r="17" fill="#ffb300" stroke="#2b231d" strokeWidth="3.5" />
      </svg>
    ),
  },
  {
    id: "smiley",
    name: "Smiley",
    category: "Retro",
    svg: (props) => (
      <svg viewBox="0 0 100 100" fill="none" {...props}>
        <circle cx="50" cy="50" r="44" fill="#ffde00" stroke="#1c1917" strokeWidth="4.5" />
        <ellipse cx="36" cy="40" rx="4.5" ry="9" fill="#1c1917" />
        <ellipse cx="64" cy="40" rx="4.5" ry="9" fill="#1c1917" />
        <path
          d="M30 60 C36 76 64 76 70 60"
          stroke="#1c1917"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "vintage_sun",
    name: "Sunny",
    category: "Retro",
    svg: (props) => (
      <svg viewBox="0 0 100 100" fill="none" {...props}>
        <g stroke="#92400e" strokeWidth="3.5" strokeLinecap="round">
          <line x1="50" y1="8" x2="50" y2="20" />
          <line x1="50" y1="80" x2="50" y2="92" />
          <line x1="8" y1="50" x2="20" y2="50" />
          <line x1="80" y1="50" x2="92" y2="50" />
          <line x1="20" y1="20" x2="29" y2="29" />
          <line x1="71" y1="71" x2="80" y2="80" />
          <line x1="20" y1="80" x2="29" y2="71" />
          <line x1="71" y1="29" x2="80" y2="20" />
        </g>
        <circle cx="50" cy="50" r="26" fill="#f59e0b" stroke="#78350f" strokeWidth="4" />
        {/* Smiling face on sun */}
        <circle cx="42" cy="46" r="3" fill="#78350f" />
        <circle cx="58" cy="46" r="3" fill="#78350f" />
        <path d="M44 56 C47 61 53 61 56 56" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "retro_camera",
    name: "Camera",
    category: "Icons",
    svg: (props) => (
      <svg viewBox="0 0 100 100" fill="none" {...props}>
        <rect x="15" y="28" width="70" height="52" rx="10" fill="#f4ede2" stroke="#292524" strokeWidth="4.5" />
        <path d="M35 28 L42 18 L58 18 L65 28 Z" fill="#d6cebd" stroke="#292524" strokeWidth="4.5" />
        <circle cx="50" cy="54" r="18" fill="#38332f" stroke="#292524" strokeWidth="4" />
        <circle cx="50" cy="54" r="10" fill="#0284c7" />
        <circle cx="47" cy="51" r="3" fill="#ffffff" />
        <circle cx="72" cy="38" r="4" fill="#dc2626" />
      </svg>
    ),
  },
  {
    id: "rainbow",
    name: "Rainbow",
    category: "Retro",
    svg: (props) => (
      <svg viewBox="0 0 100 100" fill="none" {...props}>
        <path d="M12 75 A38 38 0 0 1 88 75" stroke="#ef4444" strokeWidth="10" strokeLinecap="round" />
        <path d="M22 75 A28 28 0 0 1 78 75" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
        <path d="M32 75 A18 18 0 0 1 68 75" stroke="#10b981" strokeWidth="10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "cherries",
    name: "Cherries",
    category: "Cute",
    svg: (props) => (
      <svg viewBox="0 0 100 100" fill="none" {...props}>
        {/* Stems */}
        <path d="M52 20 C50 35 34 50 32 62" stroke="#15803d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M52 20 C60 35 68 50 68 62" stroke="#15803d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        {/* Leaf */}
        <path d="M52 20 Q66 12 60 28 Z" fill="#22c55e" stroke="#15803d" strokeWidth="2.5" />
        {/* Left cherry */}
        <circle cx="32" cy="68" r="18" fill="#e11d48" stroke="#4c0519" strokeWidth="4" />
        <ellipse cx="27" cy="62" rx="3" ry="5" fill="#fda4af" />
        {/* Right cherry */}
        <circle cx="68" cy="68" r="18" fill="#e11d48" stroke="#4c0519" strokeWidth="4" />
        <ellipse cx="63" cy="62" rx="3" ry="5" fill="#fda4af" />
      </svg>
    ),
  },
  {
    id: "peace",
    name: "Peace",
    category: "Retro",
    svg: (props) => (
      <svg viewBox="0 0 100 100" fill="none" {...props}>
        <circle cx="50" cy="50" r="42" fill="#ec4899" stroke="#18181b" strokeWidth="5" />
        <g stroke="#ffffff" strokeWidth="6.5" strokeLinecap="round">
          <line x1="50" y1="8" x2="50" y2="92" />
          <line x1="50" y1="50" x2="22" y2="78" />
          <line x1="50" y1="50" x2="78" y2="78" />
        </g>
      </svg>
    ),
  },
  {
    id: "star_burst",
    name: "Star",
    category: "Icons",
    svg: (props) => (
      <svg viewBox="0 0 100 100" fill="none" {...props}>
        <polygon
          points="50,5 64,36 98,38 72,60 80,94 50,75 20,94 28,60 2,38 36,36"
          fill="#fbbf24"
          stroke="#451a03"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <circle cx="44" cy="48" r="3" fill="#ffffff" />
      </svg>
    ),
  },
  {
    id: "cassette",
    name: "Tape",
    category: "Retro",
    svg: (props) => (
      <svg viewBox="0 0 100 100" fill="none" {...props}>
        <rect x="10" y="22" width="80" height="56" rx="6" fill="#18181b" stroke="#3f3f46" strokeWidth="3" />
        <rect x="22" y="32" width="56" height="34" rx="4" fill="#facc15" />
        <circle cx="36" cy="48" r="8" fill="#ffffff" stroke="#18181b" strokeWidth="3" />
        <circle cx="64" cy="48" r="8" fill="#ffffff" stroke="#18181b" strokeWidth="3" />
        <rect x="42" y="44" width="16" height="8" fill="#18181b" />
      </svg>
    ),
  },
  {
    id: "washi_tape",
    name: "Tape Corner",
    category: "Deco",
    svg: (props) => (
      <svg viewBox="0 0 100 100" fill="none" {...props}>
        <polygon
          points="15,40 85,15 88,38 18,63"
          fill="rgba(253, 224, 71, 0.75)"
          stroke="#ca8a04"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
      </svg>
    ),
  },
];
