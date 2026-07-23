"use client";

import { useEffect } from "react";

/**
 * Pins /v0 to the magenta accent and hides the (shared) global ambient orbs,
 * so changing the site's global accent/ambient later won't alter /v0.
 */
export default function V0Theme() {
  useEffect(() => {
    const el = document.documentElement;
    const prevA = el.style.getPropertyValue("--accent");
    const prevAI = el.style.getPropertyValue("--accent-ink");
    el.style.setProperty("--accent", "#db2777");
    el.style.setProperty("--accent-ink", "#a81e5b");
    el.classList.add("route-v0");
    return () => {
      el.classList.remove("route-v0");
      if (prevA) el.style.setProperty("--accent", prevA);
      else el.style.removeProperty("--accent");
      if (prevAI) el.style.setProperty("--accent-ink", prevAI);
      else el.style.removeProperty("--accent-ink");
    };
  }, []);

  return null;
}
