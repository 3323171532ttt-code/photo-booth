# FRAME 80 — Retro Instant Film Camera Web App

A mobile-first retro instant film camera web app that recreates the physical, tactile, and nostalgic experience of a vintage instant camera.

Designed with a warm ivory molded plastic chassis, muted vertical film rainbow stripes, tactile physical controls, an authentic instant print developing animation, a complete film lab with 8 original film presets, analog adjustments, scrapbook stickers, vintage date stamp, and high-resolution Canvas export.

---

## 📸 Key Features

- **Tactile Camera Body**: Warm cream / ivory molded plastic chassis, dark mechanical gray details, realistic bevels, and textured matte grip panels.
- **Top Hardware Bar**: Fictional retro brand `FRAME`, muted vertical film rainbow stripes, mechanical flash reflector & toggle, and recessed 7-segment LED film exposure counter (`08` → `07` → `06`...).
- **Horizontal Film Slot**: When a photo is taken, the instant print mechanically slides out of the recessed film slot with camera shake and motor whirr sound.
- **Photo Developing Animation**: Starts with dark, murky blue-gray emulsion with chemical reaction sheen, then gradually clears into the vibrant final photograph over 3.5 seconds.
- **8 Original Film Presets**:
  - `ORIG-100` (Original)
  - `GOLD-400` (Warm Film)
  - `AERO-200` (Cool Film)
  - `VINT-70` (Vintage)
  - `DISPO-96` (90s Film)
  - `MIST-160` (Faded Film)
  - `POPR-800` (Flash Film)
  - `SILV-400` (Black & White)
- **Studio & Editing Suite**:
  - **Analog Sliders**: Light (Brightness & Exposure), Contrast, Color (Saturation & Temperature), Film Grain, and Matte Fade.
  - **Scrapbook Stickers**: 12 original playful retro stickers with drag, resize, rotate, and delete handles.
  - **Vintage Date Stamp**: Old-school orange/amber phosphor camera stamp (Date, Time, Custom text).
  - **Retro Captions**: Draggable typewriter and bold retro text.
  - **6 Paper Frame Stocks**: Classic White, Warm Cream, Obsidian Black, Color Edge, Rounded, and Vintage Kraft.
- **Physical Controls**:
  - Center: Large 3D glossy red shutter button with brushed metal bezel.
  - Left: Circular cluster dial for quick film preset switching and cartridge drawer.
  - Right: Instant photo stack holder with counter badge.
- **Export & Gallery**:
  - High-res Canvas export combining photo, color grading, film grain, frame paper, stickers, text, and date stamp.
  - Native Web Share API with photos sheet integration.
  - Persistent IndexedDB film roll gallery.
- **PWA & Mobile Ready**: Full-screen standalone mode, viewport-fit=cover, and iPhone safe-area padding.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm or yarn

### Installation
```bash
git clone https://github.com/3323171532ttt-code/photo-booth.git
cd photo-booth
npm install
```

### Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the displayed port) in your browser.

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, custom skeuomorphic depth styles
- **Icons**: Lucide React
- **Audio**: Web Audio API synthesized mechanical shutter click and film motor sound
- **Storage**: IndexedDB (`idb-keyval`)
- **Canvas Engine**: HTML5 Canvas composite exporter & procedural film grain generator
