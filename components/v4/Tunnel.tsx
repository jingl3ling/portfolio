"use client";

import { useEffect, useRef } from "react";

/**
 * One shared "time tunnel" canvas — a smoky nebula backdrop plus a star field
 * and warp streaks, both radiating outward from the same vanishing point —
 * reused for two spots on the page instead of two separate canvases/particle
 * systems:
 *  - full-bleed behind the STATEMENT section, staying visible all the way
 *    through to the About section (no dead gap in between)
 *  - clipped to the About cards' `.tunnel-window` cutouts, as if the same
 *    tunnel is visible through three windows
 *
 * The nebula rarely changes, so it's baked to a small offscreen canvas once
 * per resize (at a fraction of the viewport's resolution — the upscale blit
 * is what gives it that soft, smoky look for almost no cost) and just
 * blitted each frame; only the stars and streaks are redrawn live.
 */

// dusty, desaturated blob colors (rgb) — a wash of gas, not solid color
const NEBULA_BLOBS = [
  { dx: 0.3, dy: 0.36, r: 0.58, color: "176,132,146", a: 0.24 }, // dusty rose
  { dx: 0.72, dy: 0.26, r: 0.52, color: "126,108,150", a: 0.22 }, // smoky violet
  { dx: 0.54, dy: 0.7, r: 0.62, color: "96,106,138", a: 0.22 }, // slate blue
  { dx: 0.16, dy: 0.68, r: 0.46, color: "206,172,96", a: 0.26 }, // amber dust
  { dx: 0.86, dy: 0.62, r: 0.4, color: "224,196,110", a: 0.24 }, // pale gold
];
const NEBULA_SCALE = 0.28; // render the nebula this small, then upscale — cheap + softer

const STREAK_COLORS = ["#ffffff", "#dfe9ff", "#cfe0ff", "#f6cfe0", "#e0c9ff"];

// same dark tone as the About section's own background, so the wave that
// closes the tunnel blends straight into what it's revealing
const CLOSE_COLOR = "#06070b";

type Streak = {
  angle: number;
  r: number;
  len: number;
  speed: number;
  color: string;
  width: number;
  glow: boolean;
};
type Star = {
  angle: number;
  r: number;
  speed: number;
  size: number;
  glow: boolean;
  base: number;
  phase: number;
};

export default function Tunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const r0 = useRef<SVGRectElement>(null);
  const r1 = useRef<SVGRectElement>(null);
  const r2 = useRef<SVGRectElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rects = [r0, r1, r2];

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // a small pre-rendered radial-gradient sprite, reused (via drawImage) for
    // every glowing star/streak instead of an expensive per-shape shadowBlur
    const glow = document.createElement("canvas");
    glow.width = glow.height = 64;
    {
      const g = glow.getContext("2d")!;
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,0.95)");
      grad.addColorStop(0.35, "rgba(255,255,255,0.35)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
    }

    let w = 0, h = 0, cx = 0, cy = 0, maxR = 1;
    let bg: HTMLCanvasElement | null = null;
    // spring-driven position of the closing wave's baseline (px, screen
    // space) — a real mass-spring-damper, so the arc naturally overshoots
    // and settles in whichever direction the scroll is currently pushing it
    let waveY = 0;
    let waveVel = 0;

    // nebula only — no blur filter (that was the slow part); a small buffer
    // scaled up onto the main canvas reads as soft haze for near-zero cost
    const bake = () => {
      const bw = Math.max(1, Math.round(w * NEBULA_SCALE));
      const bh = Math.max(1, Math.round(h * NEBULA_SCALE));
      bg = document.createElement("canvas");
      bg.width = bw;
      bg.height = bh;
      const bctx = bg.getContext("2d")!;

      bctx.fillStyle = "#06070d";
      bctx.fillRect(0, 0, bw, bh);

      bctx.globalCompositeOperation = "lighter";
      for (const b of NEBULA_BLOBS) {
        const r = b.r * Math.max(bw, bh);
        const grad = bctx.createRadialGradient(bw * b.dx, bh * b.dy, 0, bw * b.dx, bh * b.dy, r);
        grad.addColorStop(0, `rgba(${b.color},${b.a})`);
        grad.addColorStop(0.6, `rgba(${b.color},${b.a * 0.35})`);
        grad.addColorStop(1, `rgba(${b.color},0)`);
        bctx.fillStyle = grad;
        bctx.fillRect(0, 0, bw, bh);
      }
      bctx.globalCompositeOperation = "source-over";

      // vignette keeps edges dark so foreground text stays readable
      const vg = bctx.createRadialGradient(bw / 2, bh / 2, Math.min(bw, bh) * 0.2, bw / 2, bh / 2, Math.hypot(bw, bh) / 2);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(4,4,8,0.85)");
      bctx.fillStyle = vg;
      bctx.fillRect(0, 0, bw, bh);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      cx = w / 2;
      cy = h / 2;
      maxR = Math.hypot(w, h) / 2 + 80;
      waveY = h; // snap the wave back to fully open on resize
      waveVel = 0;
      bake();
    };
    resize();
    window.addEventListener("resize", resize);

    // cursor position (viewport px) — used to locally bend streaks near it
    let mx = -9999, my = -9999;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = -9999; my = -9999; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    const DR = 150;
    const distort = (x: number, y: number): [number, number] => {
      const dx = x - mx, dy = y - my;
      const d = Math.hypot(dx, dy);
      if (d < DR && d > 0.0001) {
        const push = (1 - d / DR) * 34;
        return [x + (dx / d) * push, y + (dy / d) * push];
      }
      return [x, y];
    };

    // star field — same outward radial motion as the streaks (just slower
    // and dot-shaped), so everything drifts in one consistent direction
    // instead of stars wandering independently
    const makeStar = (atStart = false): Star => ({
      angle: Math.random() * Math.PI * 2,
      r: atStart ? Math.random() * maxR : 0,
      speed: 0.12 + Math.random() * 0.28,
      size: 0.6 + Math.random() * 1.6,
      glow: Math.random() < 0.14,
      base: 0.35 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    });
    const STAR_N = reduced ? 60 : 130;
    const stars = Array.from({ length: STAR_N }, () => makeStar(true));

    const make = (atStart = false): Streak => ({
      angle: Math.random() * Math.PI * 2,
      r: atStart ? Math.random() * maxR : 0,
      len: 40 + Math.random() * 130,
      speed: 0.35 + Math.random() * 0.95,
      color: STREAK_COLORS[(Math.random() * STREAK_COLORS.length) | 0],
      width: 0.6 + Math.random() * 1.6,
      glow: Math.random() < 0.18,
    });
    const STREAK_N = reduced ? 35 : 80;
    const streaks = Array.from({ length: STREAK_N }, () => make(true));

    // the 3 windows are static (rendered once by AboutTunnel) — look them up
    // once instead of re-querying the DOM on every animation frame
    const els = Array.from(document.querySelectorAll<HTMLElement>(".tunnel-window")).slice(0, 3);
    const setRect = (i: number, x: number, y: number, rw: number, rh: number) => {
      const rect = rects[i].current;
      if (!rect) return;
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(y));
      rect.setAttribute("width", String(rw));
      rect.setAttribute("height", String(rh));
    };

    const statementEl = document.getElementById("statement");
    const aboutEl = document.getElementById("about");

    // the closing wave (see drawClosingWave below) plays out while About's
    // top edge crosses from CLOSE_START down to CLOSE_END — "full" mode owns
    // that whole span so the wave has room to bounce before "windows" mode
    // takes over the hand-off to the About cards
    // CLOSE_END is deliberately still positive: the handoff to "windows" mode
    // (where the canvas can only paint inside the About cards, never over
    // real content) happens just before the About section's top edge reaches
    // the viewport — well before its "I'm Jing" intro text scrolls into view
    // — so that text is never at risk of getting covered by the wave
    const CLOSE_START = 0.4; // ×vh below the viewport bottom: wave starts
    const CLOSE_END = 0.1; // ×vh still below the viewport top: wave has landed

    // where we are, purely from current layout — no "did we already leave"
    // bookkeeping needed, so it stays correct scrolling in either direction
    const computePhase = (): "hidden" | "full" | "windows" => {
      if (!statementEl || !aboutEl) return "hidden";
      const vh = window.innerHeight;
      const a = aboutEl.getBoundingClientRect();
      if (a.bottom <= 0) return "hidden"; // scrolled past the About section
      if (a.top <= vh * CLOSE_END) return "windows";
      const s = statementEl.getBoundingClientRect();
      if (s.top < vh) return "full"; // statement through the closing wave
      return "hidden"; // still in the hero, haven't reached the statement yet
    };

    // one big arc — peaks at center, tapers to the baseline at both edges —
    // instead of a repeating ripple; its height grows with how fast the
    // spring is currently moving, so it's a flat edge at rest and bulges
    // into a single wave right as it's bouncing
    const drawClosingWave = () => {
      const amp = Math.min(50, Math.abs(waveVel) * 2.4);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = CLOSE_COLOR;
      ctx.beginPath();
      ctx.moveTo(0, h + 2);
      ctx.lineTo(0, waveY);
      for (let x = 0; x <= w; x += 16) {
        const y = waveY - Math.sin((x / w) * Math.PI) * amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h + 2);
      ctx.closePath();
      ctx.fill();
    };

    let raf = 0;
    let t = 0;
    const frame = () => {
      const phase = computePhase();
      if (phase === "hidden") {
        canvas.style.opacity = "0";
        raf = 0;
        return; // stop scheduling frames until the next scroll/resize wakes us
      }

      if (phase === "windows") {
        els.forEach((el, i) => {
          const b = el.getBoundingClientRect();
          setRect(i, b.left, b.top, b.width, b.height);
        });
        canvas.style.opacity = "1";
        waveY = 0;
        waveVel = 0;
      } else {
        // one full-viewport rect = an effectively unclipped canvas
        setRect(0, 0, 0, w, h);
        setRect(1, 0, 0, 0, 0);
        setRect(2, 0, 0, 0, 0);
        const vh = window.innerHeight;
        const sTop = statementEl!.getBoundingClientRect().top;
        const fadeIn = Math.max(0, Math.min(1, (vh - sTop) / (vh * 0.45)));
        canvas.style.opacity = String(fadeIn);

        // once About starts closing in, spring the wave's baseline toward
        // where it should be — the spring's own overshoot is the bounce, and
        // since it's chasing a target that moves with the scroll, reversing
        // scroll direction naturally reverses which way it bounces
        const aTop = aboutEl!.getBoundingClientRect().top;
        const raw = Math.max(0, Math.min(1, (vh * CLOSE_START - aTop) / (vh * (CLOSE_START - CLOSE_END))));
        const targetY = h * (1 - raw);
        waveVel += (targetY - waveY) * 0.16;
        waveVel *= 0.8;
        waveY += waveVel;
      }

      t += reduced ? 0.006 : 0.016;
      ctx.clearRect(0, 0, w, h);
      if (bg) ctx.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      const step = reduced ? 0.3 : 1;

      // twinkling stars, radiating outward — same direction as the streaks
      for (const s of stars) {
        s.r += s.speed * step;
        if (s.r > maxR) Object.assign(s, makeStar(false));
        const [x, y] = distort(cx + Math.cos(s.angle) * s.r, cy + Math.sin(s.angle) * s.r);
        const alpha = s.base + Math.sin(t * 1.6 + s.phase) * 0.25;
        if (s.glow) {
          ctx.globalAlpha = Math.max(0, alpha) * 0.8;
          ctx.drawImage(glow, x - s.size * 6, y - s.size * 6, s.size * 12, s.size * 12);
        }
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // radiating warp streaks
      for (const s of streaks) {
        s.r += s.speed * step;
        if (s.r > maxR) Object.assign(s, make(false));
        const ca = Math.cos(s.angle);
        const sa = Math.sin(s.angle);
        const grow = s.r / maxR;
        const len = s.len * (0.4 + grow * 1.8);
        const [x1, y1] = distort(cx + ca * s.r, cy + sa * s.r);
        const [x2, y2] = distort(cx + ca * (s.r + len), cy + sa * (s.r + len));
        const alpha = Math.sin(grow * Math.PI) * 0.5;
        const width = s.width * (0.5 + grow * 2.4);

        if (s.glow) {
          const gx = (x1 + x2) / 2, gy = (y1 + y2) / 2;
          const gs = width * 10;
          ctx.globalAlpha = alpha * 0.7;
          ctx.drawImage(glow, gx - gs / 2, gy - gs / 2, gs, gs);
        }

        ctx.strokeStyle = s.color;
        ctx.globalAlpha = alpha * 0.55;
        ctx.lineWidth = width * 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width * 0.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      // only in "full" mode — in "windows" mode the clip-path already does
      // the hiding, and painting over it here would blank out the windows
      if (phase === "full" && (waveY < h - 0.5 || Math.abs(waveVel) > 0.05)) drawClosingWave();
      raf = requestAnimationFrame(frame);
    };

    // scroll is just the wake-up trigger — the frame loop above decides the
    // exact phase from real layout every frame and stops itself when hidden,
    // so there's no dead gap between the statement and the About section.
    // (a plain scroll listener wakes it reliably; kick() is a no-op while
    // the loop is already running, so this costs nothing extra per scroll)
    const kick = () => { if (!raf) frame(); };
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    kick(); // in case the page loads already scrolled mid-tunnel

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <>
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <clipPath id="tunnelClip" clipPathUnits="userSpaceOnUse">
            <rect ref={r0} rx="16" />
            <rect ref={r1} rx="16" />
            <rect ref={r2} rx="16" />
          </clipPath>
        </defs>
      </svg>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0"
        style={{
          opacity: 0,
          zIndex: 5,
          clipPath: "url(#tunnelClip)",
          WebkitClipPath: "url(#tunnelClip)",
        }}
      />
    </>
  );
}
