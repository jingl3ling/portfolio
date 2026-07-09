"use client";

import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

export default function SplineBackground({ scene }: { scene: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Spline scene={scene} style={{ width: "100%", height: "100%" }} />
      {/* fade the 3D scene into black at the edges + bottom so it blends
          with the black section and keeps the title readable */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.9), transparent 22%, transparent 78%, rgba(0,0,0,0.9)), linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 38%, rgba(0,0,0,0.97))",
        }}
      />
    </div>
  );
}
