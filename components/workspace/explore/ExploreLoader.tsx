"use client";

import dynamic from "next/dynamic";

// three.js + the scene stay out of every other route's bundle, and a canvas
// can't server-render anyway
const Explorer = dynamic(() => import("./Explorer"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 grid place-items-center bg-[#03040a]">
      <p className="mono-label">charting the universe…</p>
    </div>
  ),
});

export default function ExploreLoader() {
  return <Explorer />;
}
