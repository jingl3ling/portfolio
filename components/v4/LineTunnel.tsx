"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

// soft light tints (additive) — read as glowing rays over the color wash
const COLORS = ["#f6cfe0", "#e7a6c4", "#d9b48f", "#c79a76", "#a9b6e0", "#ffffff"];

const WASH =
  "radial-gradient(130% 100% at 50% 42%, rgba(232,150,190,0.60) 0%, rgba(150,95,80,0.50) 35%, rgba(40,55,95,0.78) 68%, rgba(10,10,20,0.96) 100%)";

export default function LineTunnel() {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const on = () => setVh(window.innerHeight);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // fade in (no blur — keep the tunnel crisp)
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, vh * 0.2, vh * 0.7], [0, 0, 1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, cx = 0, cy = 0, maxR = 1;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      maxR = Math.hypot(w, h) / 2 + 80;
    };
    resize();
    window.addEventListener("resize", resize);

    type Streak = { angle: number; r: number; len: number; speed: number; color: string; width: number };
    const make = (atStart = false): Streak => ({
      angle: Math.random() * Math.PI * 2,
      r: atStart ? Math.random() * maxR : 0,
      len: 40 + Math.random() * 130,
      speed: 0.35 + Math.random() * 0.95, // slow
      color: COLORS[(Math.random() * COLORS.length) | 0],
      width: 0.6 + Math.random() * 1.6,
    });

    const N = reduced ? 60 : 150;
    const streaks = Array.from({ length: N }, () => make(true));

    let raf = 0;
    const frame = () => {
      // only animate while the statement tunnel is actually on screen
      const sc = window.scrollY / (window.innerHeight || 1);
      if (sc < 0.15 || sc > 2.4) {
        raf = requestAnimationFrame(frame);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const step = reduced ? 0.3 : 1;

      for (const s of streaks) {
        s.r += s.speed * step;
        if (s.r > maxR) Object.assign(s, make(false));
        const ca = Math.cos(s.angle);
        const sa = Math.sin(s.angle);
        const grow = s.r / maxR;
        const len = s.len * (0.4 + grow * 1.8);
        const x1 = cx + ca * s.r;
        const y1 = cy + sa * s.r;
        const x2 = cx + ca * (s.r + len);
        const y2 = cy + sa * (s.r + len);
        const alpha = Math.sin(grow * Math.PI) * 0.5;
        const width = s.width * (0.5 + grow * 2.4);

        // soft glow: a wide, low-alpha colored line (additive) — cheap, no shadowBlur
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = alpha * 0.5;
        ctx.lineWidth = width * 2.2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // crisp white core on top
        ctx.strokeStyle = "#ffffff";
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width * 0.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
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
  }, [reduced]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ opacity }}
    >
      <div className="absolute inset-0" style={{ background: WASH }} />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </motion.div>
  );
}
