"use client";

import { useLayoutEffect } from "react";

/**
 * Overrides the global CSS tokens for the current route (dark, light text by
 * default), so every shared component — nav, sections, cursor — recolors
 * automatically. Pass `light` for a light page (dark ink on a pale `bg`).
 * Restores the previous values on unmount.
 */
export default function ImmersiveTheme({
  accent = "#8ec5ff",
  bg = "#0b0b12",
  light = false,
}: {
  accent?: string;
  bg?: string;
  light?: boolean;
}) {
  // layout effect, not useEffect: apply the dark tokens before the first paint
  // rather than a frame later, shrinking the window where the page is the
  // CSS-default white
  useLayoutEffect(() => {
    const el = document.documentElement;
    const vars: Record<string, string> = {
      "--bg": bg,
      "--ink": light ? "#14110f" : "#f4f4f5",
      "--muted": light ? "#6a625a" : "#a1a1aa",
      "--faint": light ? "#8f867c" : "#71717a",
      "--line": light ? "rgba(20,17,15,0.16)" : "rgba(255,255,255,0.14)",
      "--accent": accent,
      "--accent-ink": accent,
    };
    const prev: Record<string, string> = {};
    Object.entries(vars).forEach(([k, v]) => {
      prev[k] = el.style.getPropertyValue(k);
      el.style.setProperty(k, v);
    });
    // "immersive" is the dark-route class (screen-blended cursor, no ambient orbs)
    if (!light) el.classList.add("immersive");
    return () => {
      el.classList.remove("immersive");
      Object.entries(prev).forEach(([k, v]) => {
        if (v) el.style.setProperty(k, v);
        else el.style.removeProperty(k);
      });
    };
  }, [accent, bg, light]);

  return null;
}
