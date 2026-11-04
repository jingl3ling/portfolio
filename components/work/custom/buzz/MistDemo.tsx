"use client";

import { useId, useState } from "react";
import s from "./buzz.module.css";

// the lamp's real color stops (buzz/server/buzz/intensity.py), blended in
// OKLab like the server does so blue → orange passes through off-white
const STOPS: [number, [number, number, number]][] = [
  [0, [90, 180, 255]],
  [0.5, [244, 240, 240]],
  [0.75, [255, 110, 20]],
  [1, [255, 30, 20]],
];

const toLinear = (c: number) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const fromLinear = (v: number) =>
  Math.round(255 * Math.min(1, Math.max(0, v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055)));

function toOklab([r, g, b]: [number, number, number]) {
  const [lr, lg, lb] = [toLinear(r), toLinear(g), toLinear(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s2 = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s2,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s2,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s2,
  ];
}
function fromOklab([L, A, B]: number[]): [number, number, number] {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s2 = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s2),
    fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s2),
    fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s2),
  ];
}

function colorAt(score: number): [number, number, number] {
  for (let i = 1; i < STOPS.length; i++) {
    const [x1, c1] = STOPS[i];
    if (score <= x1) {
      const [x0, c0] = STOPS[i - 1];
      const t = (score - x0) / (x1 - x0);
      const a = toOklab(c0);
      const b = toOklab(c1);
      return fromOklab(a.map((v, k) => v + (b[k] - v) * t));
    }
  }
  return STOPS[STOPS.length - 1][1];
}

const LEVELS = [
  { at: 0, label: "Relaxed chat" },
  { at: 0.5, label: "Animated" },
  { at: 0.8, label: "Heated" },
  { at: 1, label: "Argument" },
];

function moodOf(score: number) {
  if (score >= 0.9) return "Very intense";
  if (score >= 0.7) return "Intense";
  return "Calm";
}

export default function MistDemo() {
  const [score, setScore] = useState(0.1);
  const id = useId();
  const [r, g, b] = colorAt(score);
  // in this demo breath follows the slider; on the lamp it follows speaking pace (10 s → 3 s)
  const breath = 10 - score * 7;
  const split = Math.max(0, (score - 0.75) / 0.25) * 22;

  return (
    <div
      className={s.demo}
      style={
        {
          "--mist": `rgb(${r} ${g} ${b})`,
          "--breath": `${breath.toFixed(2)}s`,
          "--split": `${split.toFixed(1)}px`,
        } as React.CSSProperties
      }
    >
      <div className={s.stage}>
        <div className={s.halo} aria-hidden />
        <svg className={s.crystal} viewBox="0 0 200 300" role="img" aria-label={`MIST crystal glowing ${moodOf(score).toLowerCase()}`}>
          <g className={s.top}>
            <polygon className={s.fLight} points="100,8 28,142 112,150" />
            <polygon className={s.fMid} points="100,8 112,150 176,152" />
          </g>
          <g className={s.bottom}>
            <polygon className={s.fMid} points="28,142 112,150 104,292" />
            <polygon className={s.fDark} points="112,150 176,152 104,292" />
          </g>
          <polyline className={s.edge} points="100,8 112,150 104,292" />
        </svg>
      </div>

      <div className={s.controls}>
        <div className={s.readout} aria-live="polite">
          <span className={s.swatch} aria-hidden />
          <span>
            <b>{moodOf(score)}</b> · score {score.toFixed(2)} · rgb({r}, {g}, {b}) · breath {breath.toFixed(1)} s
          </span>
        </div>
        <label htmlFor={id} className={s.sliderLabel}>
          How heated is the conversation?
        </label>
        <input
          id={id}
          className={s.slider}
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
        />
        <div className={s.ticks} aria-hidden>
          {LEVELS.map((l) => (
            <button key={l.label} type="button" tabIndex={-1} onClick={() => setScore(l.at)} style={{ left: `${l.at * 100}%` }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
