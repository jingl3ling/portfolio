"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";

const SignalCanvas = dynamic(() => import("@/components/SignalCanvas"), {
  ssr: false,
});

const WORDS: { t: string; accent?: boolean }[] = [
  { t: "I" },
  { t: "build" },
  { t: "where" },
  { t: "AI," },
  { t: "art," },
  { t: "and" },
  { t: "people" },
  { t: "meet" },
  { t: "real", accent: true },
  { t: "problems.", accent: true },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.15 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};
const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero({ tint }: { tint?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {!reduced && (
        <motion.div
          style={{ y: yBg }}
          className="pointer-events-none absolute inset-0 opacity-90"
        >
          <SignalCanvas tint={tint} />
        </motion.div>
      )}

      <motion.div
        style={reduced ? undefined : { y: yText, opacity: contentOpacity }}
        className="wrap relative z-10 pt-24"
      >
        <motion.p
          className="mono-label mb-6"
          variants={fade}
          custom={0}
          initial={reduced ? false : "hidden"}
          animate="show"
        >
          Engineer &amp; Founder
        </motion.p>

        {reduced ? (
          <h1 className="display max-w-[16ch] text-[clamp(2.4rem,8vw,7rem)]">
            I build where AI, art, and people meet{" "}
            <span className="text-accent">real problems.</span>
          </h1>
        ) : (
          <motion.h1
            className="display max-w-[16ch] text-[clamp(2.4rem,8vw,7rem)]"
            variants={container}
            initial="hidden"
            animate="show"
            aria-label="I build where AI, art, and people meet real problems."
          >
            {WORDS.map((w, i) => (
              <motion.span
                key={i}
                variants={word}
                className={`inline-block ${w.accent ? "text-accent" : ""}`}
                style={{ marginRight: "0.22em" }}
                aria-hidden
              >
                {w.t}
              </motion.span>
            ))}
          </motion.h1>
        )}

        <motion.p
          className="mt-8 max-w-xl text-lg text-muted"
          variants={fade}
          custom={0.85}
          initial={reduced ? false : "hidden"}
          animate="show"
        >
          Web developer · AI M.S. @ NJIT · Computer Engineering B.S. Biosensing
          hardware, full-stack web, and ventures.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          variants={fade}
          custom={0.98}
          initial={reduced ? false : "hidden"}
          animate="show"
        >
          <a
            href="#work"
            className="rounded-full bg-ink px-6 py-3 text-sm text-bg transition-transform hover:-translate-y-0.5"
          >
            See the work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-line px-6 py-3 text-sm transition-colors hover:border-ink"
          >
            Get in touch
          </a>
        </motion.div>
      </motion.div>

      {!reduced && (
        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
        >
          <span className="mono-label">scroll ↓</span>
        </motion.div>
      )}
    </section>
  );
}
