"use client";

import { useEffect } from "react";

/**
 * Overrides the global CSS tokens for the current route (dark, light text),
 * so every shared component — nav, sections, cursor — recolors automatically.
 * Restores the previous values on unmount.
 */
export default function ImmersiveTheme({
  accent = "#8ec5ff",
  bg = "#0b0b12",
}: {
  accent?: string;
  bg?: string;
}) {
  useEffect(() => {
    const el = document.documentElement;
    const vars: Record<string, string> = {
      "--bg": bg,
      "--ink": "#f4f4f5",
      "--muted": "#a1a1aa",
      "--faint": "#71717a",
      "--line": "rgba(255,255,255,0.14)",
      "--accent": accent,
      "--accent-ink": accent,
    };
    const prev: Record<string, string> = {};
    Object.entries(vars).forEach(([k, v]) => {
      prev[k] = el.style.getPropertyValue(k);
      el.style.setProperty(k, v);
    });
    el.classList.add("immersive");
    return () => {
      el.classList.remove("immersive");
      Object.entries(prev).forEach(([k, v]) => {
        if (v) el.style.setProperty(k, v);
        else el.style.removeProperty(k);
      });
    };
  }, [accent, bg]);

  return null;
}
