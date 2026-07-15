"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ImmersiveTheme from "@/components/ImmersiveTheme";
import CircularTitle from "@/components/v4/CircularTitle";
import LineTunnel from "@/components/v4/LineTunnel";
import TunnelWindows from "@/components/v4/TunnelWindows";
import GalaxyBackground from "@/components/v4/GalaxyBackground";
import AboutTunnel from "@/components/v4/AboutTunnel";
import Experiments from "@/components/sections/Experiments";
import ContactAether from "@/components/v4/ContactAether";
import WorkIndex from "@/components/WorkIndex";
import Reveal from "@/components/Reveal";

const SpaceField = dynamic(() => import("@/components/v4/SpaceField"), {
  ssr: false,
});

const CAPS = [
  { t: "Biosensing & Hardware", d: "ESP32, LEDs, IMUs, ECG — turning human signals into something you can see and feel." },
  { t: "Full-stack Web", d: "Production React/TypeScript and Node/PHP, from a university platform at scale to shipped betas." },
  { t: "AI", d: "LLM integration and agents in real workflows — code review, natural-language UX, biometrics." },
  { t: "Ventures", d: "Zero-to-one: research, UX, leading small teams, and pitching investors." },
];

export default function V4() {
  const [vh, setVh] = useState(800);
  useEffect(() => {
    const on = () => setVh(window.innerHeight);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // hero starfield fades out as the statement's tunnel fades in
  const { scrollY } = useScroll();
  const starsOpacity = useTransform(scrollY, [0, vh * 0.3, vh * 0.75], [1, 1, 0.1]);

  return (
    <>
      <ImmersiveTheme accent="#8ec5ff" bg="#05060a" />

      {/* HERO background: starfield (+ cool nebula), fades out on scroll */}
      <motion.div
        aria-hidden
        style={{ opacity: starsOpacity }}
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <SpaceField />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 12%, rgba(120,160,255,0.16), transparent 70%), radial-gradient(50% 45% at 15% 62%, rgba(170,120,255,0.14), transparent 70%)",
          }}
        />
      </motion.div>

      {/* STATEMENT background: dreamy colored time-tunnel, fades in on scroll */}
      <LineTunnel />

      {/* one background tunnel, revealed only through the About cards' windows */}
      <TunnelWindows />

      {/* ---------- HERO: rotating cylinder title ---------- */}
      <section
        id="top"
        className="relative flex min-h-[100svh] flex-col items-center justify-center text-center"
      >
        <CircularTitle />
        <div className="pointer-events-none absolute inset-x-0 bottom-14 flex flex-col items-center gap-3">
          <p className="max-w-md px-6 text-muted">
            Web developer · AI M.S. @ NJIT · Computer Engineering B.S.
          </p>
          <span className="mono-label">scroll to warp ↓</span>
        </div>
      </section>

      {/* ---------- STATEMENT + see-through windows (tunnel shows through) ---------- */}
      <section className="relative flex min-h-[100svh] items-center py-24">
        <div className="wrap">
          <Reveal>
            <h2 className="display max-w-[15ch] text-[clamp(2.2rem,7vw,5.5rem)] [text-shadow:0_2px_30px_rgba(0,0,0,0.65)]">
              I build <span className="text-accent">everywhere</span> — where AI,
              art, and people meet real problems.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CAPS.map((c, i) => (
              <Reveal key={c.t} delay={i * 0.06}>
                <div className="glass-window h-full rounded-2xl p-6">
                  <h3 className="font-display text-xl">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mono-label mt-8">
            ↑ the boxes are windows — the tunnel flies through them
          </p>
        </div>
      </section>

      {/* ---------- dark content; the tunnel only lives inside the About cards ---------- */}
      <div className="relative bg-[#06070b]">
        <AboutTunnel />
        <section id="work">
          {/* tall title band with a 3D Spline background */}
          <div className="relative flex min-h-[70vh] items-end overflow-hidden">
            <GalaxyBackground />
            <div className="wrap relative z-10 pb-12">
              <Reveal>
                <h2 className="display text-[clamp(3rem,10vw,7rem)]">Selected Work</h2>
              </Reveal>
            </div>
          </div>
          {/* toggle + work list stay on black */}
          <div className="wrap py-16 md:py-24">
            <WorkIndex basePath="/v4/work" />
          </div>
        </section>
        <Experiments />
        <ContactAether />
      </div>
    </>
  );
}
