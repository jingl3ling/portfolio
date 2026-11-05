"use client";

import { useEffect, useMemo, useRef, useState, type ComponentRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { SUN, SUN_RADIUS, overviewDistance, type PlanetConfig } from "./system";
import { makeGlowTexture } from "./textures";
import { usePlanetSurface } from "./surface";

type Controls = ComponentRef<typeof OrbitControls>;
const ORIGIN = new THREE.Vector3();

interface SceneProps {
  planets: PlanetConfig[];
  maxRadius: number;
  focus: string | null;
  onSelect: (slug: string | null) => void;
  reduced: boolean;
  lowPower: boolean;
}

export default function Scene({ planets, maxRadius, focus, onSelect, reduced, lowPower }: SceneProps) {
  const controls = useRef<Controls>(null);
  const clock = useRef({ t: 0, spin: 1 });
  // live world positions, written by each planet every frame, read by the camera rig
  const [positions] = useState(() => new Map<string, THREE.Vector3>());
  const [hovered, setHovered] = useState<string | null>(null);

  // orbits freeze while something is focused (so the thing you flew to holds
  // still under the info panel) and ease back to full speed afterwards
  useFrame((_, delta) => {
    const c = clock.current;
    const target = focus || reduced ? 0 : 1;
    c.spin += (target - c.spin) * (1 - Math.exp(-delta * 3));
    c.t += delta * c.spin;
  });

  const overview = useOverview(maxRadius);

  return (
    <>
      {/* little fill: the side turned away from the sun should fall into shadow */}
      <ambientLight intensity={0.24} />
      <pointLight position={[0, 0, 0]} intensity={3.6} decay={0} color="#fff0dc" />
      <Stars radius={140} depth={70} count={lowPower ? 1500 : 4000} factor={4} fade speed={reduced ? 0 : 0.4} />

      <Sun focused={focus === SUN} dimmed={focus !== null && focus !== SUN} onSelect={onSelect} />

      {planets.map((cfg) => (
        <group key={cfg.project.slug}>
          <OrbitRing radius={cfg.radius} dimmed={focus !== null} />
          <Planet
            cfg={cfg}
            clock={clock}
            positions={positions}
            focused={focus === cfg.project.slug}
            dimmed={focus !== null && focus !== cfg.project.slug}
            hovered={hovered === cfg.project.slug}
            setHovered={setHovered}
            onSelect={onSelect}
          />
        </group>
      ))}

      <OrbitControls
        ref={controls}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        zoomSpeed={0.7}
        maxPolarAngle={Math.PI * 0.92}
        minPolarAngle={Math.PI * 0.08}
      />
      <Rig
        controls={controls}
        planets={planets}
        positions={positions}
        focus={focus}
        overview={overview}
        reduced={reduced}
      />
    </>
  );
}

function useOverview(maxRadius: number) {
  const size = useThree((s) => s.size);
  return useMemo(() => overviewDistance(maxRadius, size.width / size.height), [maxRadius, size.width, size.height]);
}

// Drives the camera: eases OrbitControls' target onto the focused body and the
// camera distance to a close-up, while keeping whatever viewing direction the
// user has dragged to. Once it has arrived it lets go of the distance, so you
// can still zoom and orbit freely around the thing you're looking at.
function Rig({
  controls,
  planets,
  positions,
  focus,
  overview,
  reduced,
}: {
  controls: React.RefObject<Controls | null>;
  planets: PlanetConfig[];
  positions: Map<string, THREE.Vector3>;
  focus: string | null;
  overview: number;
  reduced: boolean;
}) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const shift = useRef(0); // how far (as a fraction of height) the view is nudged up
  const arrived = useRef(false);
  const lastFocus = useRef<string | null | undefined>(undefined);
  const prev = useRef(new THREE.Vector3());
  const tmp = useRef(new THREE.Vector3());

  // react-hooks/immutability is switched off here on purpose: mutating the
  // controls/camera every frame inside useFrame is the intended three.js
  // pattern (it runs outside React's render, so there's no render to corrupt)
  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    const c = controls.current;
    if (!c) return;
    if (lastFocus.current !== focus) {
      lastFocus.current = focus;
      arrived.current = false;
    }

    let goal = ORIGIN;
    let dist = overview;
    if (focus === SUN) {
      dist = SUN_RADIUS * 4.4;
    } else if (focus) {
      const cfg = planets.find((p) => p.project.slug === focus);
      goal = positions.get(focus) ?? ORIGIN;
      dist = (cfg?.size ?? 1) * 4.6 + 1.2;
    }

    const k = reduced ? 1 : 1 - Math.exp(-delta * 3);
    prev.current.copy(c.target);
    c.target.lerp(goal, k);
    camera.position.add(tmp.current.copy(c.target).sub(prev.current));

    if (!arrived.current) {
      const offset = tmp.current.copy(camera.position).sub(c.target);
      const next = THREE.MathUtils.lerp(offset.length(), dist, k);
      offset.setLength(next);
      camera.position.copy(c.target).add(offset);
      if (Math.abs(next - dist) < 0.05 && c.target.distanceTo(goal) < 0.05) arrived.current = true;
    }

    // wide limits while travelling (tight ones would snap the camera), then
    // sensible ones around the destination once we're there
    c.minDistance = arrived.current ? (focus ? dist * 0.45 : overview * 0.25) : 0.5;
    c.maxDistance = arrived.current ? (focus ? dist * 3.5 : overview * 1.4) : 1000;
    // On narrow screens the info panel is a bottom sheet that would sit right
    // on top of the planet we just centred, so nudge the whole view upward
    // while something is focused (and ease it back for the overview).
    const want = focus && size.width < 768 ? 0.18 : 0;
    shift.current += (want - shift.current) * (reduced ? 1 : 1 - Math.exp(-delta * 4));
    const cam = camera as THREE.PerspectiveCamera;
    if (Math.abs(shift.current) > 0.001) {
      cam.setViewOffset(size.width, size.height, 0, shift.current * size.height, size.width, size.height);
    } else if (cam.view?.enabled) {
      cam.clearViewOffset();
    }

    c.update();
  });
  /* eslint-enable react-hooks/immutability */
  return null;
}

function Sun({
  focused,
  dimmed,
  onSelect,
}: {
  focused: boolean;
  dimmed: boolean;
  onSelect: (slug: string | null) => void;
}) {
  const glow = useMemo(() => makeGlowTexture(), []);
  useEffect(() => () => glow.dispose(), [glow]);
  return (
    <group>
      <mesh
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (e.delta < 4) onSelect(focused ? null : SUN);
        }}
      >
        <sphereGeometry args={[SUN_RADIUS, 48, 48]} />
        <meshBasicMaterial color="#ffd9a0" />
      </mesh>
      <sprite scale={[SUN_RADIUS * 5.4, SUN_RADIUS * 5.4, 1]}>
        <spriteMaterial map={glow} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.7} />
      </sprite>
      <Html center position={[0, SUN_RADIUS + 0.9, 0]} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
        <Label text="Jing Huang" sub="the sun · about" visible={!focused} dimmed={dimmed} />
      </Html>
    </group>
  );
}

function OrbitRing({ radius, dimmed }: { radius: number; dimmed: boolean }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.012, radius + 0.012, 160]} />
      <meshBasicMaterial color="#8ec5ff" transparent opacity={dimmed ? 0.05 : 0.16} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Planet({
  cfg,
  clock,
  positions,
  focused,
  dimmed,
  hovered,
  setHovered,
  onSelect,
}: {
  cfg: PlanetConfig;
  clock: React.RefObject<{ t: number; spin: number }>;
  positions: Map<string, THREE.Vector3>;
  focused: boolean;
  dimmed: boolean;
  hovered: boolean;
  setHovered: (slug: string | null) => void;
  onSelect: (slug: string | null) => void;
}) {
  const { project, radius, angle0, omega, size, hue, seed, ring, yOff, spin } = cfg;
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  // surface colour and thumbnail overlay come from the project itself
  const { map, hue: surfaceHue } = usePlanetSurface(seed, hue, project.thumbnail, cfg.tone);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const a = angle0 + clock.current.t * omega;
    g.position.set(Math.cos(a) * radius, yOff, Math.sin(a) * radius);
    positions.set(project.slug, g.position);
    const b = body.current;
    if (b) {
      b.rotation.y += delta * spin * clock.current.spin;
      const s = THREE.MathUtils.lerp(b.scale.x, hovered || focused ? 1.12 : 1, 1 - Math.exp(-delta * 8));
      b.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      <mesh
        ref={body}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          if (e.delta < 4) onSelect(focused ? null : project.slug);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(project.slug);
        }}
        onPointerOut={() => setHovered(null)}
      >
        <sphereGeometry args={[size, 48, 32]} />
        <meshStandardMaterial map={map} roughness={0.95} metalness={0} />
      </mesh>

      {ring && (
        <mesh rotation={[Math.PI / 2.25, 0.25, 0]}>
          <ringGeometry args={[size * 1.45, size * 2.15, 96]} />
          <meshBasicMaterial color={`hsl(${surfaceHue}, 45%, 70%)`} transparent opacity={0.42} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}

      <Html center position={[0, size + 0.7, 0]} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
        <Label
          text={project.title}
          sub={project.track === "technical" ? "technical" : "entrepreneurship"}
          visible={!focused}
          dimmed={dimmed}
          active={hovered}
        />
      </Html>
    </group>
  );
}

function Label({
  text,
  sub,
  visible,
  dimmed,
  active,
}: {
  text: string;
  sub: string;
  visible: boolean;
  dimmed: boolean;
  active?: boolean;
}) {
  return (
    <div
      className={`whitespace-nowrap text-center transition-opacity duration-500 ${
        !visible ? "opacity-0" : dimmed ? "opacity-15" : active ? "opacity-100" : "opacity-70"
      }`}
    >
      <div className="font-display text-[13px] leading-none text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">{text}</div>
      <div className="mono-label mt-1 !text-[9px]">{sub}</div>
    </div>
  );
}
