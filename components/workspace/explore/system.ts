import { projects, type Project } from "@/lib/projects";

export const SUN = "sun";
export const SUN_RADIUS = 2.4;

// How saturated / light a themed planet's bands are (the default bands are
// mid-dark, which can't read as a pastel).
export interface Tone {
  sat: number;
  light: number;
}

// Projects with a brand colour that should win over the thumbnail's dominant
// hue and the track's default. Althy's theme is baby blue.
const THEMES: Record<string, { hue: number } & Tone> = {
  // lighting brightens the surface, so the bands sit darker than #89CFF0 itself
  althy: { hue: 201, sat: 82, light: 62 },
};

export interface PlanetConfig {
  project: Project;
  radius: number; // orbit radius
  angle0: number; // starting angle on the orbit
  omega: number; // orbital speed, rad/s
  size: number;
  hue: number;
  tone?: Tone; // set for a planet with a fixed theme colour; see THEMES
  seed: number; // stable per-slug seed for the procedural texture
  ring: boolean;
  yOff: number;
  spin: number; // self-rotation, rad/s
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Not to scale on purpose: a readable map, not an astronomy diagram.
//  - Technical projects take the inner orbits (cool hues),
//  - Entrepreneurship takes the outer ring (warm hues),
//  - featured projects are bigger, award winners get a ring.
export function buildSystem(): { planets: PlanetConfig[]; maxRadius: number } {
  const technical = projects.filter((p) => p.track === "technical");
  const venture = projects.filter((p) => p.track === "venture");
  const innerStart = 6.5;
  const innerStep = 2.7;
  const outerStart = innerStart + innerStep * Math.max(0, technical.length - 1) + 5.5;
  const outerStep = 3;

  const make = (p: Project, i: number, start: number, step: number, warm: boolean): PlanetConfig => {
    const h = hash(p.slug);
    const theme = THEMES[p.slug];
    const radius = start + i * step;
    return {
      project: p,
      radius,
      angle0: i * 2.399 + (warm ? 1.1 : 0), // golden angle: neighbours never line up
      omega: 0.16 / Math.pow(radius / innerStart, 1.4),
      size: p.featured ? 1.05 : 0.8,
      seed: h,
      hue: theme ? theme.hue : warm ? 5 + (h % 55) : 170 + (h % 90),
      tone: theme && { sat: theme.sat, light: theme.light },
      ring: !!p.award,
      yOff: (((h >> 5) % 100) / 100 - 0.5) * 0.9,
      spin: 0.12 + ((h >> 9) % 40) / 200,
    };
  };

  const planets = [
    ...technical.map((p, i) => make(p, i, innerStart, innerStep, false)),
    ...venture.map((p, i) => make(p, i, outerStart, outerStep, true)),
  ];
  const maxRadius = planets.reduce((m, p) => Math.max(m, p.radius), 0);
  return { planets, maxRadius };
}

// camera distance that frames the whole system for a given viewport aspect
export function overviewDistance(maxRadius: number, aspect: number): number {
  // margin is generous on purpose: the title block (top-left) and the project
  // chips (bottom) sit over the canvas, so the system should clear them
  return maxRadius * Math.min(3.1, 1.95 / Math.min(1, aspect));
}

// Where the camera is placed on the very first frame: pulled back along the
// overview direction so the page opens with a fly-in to the overview. It must
// be set on the Canvas itself — three.js's default camera sits 5 units from
// the origin, which showed up as a flash of a giant sun before anything else
// could move it.
export function startCameraPosition(maxRadius: number, aspect: number, reduced: boolean): [number, number, number] {
  const d = overviewDistance(maxRadius, aspect) * (reduced ? 1 : 1.8);
  return [0, Math.sin(0.7) * d, Math.cos(0.7) * d];
}
