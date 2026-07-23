"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ImmersiveTheme from "@/components/ImmersiveTheme";

// pulls in three.js + the model loader — keep it out of the initial bundle,
// same pattern as the other v4 3D backgrounds
const GalacticModel = dynamic(() => import("@/components/workspace/GalacticModel"), {
  ssr: false,
});

export default function TestGalaxyModelPage() {
  return (
    <>
      <ImmersiveTheme accent="#8ec5ff" bg="#05060a" />
      <main className="relative min-h-screen">
        <div className="wrap pointer-events-none absolute inset-x-0 top-28 z-10">
          <p className="mono-label mb-2">Test — downloaded 3D model</p>
          <h1 className="display text-[clamp(1.8rem,4vw,3rem)]">Galactic Incident</h1>
          <p className="mt-3 max-w-md text-sm text-muted">
            Compressed from the ~79MB / 2.95M-point original down to ~5.8MB / 491K
            points (decimated + quantized). Drag to orbit, scroll to zoom.
          </p>
        </div>

        <div className="fixed inset-0 -z-0">
          <Canvas camera={{ position: [0, 0, 300], fov: 60, near: 0.1, far: 5000 }} dpr={[1, 2]}>
            <color attach="background" args={["#05060a"]} />
            <ambientLight intensity={1} />
            <Suspense fallback={null}>
              <GalacticModel />
            </Suspense>
          </Canvas>
        </div>

        <p className="mono-label pointer-events-none absolute inset-x-0 bottom-8 text-center text-[11px] text-muted">
          &quot;Galactic Incident&quot; by Loïc Norgeot — CC BY 4.0 — sketchfab.com/3d-models/galactic-incident-397b266af9604b9fbf0a4e5446cf864b
        </p>
      </main>
    </>
  );
}
