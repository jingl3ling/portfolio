"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import ImmersiveTheme from "@/components/ImmersiveTheme";

const BlackholeModel = dynamic(() => import("@/components/workspace/BlackholeModel"), {
  ssr: false,
});

export default function TestBlackholeModelPage() {
  return (
    <>
      <ImmersiveTheme accent="#8ec5ff" bg="#05060a" />
      <main className="relative min-h-screen">
        <div className="wrap pointer-events-none absolute inset-x-0 top-28 z-10">
          <p className="mono-label mb-2">Test — downloaded 3D model</p>
          <h1 className="display text-[clamp(1.8rem,4vw,3rem)]">Blackhole</h1>
          <p className="mt-3 max-w-md text-sm text-muted">
            ~13MB, textured mesh (not a point cloud) — a much lighter test than
            the galaxy model. Drag to orbit, scroll to zoom.
          </p>
        </div>

        <div className="fixed inset-0 -z-0">
          <Canvas camera={{ position: [0, 0, 10], fov: 55, near: 0.1, far: 5000 }} dpr={[1, 2]}>
            <color attach="background" args={["#05060a"]} />
            <Suspense fallback={null}>
              <BlackholeModel />
            </Suspense>
          </Canvas>
        </div>

        <p className="mono-label pointer-events-none absolute inset-x-0 bottom-8 text-center text-[11px] text-muted">
          &quot;Blackhole&quot; by rubykamen — CC BY 4.0 — sketchfab.com/3d-models/blackhole-74cbeaeae2174a218fe9455d77902b5c
        </p>
      </main>
    </>
  );
}
