"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import ImmersiveTheme from "@/components/ImmersiveTheme";

const SpaceField = dynamic(() => import("@/components/v4/SpaceField"), {
  ssr: false,
});

/**
 * Dark space theme + a fixed starfield/nebula behind a v4 case study, so the
 * work pages match the /v4 home page's space theme.
 */
export default function WorkBackdrop() {
  // always open a case study at the top — Lenis persists across client
  // navigations and keeps its previous scroll target, so force it there
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } }).lenis;
    const toTop = () => {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    };
    toTop();
    requestAnimationFrame(toTop);
  }, []);

  return (
    <>
      <ImmersiveTheme accent="#8ec5ff" bg="#05060a" />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <SpaceField warp={false} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 12%, rgba(120,160,255,0.16), transparent 70%), radial-gradient(50% 45% at 15% 62%, rgba(170,120,255,0.14), transparent 70%)",
          }}
        />
      </div>
    </>
  );
}
