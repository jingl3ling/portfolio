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
  tone?: Tone // fixed-theme planets (pastels): the surface clusters around this saturation and lightness
) {
  const rnd = mulberry32(seed);
  ctx.globalAlpha = 1;

  // Natural, muted colour: one hue per planet, low saturation, a narrow range
  // of lightness. Bands blend into each other (a gradient through jittered
  // colour stops, not hard-edged stripes), so the planet reads as one clean
  // body — like a photograph of a gas giant — instead of a candy-striped ball.
  const baseSat = tone ? tone.sat : 22 + rnd() * 20;
  const baseLit = tone ? tone.light : 44 + rnd() * 12;
  const spread = tone ? 6 : 8;
  const stops = 9 + Math.floor(rnd() * 6);
  const bandColor = (dh: number, ds: number, dl: number, a = 1) =>
    `hsl(${hue + (rnd() - 0.5) * dh} ${baseSat + (rnd() - 0.5) * ds}% ${baseLit + (rnd() - 0.5) * dl}% / ${a})`;
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  for (let i = 0; i <= stops; i++) {
    const at = Math.min(1, Math.max(0, (i + (rnd() - 0.5) * 0.5) / stops));
    sky.addColorStop(at, bandColor(tone ? 10 : 18, spread * 2, spread * 2.4));
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // each mark is drawn 3x so the texture wraps seamlessly
  const k = w / 512;
  const mark = (x: number, y: number, rx: number, ry: number, style: string, alpha: number) => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = style;
    for (const dx of [-w, 0, w]) {
      ctx.beginPath();
      ctx.ellipse(x + dx, y, rx * k, ry * k, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  // long, faint streaks along the flow of the bands
  for (let i = 0; i < 110; i++) {
    const light = rnd() > 0.5;
    mark(rnd() * w, rnd() * h, 40 + rnd() * 120, 0.8 + rnd() * 3.5, `hsl(${hue} ${baseSat}% ${light ? baseLit + 16 : baseLit - 16}%)`, 0.05 + rnd() * 0.05);
  }
  // fine grain: soft little blotches, the "tooth" that keeps a flat colour from looking CG
  for (let i = 0; i < 520; i++) {
    const light = rnd() > 0.5;
    mark(rnd() * w, rnd() * h, 1.5 + rnd() * 6, 1 + rnd() * 3.5, `hsl(${hue} ${baseSat}% ${light ? baseLit + 14 : baseLit - 14}%)`, 0.03 + rnd() * 0.04);
  }
  // one or two soft storms
  for (let i = 0; i < 1 + Math.floor(rnd() * 2); i++) {
    mark(rnd() * w, h * (0.3 + rnd() * 0.4), 18 + rnd() * 24, 8 + rnd() * 10, `hsl(${hue + 8} ${baseSat}% ${Math.min(88, baseLit + 22)}%)`, 0.16);
  }

  // the poles darken a touch, as limb and polar haze do on real photographs
  ctx.globalAlpha = 1;
  const poles = ctx.createLinearGradient(0, 0, 0, h);
  poles.addColorStop(0, "rgba(0,0,0,0.28)");
  poles.addColorStop(0.16, "rgba(0,0,0,0)");
  poles.addColorStop(0.84, "rgba(0,0,0,0)");
  poles.addColorStop(1, "rgba(0,0,0,0.28)");
  ctx.fillStyle = poles;
  ctx.fillRect(0, 0, w, h);
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
