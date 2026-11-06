import { Adjustments, FilmPreset } from "./filmPresets";

export type FrameId =
  | "classic_white"
  | "warm_cream"
  | "obsidian_black"
  | "color_edge"
  | "rounded"
  | "vintage_paper";

export interface FrameOption {
  id: FrameId;
  name: string;
  bgClass: string;
  borderColor: string;
  paperColor: string;
  description: string;
}

export const FRAME_OPTIONS: FrameOption[] = [
  {
    id: "classic_white",
    name: "Classic White",
    bgClass: "bg-[#fdfdfb]",
    borderColor: "#e5e5dc",
    paperColor: "#ffffff",
    description: "Iconic brilliant white instant paper",
  },
  {
    id: "warm_cream",
    name: "Warm Cream",
    bgClass: "bg-[#f5eedc]",
    borderColor: "#ded4be",
    paperColor: "#f7f1e1",
    description: "Warm aged off-white stock",
  },
  {
    id: "obsidian_black",
    name: "Obsidian Black",
    bgClass: "bg-[#181716]",
    borderColor: "#33312e",
    paperColor: "#1c1a18",
    description: "Sleek matte midnight black",
  },
  {
    id: "color_edge",
    name: "Color Edge",
    bgClass: "bg-[#fcfaf5]",
    borderColor: "#e3ded4",
    paperColor: "#faf6ee",
    description: "Vintage retro rainbow footer accent",
  },
  {
    id: "rounded",
    name: "Rounded",
    bgClass: "bg-[#fcf9f2]",
    borderColor: "#ded8cb",
    paperColor: "#fdfbf7",
    description: "Smooth pillowy curved corners",
  },
  {
    id: "vintage_paper",
    name: "Vintage Kraft",
    bgClass: "bg-[#e8dcbf]",
    borderColor: "#ccbc97",
    paperColor: "#ecd9b5",
    description: "Rustic textured recycled instant print",
  },
];

export interface StickerItem {
  id: string;
  svgName: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale: number; // 0.5 to 2.5
  rotation: number; // -180 to 180 deg
}

export interface TextItem {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  rotation: number;
}

export interface DateStampConfig {
  enabled: boolean;
  type: "date" | "time" | "custom";
  customText: string;
  color: string; // "#ff6500", "#ff2a2a", "#39ff14"
  x: number; // percentage
  y: number; // percentage
  scale: number;
}

export interface PhotoCaptureResult {
  rawImage: string; // Data URL of captured raw video frame
  width: number;
  height: number;
  timestamp: number;
  filmPreset: FilmPreset;
  adjustments: Adjustments;
  frameId: FrameId;
  stickers: StickerItem[];
  textItems: TextItem[];
  dateStamp: DateStampConfig;
}
