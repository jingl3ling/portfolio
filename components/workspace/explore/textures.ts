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

// A banded, mottled gas-giant-ish surface, drawn once per planet and seeded by
// its slug so every planet is unique but stable between visits. No image
// assets to download.
export function makePlanetTexture(seed: number, hue: number): THREE.CanvasTexture {
  const rnd = mulberry32(seed);
  const w = 512, h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const bands = 8 + Math.floor(rnd() * 8);
  let y = 0;
  for (let i = 0; i < bands; i++) {
    const bh = h / bands + (rnd() - 0.5) * 8;
    ctx.fillStyle = `hsl(${hue + (rnd() - 0.5) * 36} ${32 + rnd() * 38}% ${34 + rnd() * 26}%)`;
    ctx.fillRect(0, y, w, bh + 1);
    y += bh;
  }

  // soft streaks and storms; each is drawn 3x so the texture wraps seamlessly
  const blob = (x: number, yy: number, rx: number, ry: number, style: string, alpha: number) => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = style;
    for (const dx of [-w, 0, w]) {
      ctx.beginPath();
      ctx.ellipse(x + dx, yy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  for (let i = 0; i < 240; i++) {
    blob(
      rnd() * w,
      rnd() * h,
      20 + rnd() * 80,
      1.5 + rnd() * 7,
      `hsl(${hue + (rnd() - 0.5) * 50} ${30 + rnd() * 40}% ${25 + rnd() * 55}%)`,
      0.05 + rnd() * 0.1
    );
  }
  for (let i = 0; i < 3; i++) {
    blob(rnd() * w, h * (0.25 + rnd() * 0.5), 16 + rnd() * 26, 9 + rnd() * 12, `hsl(${hue + 20} 55% 70%)`, 0.22);
  }
  ctx.globalAlpha = 1;

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
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
