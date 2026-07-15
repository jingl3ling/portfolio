"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// one word repeated around the ring (like the reference)
const CHARS = Array.from("Web Dev · AI · Art · Ventures · Engineer ·");
const RADIUS = 240;

export default function CircularTitle() {
  const reduced = useReducedMotion();
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const on = () => setVh(window.innerHeight);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, vh * 0.8], [1, 1.5]);
  const opacity = useTransform(scrollY, [0, vh * 0.7], [1, 0]);
  // extra spin on scroll — lives on a SEPARATE element from the CSS base spin
  const scrollSpin = useTransform(scrollY, [0, vh], [0, 90]);

  return (
    <>
      <h1 className="sr-only">Jing Huang — build everywhere</h1>
      <motion.div
        style={reduced ? undefined : { scale, opacity }}
        className="flex w-full items-center justify-center"
      >
        {/* shrink the whole ring on small screens */}
        <div className="w-full origin-center scale-[0.55] sm:scale-75 md:scale-100">
        {/* perspective = how strongly the front looms vs the back */}
        <div style={{ perspective: "700px" }} className="grid h-[340px] w-full place-items-center">
          {/* tilt (bottom view) + optional scroll spin */}
          <motion.div
            className="relative"
            style={{
              transformStyle: "preserve-3d",
              rotateX: -22,
              rotateY: reduced ? 0 : scrollSpin,
            }}
          >
            {/* continuous base spin (CSS, its own element → no conflict) */}
            <div
              className={`relative ${reduced ? "" : "cyl-spin"}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {CHARS.map((c, i) => (
                <span
                  key={i}
                  className="cyl-char"
                  style={{
                    transform: `translate(-50%, -50%) rotateY(${
                      i * (360 / CHARS.length)
                    }deg) translateZ(${RADIUS}px)`,
                  }}
                >
                  {c === " " ? " " : c}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
        </div>
      </motion.div>
    </>
  );
}
