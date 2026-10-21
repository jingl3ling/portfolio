"use client";

import { useEffect } from "react";

/**
 * Always open a case study at the top — Lenis persists across client
 * navigations and keeps its previous scroll target, so force it there.
 */
export default function ScrollTopOnMount() {
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } }).lenis;
    const toTop = () => {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    };
    toTop();
    requestAnimationFrame(toTop);
  }, []);

  return null;
}
