"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { projects } from "@/lib/projects";

const ScrollScene = dynamic(() => import("@/components/v2/ScrollScene"), {
  ssr: false,
});

/* moves children as they pass through the viewport → parallax */
function Parallax({
  children,
  amount = 80,
  className,
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <motion.div ref={ref} style={reduced ? undefined : { y }} className={className}>
      {children}
    </motion.div>
  );
}

export default function V2() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <>
      {!reduced && <ScrollScene />}

      {/* ---------- HERO ---------- */}
      <section
        ref={heroRef}
        id="top"
        className="relative flex min-h-[100svh] items-center"
      >
        <motion.div
          style={reduced ? undefined : { y: heroY, opacity: heroOpacity }}
          className="wrap"
        >
          <p className="mono-label mb-6">Jing Huang — parallax edition</p>
          <h1 className="display max-w-[15ch] text-[clamp(2.6rem,9vw,8rem)]">
            I build where AI, art, and people meet{" "}
            <span className="text-accent">real problems.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted">
            Web developer · AI M.S. @ NJIT · Computer Engineering B.S. Scroll to
            move through the work.
          </p>
          <div className="mono-label mt-14">scroll ↓</div>
        </motion.div>
      </section>

      {/* ---------- ABOUT (sticky label + parallax body) ---------- */}
      <section
        id="about"
        className="wrap grid gap-10 py-32 md:grid-cols-[1fr_2fr] md:gap-16 md:py-48"
      >
        <div>
          <h2 className="display sticky top-28 text-4xl md:text-5xl">About</h2>
        </div>
        <div className="space-y-10">
          <Parallax amount={40}>
            <p className="display max-w-[22ch] text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.14]">
              An engineer who ships across the stack, and a founder who takes
              ideas from research to live product.
            </p>
          </Parallax>
          <Parallax amount={20}>
            <p className="max-w-xl text-lg leading-loose text-muted">
              Currently an M.S. in Artificial Intelligence at NJIT, after a B.S.
              in Computer Engineering at UIUC. My work spans biosensing
              wearables, embedded/IoT, full-stack web, and AI — and I&apos;ve led
              small teams to build and pitch ventures.
            </p>
          </Parallax>
          <Parallax amount={10}>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
              {[
                ["9+", "projects"],
                ["2", "degrees"],
                ["4", "ventures"],
                ["3rd", "hackathon"],
              ].map(([n, l]) => (
                <div key={l} className="bg-bg/80 p-5 backdrop-blur">
                  <div className="font-display text-3xl">{n}</div>
                  <div className="mono-label mt-1">{l}</div>
                </div>
              ))}
            </div>
          </Parallax>
        </div>
      </section>

      {/* ---------- WORK (sticky heading + parallax rows) ---------- */}
      <section id="work" className="wrap py-32 md:py-48">
        <h2 className="display mb-16 text-[clamp(2.2rem,7vw,5rem)]">
          Selected Work
        </h2>
        <div className="flex flex-col gap-10 md:gap-16">
          {projects.map((p, i) => (
            <Parallax key={p.slug} amount={i % 2 === 0 ? 60 : 24}>
              <Link
                href={`/work/${p.slug}`}
                data-cursor
                className="group flex flex-col gap-5 rounded-2xl border border-line bg-bg/70 p-6 backdrop-blur-md transition-colors hover:border-ink md:flex-row md:items-center md:gap-8 md:p-8"
              >
                <div className="w-full shrink-0 md:w-56">
                  <div
                    className="flex aspect-[16/10] items-center justify-center rounded-xl border border-line bg-cover bg-center"
                    style={
                      p.thumbnail
                        ? { backgroundImage: `url(${p.thumbnail})` }
                        : {
                            backgroundColor:
                              "color-mix(in srgb, var(--accent) 8%, white)",
                          }
                    }
                  >
                    {!p.thumbnail && <span className="mono-label">Image</span>}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mono-label mb-2">
                    {p.track === "technical" ? "Technical" : "Venture"} · {p.year}
                  </div>
                  <h3 className="font-display text-3xl transition-colors group-hover:text-accent md:text-4xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-muted">{p.tagline}</p>
                </div>
                <div className="mono-label md:self-start">→</div>
              </Link>
            </Parallax>
          ))}
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section id="contact" className="wrap py-32 text-center md:py-48">
        <Parallax amount={40}>
          <h2 className="display text-[clamp(2.4rem,8vw,6rem)]">
            Let&apos;s build something.
          </h2>
        </Parallax>
        <a
          href="mailto:jinghuang809@gmail.com"
          className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 text-bg transition-transform hover:-translate-y-0.5"
        >
          jinghuang809@gmail.com
        </a>
        <div className="mono-label mt-16">
          <Link href="/" className="transition-colors hover:text-accent">
            ← back to the main site
          </Link>
        </div>
      </section>
    </>
  );
}
