import type { Tone } from "./system";
import * as THREE from "three";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Bands + soft streaks and storms, painted into `ctx`. Seeded by the planet's
// slug, so each planet is unique and stable between visits.
export function paintBands(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: number,
  hue: number,
  tone?: Tone // pastel / fixed-theme planets: bands cluster around this saturation and lightness
) {
  const rnd = mulberry32(seed);
  ctx.globalAlpha = 1;

  const bands = 8 + Math.floor(rnd() * 8);
  let y = 0;
  for (let i = 0; i < bands; i++) {
    const bh = h / bands + (rnd() - 0.5) * (h / 32);
    const hh = hue + (rnd() - 0.5) * (tone ? 14 : 36);
    const sat = tone ? tone.sat + (rnd() - 0.5) * 14 : 32 + rnd() * 38;
    const lit = tone ? tone.light + (rnd() - 0.5) * 12 : 34 + rnd() * 26;
    ctx.fillStyle = `hsl(${hh} ${sat}% ${lit}%)`;
    ctx.fillRect(0, y, w, bh + 1);
    y += bh;
  }

  // each blob is drawn 3x so the texture wraps seamlessly
  const k = w / 512;
  const blob = (x: number, yy: number, rx: number, ry: number, style: string, alpha: number) => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = style;
    for (const dx of [-w, 0, w]) {
      ctx.beginPath();
      ctx.ellipse(x + dx, yy, rx * k, ry * k, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  for (let i = 0; i < 240; i++) {
    blob(
      rnd() * w,
      rnd() * h,
      20 + rnd() * 80,
      1.5 + rnd() * 7,
      tone
        ? `hsl(${hue + (rnd() - 0.5) * 20} ${tone.sat + (rnd() - 0.5) * 20}% ${tone.light + (rnd() - 0.5) * 30}%)`
        : `hsl(${hue + (rnd() - 0.5) * 50} ${30 + rnd() * 40}% ${25 + rnd() * 55}%)`,
      0.05 + rnd() * 0.1
    );
  }
  for (let i = 0; i < 3; i++) {
    blob(rnd() * w, h * (0.25 + rnd() * 0.5), 16 + rnd() * 26, 9 + rnd() * 12, tone ? `hsl(${hue} ${tone.sat}% 88%)` : `hsl(${hue + 20} 55% 70%)`, 0.22);
  }
  ctx.globalAlpha = 1;
}

// Multiply the canvas's alpha by a soft edge: fully faded at each border,
// easing (smoothstep-shaped) to fully opaque `f` of the way in.
function feather(l: CanvasRenderingContext2D, w: number, h: number, f: number) {
  const ramp = (g: CanvasGradient) => {
    for (const [at, a] of [[0, 0], [0.25, 0.1], [0.5, 0.5], [0.75, 0.9], [1, 1]]) {
      g.addColorStop(at * f, `rgba(0,0,0,${a})`);
      g.addColorStop(1 - at * f, `rgba(0,0,0,${a})`);
    }
  };
  l.globalCompositeOperation = "destination-in";
  const gx = l.createLinearGradient(0, 0, w, 0);
  ramp(gx);
  l.fillStyle = gx;
  l.fillRect(0, 0, w, h);
  const gy = l.createLinearGradient(0, 0, 0, h);
  ramp(gy);
  l.fillStyle = gy;
  l.fillRect(0, 0, w, h);
  l.globalCompositeOperation = "source-over";
}

// The project's thumbnail, laid over the surface at 50%.
//  - Repeated three times, evenly spaced around the planet (120° apart), each
//    copy whole and uncropped at the image's own aspect — so it's barely
//    stretched, and at every viewing angle there's a picture in view.
//  - Each copy is a little wider than its slot and every edge fades out, so
//    neighbours cross-fade into one another (no blank gap) and the picture
//    melts into the bands beneath it (no hard edge, no seam at the wrap).
//  - The copies are composed on their own layer and the layer is laid over
//    the planet at 50%, so where two overlap it doesn't come out brighter.
//  - Slightly blurred and saturated, so a screenshot reads as terrain and
//    colour fields on the planet instead of a distorted UI.
const COPIES = 3;
export function paintThumbnail(ctx: CanvasRenderingContext2D, w: number, h: number, img: HTMLImageElement) {
  const slot = w / COPIES;
  const scale = Math.min((slot * 1.2) / img.naturalWidth, (h * 0.8) / img.naturalHeight); // "contain"
  const dw = Math.round(img.naturalWidth * scale);
  const dh = Math.round(img.naturalHeight * scale);

  const tile = document.createElement("canvas");
  tile.width = dw;
  tile.height = dh;
  const l = tile.getContext("2d")!;
  if ("filter" in l) l.filter = `blur(${Math.max(0.8, w / 700)}px) saturate(1.3) contrast(1.05)`;
  l.drawImage(img, 0, 0, dw, dh);
  if ("filter" in l) l.filter = "none";
  feather(l, dw, dh, 0.3);

  const layer = document.createElement("canvas");
  layer.width = w;
  layer.height = h;
  const g = layer.getContext("2d")!;
  const y = Math.round((h - dh) / 2);
  for (let i = 0; i < COPIES; i++) {
    const x = Math.round((i + 0.5) * slot - dw / 2);
    // drawn at -w/0/+w so a copy that crosses the left/right edge wraps around
    for (const wrap of [-w, 0, w]) g.drawImage(tile, x + wrap, y);
  }

  ctx.globalAlpha = 0.5;
  ctx.drawImage(layer, 0, 0);
  ctx.globalAlpha = 1;
}

// The hue a picture is "about": hues averaged as vectors, each weighted by how
// colourful the pixel is (greys, near-white and near-black count for little).
// Returns null for a picture with no real colour — e.g. a mostly white UI
// screenshot — so the caller can keep the planet's default.
export function dominantHue(img: HTMLImageElement): number | null {
  const n = 24;
  const c = document.createElement("canvas");
  c.width = c.height = n;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, n, n);
  const d = ctx.getImageData(0, 0, n, n).data;
  let x = 0, y = 0, total = 0;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 128) continue;
    const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const sat = max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
    const w = sat * (1 - Math.abs(2 * l - 1)); // colourful AND not blown out / crushed
    if (w <= 0) continue;
    let h = 0;
    if (max !== min) {
      const dd = max - min;
      h = max === r ? ((g - b) / dd) % 6 : max === g ? (b - r) / dd + 2 : (r - g) / dd + 4;
    }
    const a = (h * Math.PI) / 3;
    x += Math.cos(a) * w;
    y += Math.sin(a) * w;
    total += w;
  }
  if (total / (n * n) < 0.06) return null;
  const hue = (Math.atan2(y, x) * 180) / Math.PI;
  return (hue + 360) % 360;
}

// radial falloff, used additively for the sun's glow
export function makeGlowTexture(): THREE.CanvasTexture {
  const s = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,226,170,1)");
  g.addColorStop(0.25, "rgba(255,170,90,0.45)");
  g.addColorStop(0.6, "rgba(255,120,60,0.12)");
  g.addColorStop(1, "rgba(255,100,50,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
