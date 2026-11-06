import { FRAME_OPTIONS } from "./types";
import { applyFilmEffectToImageData } from "./filmPresets";
import type { PhotoCaptureResult } from "./types";

/**
 * Render the full composite high-res instant photo to a Canvas and return as dataURL or Blob.
 */
export async function renderFinalCompositeCanvas(
  photoData: PhotoCaptureResult
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  // High-res output dimensions (1080x1320 instant film aspect ratio ~ 3.5 x 4.2)
  const W = 1080;
  const H = 1320;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2d context");

  const frameInfo =
    FRAME_OPTIONS.find((f) => f.id === photoData.frameId) || FRAME_OPTIONS[0];

  // 1. Draw outer frame / card stock
  ctx.save();
  const cornerRadius = photoData.frameId === "rounded" ? 36 : 18;
  drawRoundedRect(ctx, 0, 0, W, H, cornerRadius);
  ctx.fillStyle = frameInfo.paperColor;
  ctx.fill();

  // Subtle paper texture / noise
  drawPaperTexture(ctx, W, H, photoData.frameId);

  // Border outline
  ctx.strokeStyle = frameInfo.borderColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // If color_edge frame: draw retro rainbow stripe on the bottom margin
  if (photoData.frameId === "color_edge") {
    const stripeY = H - 180;
    const stripeH = 8;
    const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];
    colors.forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.fillRect(60, stripeY + idx * stripeH, W - 120, stripeH);
    });
  }

  // 2. Photo cutout area
  const photoX = 64;
  const photoY = 64;
  const photoW = W - 128; // 952
  const photoH = H - 320; // 1000

  // Draw inner photo aperture shadow
  ctx.save();
  ctx.fillStyle = "#111111";
  drawRoundedRect(ctx, photoX, photoY, photoW, photoH, 8);
  ctx.fill();
  ctx.clip();

  // Load and draw the raw photo
  const rawImg = await loadImage(photoData.rawImage);

  // Aspect-fill image into photo rect
  const imgRatio = rawImg.width / rawImg.height;
  const targetRatio = photoW / photoH;
  let sX = 0,
    sY = 0,
    sW = rawImg.width,
    sH = rawImg.height;

  if (imgRatio > targetRatio) {
    sW = rawImg.height * targetRatio;
    sX = (rawImg.width - sW) / 2;
  } else {
    sH = rawImg.width / targetRatio;
    sY = (rawImg.height - sH) / 2;
  }

  ctx.drawImage(rawImg, sX, sY, sW, sH, photoX, photoY, photoW, photoH);

  // 3. Apply Film Preset and Adjustments to the photo pixels
  try {
    const imgData = ctx.getImageData(photoX, photoY, photoW, photoH);
    applyFilmEffectToImageData(
      imgData,
      photoData.filmPreset,
      photoData.adjustments
    );
    ctx.putImageData(imgData, photoX, photoY);
  } catch (err) {
    console.warn("Could not apply pixel filters directly:", err);
  }

  // 4. Subtle photo sheen / gloss reflection
  const glossGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
  glossGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
  glossGrad.addColorStop(0.35, "rgba(255, 255, 255, 0.02)");
  glossGrad.addColorStop(0.65, "rgba(0, 0, 0, 0.0)");
  glossGrad.addColorStop(1, "rgba(0, 0, 0, 0.12)");
  ctx.fillStyle = glossGrad;
  ctx.fillRect(photoX, photoY, photoW, photoH);

  // Inner border bevel
  ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
  ctx.lineWidth = 3;
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  ctx.restore(); // Restore from photo clip

  // 5. Draw Date Stamp
  if (photoData.dateStamp.enabled) {
    drawDateStampOnCanvas(ctx, photoData.dateStamp, photoX, photoY, photoW, photoH);
  }

  // 6. Draw Stickers
  for (const stk of photoData.stickers) {
    await drawStickerOnCanvas(ctx, stk, photoX, photoY, photoW, photoH);
  }

  // 7. Draw Text Items
  for (const txt of photoData.textItems) {
    drawTextItemOnCanvas(ctx, txt, photoX, photoY, photoW, photoH, W, H);
  }

  // 8. Subtle camera brand / film name watermark on bottom margin
  ctx.save();
  ctx.font = "600 24px 'Courier New', monospace";
  ctx.fillStyle = photoData.frameId === "obsidian_black" ? "rgba(255,255,255,0.4)" : "rgba(40,35,30,0.35)";
  ctx.textAlign = "right";
  ctx.fillText(photoData.filmPreset.name.toUpperCase(), W - 70, H - 45);

  ctx.textAlign = "left";
  ctx.font = "700 22px system-ui, sans-serif";
  ctx.fillStyle = photoData.frameId === "obsidian_black" ? "rgba(255,255,255,0.3)" : "rgba(40,35,30,0.25)";
  ctx.fillText("FRAME★80", 70, H - 45);
  ctx.restore();

  return canvas;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawPaperTexture(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frameId: string
) {
  // Delicate paper flecks
  ctx.save();
  const fleckCount = frameId === "vintage_paper" ? 800 : 250;
  ctx.fillStyle = frameId === "obsidian_black" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)";
  for (let i = 0; i < fleckCount; i++) {
    const fx = Math.random() * w;
    const fy = Math.random() * h;
    const fsize = Math.random() * 2 + 0.5;
    ctx.fillRect(fx, fy, fsize, fsize);
  }
  ctx.restore();
}

function drawDateStampOnCanvas(
  ctx: CanvasRenderingContext2D,
  ds: PhotoCaptureResult["dateStamp"],
  px: number,
  py: number,
  pw: number,
  ph: number
) {
  ctx.save();
  let text = "";
  const now = new Date();

  if (ds.type === "date") {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const m = months[now.getMonth()];
    const d = String(now.getDate()).padStart(2, "0");
    const y = String(now.getFullYear()).slice(-2);
    text = `${m} ${d} '${y}`;
  } else if (ds.type === "time") {
    const hours = String(now.getHours()).padStart(2, "0");
    const mins = String(now.getMinutes()).padStart(2, "0");
    text = `${hours}:${mins}`;
  } else {
    text = ds.customText || "RETRO '86";
  }

  // Calculate position
  const x = px + (pw * ds.x) / 100;
  const y = py + (ph * ds.y) / 100;

  const fontSize = Math.round(38 * (ds.scale || 1));
  ctx.font = `700 ${fontSize}px 'Courier New', monospace`;

  // Vintage LED phosphor glow
  ctx.shadowColor = ds.color || "#ff6500";
  ctx.shadowBlur = 10;
  ctx.fillStyle = ds.color || "#ff7a00";
  ctx.fillText(text, x, y);

  // Extra pass for hot center
  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = 0.55;
  ctx.fillText(text, x, y);

  ctx.restore();
}

async function drawStickerOnCanvas(
  ctx: CanvasRenderingContext2D,
  stk: PhotoCaptureResult["stickers"][0],
  px: number,
  py: number,
  pw: number,
  ph: number
) {
  const { STICKERS } = await import("./stickers");
  const meta = STICKERS.find((s) => s.id === stk.svgName);
  if (!meta) return;

  // Render SVG to dataURL
  const svgEl = meta.svg({ width: "100", height: "100" });
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactDOMServer = await import("react-dom/server");
  const svgString = ReactDOMServer.renderToStaticMarkup(svgEl);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const img = await loadImage(url);
  URL.revokeObjectURL(url);

  ctx.save();
  const centerX = px + (pw * stk.x) / 100;
  const centerY = py + (ph * stk.y) / 100;
  const size = 110 * stk.scale;

  ctx.translate(centerX, centerY);
  ctx.rotate((stk.rotation * Math.PI) / 180);

  // Sticker drop shadow
  ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;

  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

function drawTextItemOnCanvas(
  ctx: CanvasRenderingContext2D,
  txt: PhotoCaptureResult["textItems"][0],
  px: number,
  py: number,
  pw: number,
  ph: number,
  canvasW: number,
  canvasH: number
) {
  ctx.save();
  // If placed on photo or margin
  const x = px + (pw * txt.x) / 100;
  const y = py + (ph * txt.y) / 100;

  ctx.translate(x, y);
  ctx.rotate((txt.rotation * Math.PI) / 180);

  ctx.font = `bold ${txt.fontSize * 1.8}px ${txt.fontFamily}`;
  ctx.fillStyle = txt.color;
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(txt.text, 0, 0);
  ctx.restore();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}
