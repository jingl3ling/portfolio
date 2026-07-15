"use client";

import { useEffect, useRef } from "react";

/**
 * ONE fixed, full-viewport time-tunnel, clipped to the on-screen rectangles of
 * every `.tunnel-window` element. Each card therefore shows a different part of
 * the same underlying tunnel — real windows into one background.
 */
export default function TunnelWindows() {
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

    let w = 0, h = 0, cx = 0, cy = 0, maxR = 1;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      maxR = Math.hypot(w, h) / 2 + 80;
    };
    resize();
    window.addEventListener("resize", resize);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const COLORS = ["#f6cfe0", "#e7a6c4", "#d9b48f", "#c79a76", "#a9b6e0", "#ffffff"];
    type S = { angle: number; r: number; len: number; speed: number; color: string; width: number };
    const mk = (start = false): S => ({
      angle: Math.random() * Math.PI * 2,
      r: start ? Math.random() * maxR : 0,
      len: 40 + Math.random() * 130,
      speed: 0.3 + Math.random() * 0.8, // slow
      color: COLORS[(Math.random() * COLORS.length) | 0],
      width: 0.6 + Math.random() * 1.6,
    });
    const N = reduced ? 80 : 180;
    const streaks = Array.from({ length: N }, () => mk(true));

    const syncClip = () => {
      const els = document.querySelectorAll<HTMLElement>(".tunnel-window");
      let visible = false;
      rects.forEach((ref, i) => {
        const rect = ref.current;
        if (!rect) return;
        const el = els[i];
        if (el) {
          const b = el.getBoundingClientRect();
          if (b.bottom > 0 && b.top < window.innerHeight) visible = true;
          rect.setAttribute("x", String(b.left));
          rect.setAttribute("y", String(b.top));
          rect.setAttribute("width", String(b.width));
          rect.setAttribute("height", String(b.height));
        } else {
          rect.setAttribute("width", "0");
          rect.setAttribute("height", "0");
        }
      });
      return visible;
    };

    let raf = 0;
    const frame = () => {
      // pause the whole tunnel when none of the card windows are on screen
      if (!syncClip()) {
        raf = requestAnimationFrame(frame);
        return;
      }
      ctx.clearRect(0, 0, w, h);

      // color wash (vanishing point = viewport center)
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      g.addColorStop(0, "rgba(232,150,190,0.55)");
      g.addColorStop(0.4, "rgba(150,95,80,0.45)");
      g.addColorStop(0.72, "rgba(40,55,95,0.72)");
      g.addColorStop(1, "rgba(10,10,20,0.96)");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // radial streaks
      ctx.globalCompositeOperation = "lighter";
      const step = reduced ? 0.3 : 1;
      for (const s of streaks) {
        s.r += s.speed * step;
        if (s.r > maxR) Object.assign(s, mk(false));
        const ca = Math.cos(s.angle);
        const sa = Math.sin(s.angle);
        const grow = s.r / maxR;
        const len = s.len * (0.4 + grow * 1.8);
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = Math.sin(grow * Math.PI) * 0.5;
        ctx.lineWidth = s.width * (0.5 + grow * 2.4);
        ctx.beginPath();
        ctx.moveTo(cx + ca * s.r, cy + sa * s.r);
        ctx.lineTo(cx + ca * (s.r + len), cy + sa * (s.r + len));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
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
        style={{ zIndex: 5, clipPath: "url(#tunnelClip)", WebkitClipPath: "url(#tunnelClip)" }}
      />
    </>
  );
}
