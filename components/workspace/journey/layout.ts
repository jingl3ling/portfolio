import * as THREE from "three";
import { buildSystem, SUN_RADIUS, type PlanetConfig } from "../explore/system";

// The journey re-lays the same planets as the explorer, but along an outward
// spiral instead of independent orbits: the camera travels sun -> planet 1 ->
// planet 2 ..., and with the explorer's golden-angle placement that path would
// whip around the sun between every pair. Here neighbours are neighbours.

export const JOURNEY_SUN_RADIUS = SUN_RADIUS * 1.5;

export interface JourneyPlanet {
  cfg: PlanetConfig;
  pos: THREE.Vector3; // position at t = 0 (the layout the camera stations were designed against)
  radius: number; // body radius (scaled up from the explorer — we get much closer here)
  orbit: number; // distance from the sun, drawn as a faint ring
  angle0: number;
  omega: number; // orbital speed, rad/s — slower the further out, like the explorer's
}

// where a planet is `t` seconds in
export function planetPosition(jp: JourneyPlanet, t: number, out: THREE.Vector3): THREE.Vector3 {
  const a = jp.angle0 + jp.omega * t;
  return out.set(Math.cos(a) * jp.orbit, jp.pos.y, Math.sin(a) * jp.orbit);
}

// Turns an (x, z) offset by `angle` in the same sense planets orbit (x toward
// z). Planet stations are stored as offsets from their planet, and this keeps
// the camera's view of the planet unchanged as the planet moves along its orbit.
export function turnOffset(v: THREE.Vector3, angle: number, out: THREE.Vector3): THREE.Vector3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return out.set(v.x * c - v.z * s, v.y, v.x * s + v.z * c);
}

export type StationKind = "intro" | "sun" | "planet" | "outro";
export type Side = "left" | "right";

export interface Station {
  kind: StationKind;
  planetIndex?: number;
  pos: THREE.Vector3; // where the camera sits (at t = 0)
  target: THREE.Vector3; // where it looks (offset so the body sits beside the text panel)
  // planet stations only: the same two points relative to the planet, so they
  // can ride along with it as it orbits
  relPos?: THREE.Vector3;
  relTarget?: THREE.Vector3;
  panel: Side; // which side of the screen the text panel is on
}

export interface Journey {
  planets: JourneyPlanet[];
  stations: Station[];
}

const UP = new THREE.Vector3(0, 1, 0);
// the two whole-system views keep the system nearer the middle of the screen
// than the close-ups do (they were pushed right, hard against the edge)
const OVERVIEW_SHIFT = 0.65;

export function buildJourney(aspect: number, narrow: boolean): Journey {
  const { planets: base } = buildSystem();
  const techCount = base.filter((p) => p.project.track === "technical").length;

  const planets: JourneyPlanet[] = base.map((cfg, i) => {
    // a gap before the entrepreneurship planets so the two tracks read as two regions
    const orbit = 12 + i * 5.5 + (i >= techCount ? 7 : 0);
    const angle = 0.4 + i * 0.9;
    return {
      cfg,
      orbit,
      angle0: angle,
      omega: 0.065 / Math.pow(orbit / 12, 1.15),
      radius: cfg.size * 1.7,
      pos: new THREE.Vector3(Math.cos(angle) * orbit, cfg.yOff * 2, Math.sin(angle) * orbit),
    };
  });

  // Frame `body` from `camPos` so it lands beside the text panel instead of
  // behind it: nudge the look-at point sideways (desktop) or downward
  // (narrow screens, where the panel is a bottom sheet).
  const frame = (camPos: THREE.Vector3, body: THREE.Vector3, panel: Side, shiftScale = 1): THREE.Vector3 => {
    const d = camPos.distanceTo(body);
    const target = body.clone();
    if (narrow) return target.addScaledVector(UP, -0.23 * d); // lands the body in the free area above the sheet
    const forward = body.clone().sub(camPos).normalize();
    const right = new THREE.Vector3().crossVectors(forward, UP).normalize();
    const s = 0.186 * d * Math.min(aspect, 2) * shiftScale; // ~40% of the half-width, in world units at that distance
    return target.addScaledVector(right, panel === "right" ? s : -s);
  };

  // a portrait screen is narrow, so the same distance makes bodies fill it —
  // stand further back there
  const far = narrow ? 1.9 : 1;

  const origin = new THREE.Vector3();
  const stations: Station[] = [];

  const introPos = new THREE.Vector3(0, 85, 155);
  stations.push({ kind: "intro", pos: introPos, target: frame(introPos, origin, "left", OVERVIEW_SHIFT), panel: "left" });

  const sunPos = new THREE.Vector3(0.25, 0.12, 1).normalize().multiplyScalar(JOURNEY_SUN_RADIUS * 6.2 * far);
  stations.push({ kind: "sun", pos: sunPos, target: frame(sunPos, origin, "left"), panel: "left" });

  planets.forEach((p, i) => {
    const radial = new THREE.Vector3(p.pos.x, 0, p.pos.z).normalize();
    const d = p.radius * 4.9 * far;
    // between the sun and the planet, looking outward: the sun is behind the
    // camera, so the planet is fully lit
    let camPos: THREE.Vector3;
    if (narrow) {
      // Standing far enough back for a portrait screen can be further than the
      // planet is from the sun — i.e. the camera would end up inside the sun
      // (the whole sky goes orange). So split the distance: a limited retreat
      // toward the sun, the rest sideways (trailing behind along the route)
      // and upward.
      const h = Math.min(d * 0.8, p.orbit * 0.45);
      const alt = d * 0.35;
      const side = Math.sqrt(Math.max(0, d * d - h * h - alt * alt));
      const tangent = new THREE.Vector3(-radial.z, 0, radial.x);
      camPos = p.pos.clone().addScaledVector(radial, -h).addScaledVector(tangent, -side).add(new THREE.Vector3(0, alt, 0));
    } else {
      camPos = p.pos.clone().addScaledVector(radial, -d).add(new THREE.Vector3(0, d * 0.3, 0));
    }
    const panel: Side = i % 2 === 0 ? "right" : "left";
    const target = frame(camPos, p.pos, panel);
    stations.push({
      kind: "planet",
      planetIndex: i,
      pos: camPos,
      target,
      panel,
      relPos: camPos.clone().sub(p.pos),
      relTarget: target.clone().sub(p.pos),
    });
  });

  const outroPos = new THREE.Vector3(0, 105, 190);
  stations.push({ kind: "outro", pos: outroPos, target: frame(outroPos, origin, "left", OVERVIEW_SHIFT), panel: "left" });

  return { planets, stations };
}
