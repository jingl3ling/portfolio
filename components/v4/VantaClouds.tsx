"use client";

import { useEffect, useRef } from "react";
// CLOUDS2 was built against three r134's API — the app's own `three` is far
// newer (needed by @react-three/fiber elsewhere) and not compatible, so this
// pulls in a second, isolated copy pinned to the version Vanta expects
// instead of risking breaking every other three.js background on the site.
import * as THREE from "three-r134";

interface VantaEffect {
  destroy: () => void;
}

// same dark tone as the About section's own background, so the wave that
// closes the clouds blends straight into what it's revealing
const CLOSE_COLOR = "#06070b";

// CLOUDS2 wants a tileable grayscale noise texture (`texturePath`) but ships
// with no default asset — generate one on the fly instead of hosting a file.
function noiseTextureDataURL(size = 256): string {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = (Math.random() * 256) | 0;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL("image/png");
}

export default function VantaClouds() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);
  const r0 = useRef<SVGRectElement>(null);
  const r1 = useRef<SVGRectElement>(null);
  const r2 = useRef<SVGRectElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const host = hostRef.current;
    const waveCanvas = waveCanvasRef.current;
    if (!wrap || !host || !waveCanvas) return;
    const waveCtx = waveCanvas.getContext("2d");
    if (!waveCtx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let effect: VantaEffect | null = null;
    let pending = false; // an import()+CLOUDS2() call is in flight
    let wantActive = false; // the phase we're trying to reach right now
    let destroyed = false;
    let texture: string | null = null;

    // CLOUDS2 raymarches every pixel every frame (100 steps) — that's the
    // main cost, and it was compounding several ways: starting immediately
    // on page load regardless of scroll position, rendering at the full
    // device pixel ratio (2-3x on Retina, i.e. 4-9x the pixels), and — the
    // one that caused lag to build up over a session — a race where scrolling
    // fast enough to leave the "on" phase before the (real, network-latency)
    // import resolved left `wantActive` false but the .then() callback used
    // to create the effect anyway, since it never re-checked. That zombie
    // instance runs its own internal rAF loop forever, permanently
    // raymarching in the background with nothing left to ever stop it.
    // `wantActive` is re-checked right before the effect is created so a
    // superseded start() becomes a no-op instead of a leak.
    const start = () => {
      wantActive = true;
      if (effect || pending) return;
      pending = true;
      import("vanta/dist/vanta.clouds2.min").then((mod) => {
        pending = false;
        if (destroyed || !wantActive) return;
        const CLOUDS2 = ((mod as { default?: unknown }).default ?? mod) as (
          opts: Record<string, unknown>
        ) => VantaEffect;
        texture ??= noiseTextureDataURL();
        effect = CLOUDS2({
          el: host,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
          scale: Math.max(1, window.devicePixelRatio || 1),
          texturePath: texture,
          // CLOUDS2's defaults are a bright daytime sky — darkened and
          // tinted toward the site's own navy/blue palette so it reads as
          // night cloud instead of clashing, and so it never gets bright
          // enough to wash out the About cards' text through the windows
          backgroundColor: 0x05060a,
          skyColor: 0x0c1830,
          cloudColor: 0x2c3a5e,
          lightColor: 0x9fc3ff,
        });
      });
    };
    const stop = () => {
      wantActive = false;
      effect?.destroy();
      effect = null;
    };

    // clipped to the About cards' `.cloud-window` cutouts once you reach
    // them, exactly like the old tunnel used to peek through the same cards
    const rects = [r0, r1, r2];
    const setRect = (i: number, x: number, y: number, w: number, h: number) => {
      const el = rects[i].current;
      if (!el) return;
      el.setAttribute("x", String(x));
      el.setAttribute("y", String(y));
      el.setAttribute("width", String(w));
      el.setAttribute("height", String(h));
    };
    const els = Array.from(document.querySelectorAll<HTMLElement>(".cloud-window")).slice(0, 3);
    const statementEl = document.getElementById("statement");
    const aboutEl = document.getElementById("about");

    // the bouncy wave (see drawClosingWave below) plays out while About's
    // top edge crosses from CLOSE_START down to CLOSE_END, entirely inside
    // "full" phase — same span the tunnel used to use for this transition
    const CLOSE_START = 0.4;
    const CLOSE_END = 0.1;

    // spring-driven position of the closing wave's baseline (px, screen
    // space) — a real mass-spring-damper, so the arc naturally overshoots
    // and settles in whichever direction the scroll is currently pushing it
    let waveY = 0;
    let waveVel = 0;
    let ww = 0, wh = 0;

    const resizeWave = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ww = window.innerWidth;
      wh = window.innerHeight;
      waveCanvas.width = ww * dpr;
      waveCanvas.height = wh * dpr;
      waveCanvas.style.width = ww + "px";
      waveCanvas.style.height = wh + "px";
      waveCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      waveY = wh; // snap back to fully open on resize
      waveVel = 0;
    };
    resizeWave();
    window.addEventListener("resize", resizeWave);

    // one big arc — peaks at center, tapers to the baseline at both edges —
    // its height grows with how fast the spring is currently moving, so
    // it's a flat edge at rest and bulges into a wave right as it bounces
    const drawClosingWave = () => {
      const amp = Math.min(50, Math.abs(waveVel) * 2.4);
      waveCtx.clearRect(0, 0, ww, wh);
      waveCtx.fillStyle = CLOSE_COLOR;
      waveCtx.beginPath();
      waveCtx.moveTo(0, wh + 2);
      waveCtx.lineTo(0, waveY);
      for (let x = 0; x <= ww; x += 16) {
        const y = waveY - Math.sin((x / ww) * Math.PI) * amp;
        waveCtx.lineTo(x, y);
      }
      waveCtx.lineTo(ww, wh + 2);
      waveCtx.closePath();
      waveCtx.fill();
    };

    const computePhase = (): "before" | "full" | "windows" | "past" => {
      if (!statementEl || !aboutEl) return "before";
      const vh = window.innerHeight;
      const a = aboutEl.getBoundingClientRect();
      if (a.bottom <= 0) return "past"; // scrolled well below — stop rendering entirely
      if (a.top <= vh * CLOSE_END) return "windows";
      const s = statementEl.getBoundingClientRect();
      if (s.top < vh * 0.6) return "full"; // only once the heading is well into view, not the moment it appears
      return "before";
    };

    let raf = 0;
    const frame = () => {
      const phase = computePhase();
      if (phase === "before" || phase === "past") {
        wrap.style.opacity = "0";
        waveCtx.clearRect(0, 0, ww, wh);
        // not just "past": scrolling back up from "full" lands on "before"
        // directly (never passing through "past"), and that path used to
        // leave the effect running — invisible, but still rendering
        stop();
        raf = 0;
        return;
      }
      start();
      if (phase === "windows") {
        els.forEach((el, i) => {
          const b = el.getBoundingClientRect();
          setRect(i, b.left, b.top, b.width, b.height);
        });
        wrap.style.opacity = "1";
        waveCtx.clearRect(0, 0, ww, wh); // the clip-path windows take over from here
      } else {
        const w = window.innerWidth, h = window.innerHeight;
        setRect(0, 0, 0, w, h);
        setRect(1, 0, 0, 0, 0);
        setRect(2, 0, 0, 0, 0);
        const vh = window.innerHeight;
        const sTop = statementEl!.getBoundingClientRect().top;
        const fadeIn = Math.max(0, Math.min(1, (vh * 0.6 - sTop) / (vh * 0.4)));
        wrap.style.opacity = String(fadeIn);

        // spring the wave's baseline toward where it should be — the
        // spring's own overshoot is the bounce, and since it's chasing a
        // target that moves with scroll, reversing direction naturally
        // reverses which way it bounces
        const aTop = aboutEl!.getBoundingClientRect().top;
        const raw = Math.max(0, Math.min(1, (vh * CLOSE_START - aTop) / (vh * (CLOSE_START - CLOSE_END))));
        const targetY = wh * (1 - raw);
        waveVel += (targetY - waveY) * 0.16;
        waveVel *= 0.8;
        waveY += waveVel;
        drawClosingWave();
      }
      raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) frame(); };
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    kick();

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      window.removeEventListener("resize", resizeWave);
      stop();
    };
  }, []);

  return (
    <>
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <clipPath id="cloudClip" clipPathUnits="userSpaceOnUse">
            <rect ref={r0} rx="16" />
            <rect ref={r1} rx="16" />
            <rect ref={r2} rx="16" />
          </clipPath>
        </defs>
      </svg>
      <div
        ref={wrapRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 h-full w-full"
        style={{ opacity: 0, zIndex: 5, clipPath: "url(#cloudClip)", WebkitClipPath: "url(#cloudClip)" }}
      >
        <div ref={hostRef} className="h-full w-full" />
      </div>
      <canvas
        ref={waveCanvasRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0"
        style={{ zIndex: 5 }}
      />
    </>
  );
}
