"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Line, Stars } from "@react-three/drei";
import * as THREE from "three";
import { makeGlowTexture } from "../explore/textures";
import { usePlanetSurface } from "../explore/surface";
import { JOURNEY_SUN_RADIUS, planetPosition, turnOffset, type Journey, type JourneyPlanet } from "./layout";

interface Props {
  journey: Journey;
  rootRef: React.RefObject<HTMLDivElement | null>;
  reduced: boolean;
  lowPower: boolean;
}

export default function JourneyScene({ journey, rootRef, reduced, lowPower }: Props) {
  const camera = useThree((s) => s.camera);

  // The camera and its look-at point each follow a smooth curve through the
  // per-section stations. Scroll picks the position along it.
  const curves = useMemo(
    () => ({
      pos: new THREE.CatmullRomCurve3(journey.stations.map((s) => s.pos), false, "centripetal"),
      target: new THREE.CatmullRomCurve3(journey.stations.map((s) => s.target), false, "centripetal"),
    }),
    [journey]
  );
  // seconds of orbital time; planets and the camera stations that follow them
  // are both pure functions of this, so they can never drift apart
  const time = useRef({ t: 0 });
  const scratch = useRef({ planet: new THREE.Vector3(), off: new THREE.Vector3() });

  const stars = useRef<THREE.Group>(null);
  const sectionH = useRef(0); // one scroll section's height, measured on resize (not per frame)
  const smooth = useRef(0); // damped scroll position, in stations
  const placed = useRef(false); // first frame: start exactly where the page is scrolled
  const ringOpacity = useRef({ v: 0.1 });
  const p = useRef(new THREE.Vector3());
  const t = useRef(new THREE.Vector3());

  // Reading offsetHeight inside useFrame forces a synchronous layout whenever
  // the DOM is dirty (the text cards animate in as you scroll), so measure it
  // when it changes instead.
  useEffect(() => {
    const el = rootRef.current?.firstElementChild as HTMLElement | null;
    if (!el) return;
    const measure = () => {
      sectionH.current = el.offsetHeight;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rootRef, journey]);

  // react-hooks/immutability is switched off here on purpose: moving the
  // camera every frame inside useFrame is the intended three.js pattern (it
  // runs outside React's render, so there's no render to corrupt)
  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    if (!reduced) time.current.t += delta;
    if (stars.current) stars.current.rotation.y = time.current.t * 0.004; // the sky turns, very slowly

    // Re-aim every planet station at its planet's current position, so the
    // camera orbits along with the world it's parked at. The curves read their
    // control points live, and rebuilding 14 of them per frame is trivial.
    const { planet, off } = scratch.current;
    journey.stations.forEach((s, i) => {
      if (s.planetIndex === undefined || !s.relPos || !s.relTarget) return;
      const jp = journey.planets[s.planetIndex];
      planetPosition(jp, time.current.t, planet);
      const turn = jp.omega * time.current.t;
      curves.pos.points[i].copy(planet).add(turnOffset(s.relPos, turn, off));
      curves.target.points[i].copy(planet).add(turnOffset(s.relTarget, turn, off));
    });

    // sections are 100svh tall, which isn't window.innerHeight on mobile
    // (the URL bar), so use the measured one (see the ResizeObserver below)
    const H = sectionH.current || window.innerHeight;
    const last = journey.stations.length - 1;
    const want = THREE.MathUtils.clamp(window.scrollY / H, 0, last);
    // Damp the scroll position itself, then derive the pose from that. Wheel
    // ticks and touch flicks arrive as steps; smoothing the input (rather than
    // chasing the output pose, as before) keeps the dwell/travel easing intact
    // and turns every kind of scrolling into the same slow glide.
    // (arriving via a station link, the first frame snaps there instead of gliding from the start)
    const a = reduced || !placed.current ? 1 : 1 - Math.exp(-delta * 3.2);
    placed.current = true;
    smooth.current += (want - smooth.current) * a;
    const scroll = smooth.current;
    const i = Math.min(last - 1, Math.floor(scroll));
    // smootherstep (zero 1st AND 2nd derivative at the ends) with flat ends:
    // the camera settles gently at each station while its text is on screen,
    // and eases in/out of every flight between them
    const g = THREE.MathUtils.smootherstep(scroll - i, 0.15, 0.85);
    const u = (i + g) / last;

    curves.pos.getPoint(u, p.current);
    curves.target.getPoint(u, t.current);
    camera.position.copy(p.current);
    // a slow, tiny float so a parked camera never looks frozen — scaled by how
    // far we are from what we're looking at, so close-ups and the far views
    // both drift by the same *apparent* amount
    if (!reduced) {
      const k = 0.012 * p.current.distanceTo(t.current);
      const now = time.current.t;
      camera.position.x += Math.sin(now * 0.37) * k;
      camera.position.y += Math.cos(now * 0.29) * k * 0.7;
    }
    camera.lookAt(t.current);

    // orbit lines: present from far away (where they show the layout), nearly
    // gone up close (where they only cut across the frame as stray streaks)
    ringOpacity.current.v = THREE.MathUtils.mapLinear(
      THREE.MathUtils.clamp(camera.position.length(), 25, 170),
      25,
      170,
      0.03,
      0.11
    );
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <>
      {/* little fill: the side turned away from the sun should fall into shadow */}
      <ambientLight intensity={0.24} />
      <pointLight position={[0, 0, 0]} intensity={3.6} decay={0} color="#fff0dc" />
      <group ref={stars}>
        <Stars radius={320} depth={160} count={lowPower ? 2500 : 6000} factor={5} fade speed={reduced ? 0 : 0.3} />
      </group>

      <Sun />
      {journey.planets.map((jp) => (
        <group key={jp.cfg.project.slug}>
          <OrbitRing radius={jp.orbit} opacity={ringOpacity} />
          <Planet jp={jp} time={time} />
        </group>
      ))}
    </>
  );
}

function Sun() {
  const glow = useMemo(() => makeGlowTexture(), []);
  useEffect(() => () => glow.dispose(), [glow]);
  return (
    <group>
      <mesh>
        <sphereGeometry args={[JOURNEY_SUN_RADIUS, 64, 64]} />
        <meshBasicMaterial color="#ffd9a0" />
      </mesh>
      <sprite scale={[JOURNEY_SUN_RADIUS * 5.4, JOURNEY_SUN_RADIUS * 5.4, 1]}>
        <spriteMaterial map={glow} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.7} />
      </sprite>
      {/* a second, much wider and fainter halo — just enough that the light seems to reach into the system */}
      <sprite scale={[JOURNEY_SUN_RADIUS * 12, JOURNEY_SUN_RADIUS * 12, 1]}>
        <spriteMaterial map={glow} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.07} />
      </sprite>
    </group>
  );
}

// Drawn as a screen-space 1px line rather than a thin 3D ring mesh: this scene
// views the same orbit from ~8 units away and from ~180, and a ring geometry
// thin enough to look right up close is sub-pixel (invisible) from far away.
function OrbitRing({ radius, opacity }: { radius: number; opacity: React.RefObject<{ v: number }> }) {
  const line = useRef<{ material: THREE.Material }>(null);
  const points = useMemo(
    () => Array.from({ length: 193 }, (_, i) => {
      const a = (i / 192) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    }),
    [radius]
  );
  useFrame(() => {
    if (line.current) line.current.material.opacity = opacity.current.v;
  });
  return <Line ref={line as never} points={points} color="#9cc4ff" lineWidth={1} transparent opacity={0.1} depthWrite={false} />;
}

function Planet({ jp, time }: { jp: JourneyPlanet; time: React.RefObject<{ t: number }> }) {
  const { cfg, pos, radius } = jp;
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  // surface colour and thumbnail overlay come from the project itself
  const { map, hue } = usePlanetSurface(cfg.seed, cfg.hue, cfg.project.thumbnail, cfg.tone);

  useFrame((_, delta) => {
    if (group.current) planetPosition(jp, time.current.t, group.current.position);
    if (body.current) body.current.rotation.y += delta * cfg.spin;
  });

  return (
    <group ref={group} position={pos}>
      <mesh ref={body}>
        <sphereGeometry args={[radius, 64, 48]} />
        <meshStandardMaterial map={map} roughness={0.95} metalness={0} />
      </mesh>
      {cfg.ring && (
        <mesh rotation={[Math.PI / 2.25, 0.25, 0]}>
          <ringGeometry args={[radius * 1.45, radius * 2.15, 96]} />
          <meshBasicMaterial color={`hsl(${hue}, 45%, 70%)`} transparent opacity={0.42} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
