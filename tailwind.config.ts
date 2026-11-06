import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          cream: "#f7f3eb",
          "cream-light": "#fcfaf6",
          "cream-dark": "#e8e1d2",
          "cream-shadow": "#cfc4b0",
          body: "#eae4d6",
          chassis: "#262321",
          "chassis-light": "#3a3633",
          shutter: "#e53835",
          "shutter-pressed": "#c62828",
          orange: "#ff7a00",
          yellow: "#f5b700",
          green: "#10b981",
          cyan: "#06b6d4",
          blue: "#3b82f6",
          red: "#ef4444",
          paper: "#fffef9",
          "paper-warm": "#faf6ed",
          "paper-vintage": "#f5eedc",
        },
      },
      fontFamily: {
        mono: [
          "Courier New",
          "Courier",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
        retro: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        retro: "0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        "retro-inset": "inset 0 2px 4px rgba(0,0,0,0.35), inset 0 -1px 2px rgba(255,255,255,0.4)",
        "shutter-3d": "0 6px 0 #991b1b, 0 10px 15px rgba(0,0,0,0.4), inset 0 2px 3px rgba(255,255,255,0.5)",
        "shutter-pressed": "0 2px 0 #991b1b, 0 4px 6px rgba(0,0,0,0.3), inset 0 2px 6px rgba(0,0,0,0.4)",
        polaroid: "0 14px 28px rgba(0,0,0,0.22), 0 10px 10px rgba(0,0,0,0.18)",
        "polaroid-glow": "0 20px 35px -5px rgba(0,0,0,0.3), 0 0 15px rgba(255,255,255,0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
