"use client";

import dynamic from "next/dynamic";

// keeps three.js out of every other route's bundle; a canvas can't SSR anyway
const Journey = dynamic(() => import("./Journey"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 grid place-items-center bg-[#03040a]">
      <p className="mono-label">preparing the journey…</p>
    </div>
  ),
});

export default function JourneyLoader() {
  return <Journey />;
}
