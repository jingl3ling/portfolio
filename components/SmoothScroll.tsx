"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // take scroll position on reload/back-forward into our own hands — pages
    // decide where they land (top, or a specific section) instead of the
    // browser silently restoring wherever you happened to be scrolled to
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    // expose so route changes can force scroll position (Lenis persists across
    // client navigations and would otherwise keep the previous scroll target)
    (window as unknown as { lenis?: Lenis }).lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      delete (window as unknown as { lenis?: Lenis }).lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
