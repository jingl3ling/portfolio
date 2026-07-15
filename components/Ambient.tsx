// const ORBS = [
//   { top: "6%", left: "60%", size: 540, color: "#aeb6c2", opacity: 0.16, dx: "30px", dy: "-30px", dur: "18s", delay: "0s" },
//   { top: "24%", left: "-6%", size: 440, color: "#8892a0", opacity: 0.12, dx: "-24px", dy: "22px", dur: "22s", delay: "-4s" },
//   { top: "50%", left: "78%", size: 480, color: "#c2c8d0", opacity: 0.12, dx: "22px", dy: "28px", dur: "20s", delay: "-8s" },
//   { top: "70%", left: "10%", size: 420, color: "#9aa7b5", opacity: 0.1, dx: "26px", dy: "-18px", dur: "24s", delay: "-3s" },
//   { top: "88%", left: "64%", size: 400, color: "#8892a0", opacity: 0.1, dx: "-20px", dy: "-24px", dur: "19s", delay: "-6s" },
// ];

"use client";

import { usePathname } from "next/navigation";

const ORBS = [
  { top: "6%", left: "60%", size: 540, color: "#8b5cff", opacity: 0.16, dx: "30px", dy: "-30px", dur: "18s", delay: "0s" },
  { top: "24%", left: "-6%", size: 440, color: "#db2777", opacity: 0.12, dx: "-24px", dy: "22px", dur: "22s", delay: "-4s" },
  { top: "50%", left: "78%", size: 480, color: "#ff3d81", opacity: 0.12, dx: "22px", dy: "28px", dur: "20s", delay: "-8s" },
  { top: "70%", left: "10%", size: 420, color: "#8b5cff", opacity: 0.1, dx: "26px", dy: "-18px", dur: "24s", delay: "-3s" },
  { top: "88%", left: "64%", size: 400, color: "#db2777", opacity: 0.1, dx: "-20px", dy: "-24px", dur: "19s", delay: "-6s" },
];


export default function Ambient() {
  const pathname = usePathname();
  // immersive routes have their own full-screen backgrounds — no pink ambient
  if (pathname?.startsWith("/v4")) return null;

  return (
    <div className="ambient" aria-hidden>
      {ORBS.map((o, i) => {
        const style: React.CSSProperties & Record<string, string | number> = {
          top: o.top,
          left: o.left,
          width: o.size,
          height: o.size,
          background: o.color,
          opacity: o.opacity,
          "--dx": o.dx,
          "--dy": o.dy,
          animationDuration: o.dur,
          animationDelay: o.delay,
        };
        return <span key={i} className="orb" style={style} />;
      })}
    </div>
  );
}
