"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const N = 3500;
const DEPTH = 46;
const NEAR = 8.5;

/** 0 at top → 1 by one viewport (tunnel peak) → decays to a calm drift for content */
function warpFromScroll() {
  const vh = window.innerHeight || 800;
  const p = window.scrollY / vh;
  if (p <= 1) return p * p * (3 - 2 * p);
  return Math.max(0.12, 1 - (p - 1) * 1.1);
}

function Field({ enableWarp }: { enableWarp: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const warp = useRef(0);
  const ndc = useRef({ x: 2, y: 2 });

  const { positions, ang, rad, zs } = useMemo(() => {
    const positions = new Float32Array(N * 3);
    const ang = new Float32Array(N);
    const rad = new Float32Array(N);
    const zs = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.5) * 9 + 0.3;
      const z = -DEPTH + Math.random() * (DEPTH + NEAR);
      ang[i] = a;
      rad[i] = r;
      zs[i] = z;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r;
      positions[i * 3 + 2] = z;
    }
    return { positions, ang, rad, zs };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      ndc.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ndc.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const viewport = useThree((s) => s.viewport);
  const cool = useMemo(() => new THREE.Color("#bcd8ff"), []);
  const warm = useMemo(() => new THREE.Color("#ffcf9a"), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    warp.current += ((enableWarp ? warpFromScroll() : 0) - warp.current) * 0.08;
    const w = warp.current;
    const arr = pts.geometry.attributes.position.array as Float32Array;

    const spd = (1.0 + w * 11) * Math.min(delta, 0.05);
    const scatter = (1 - Math.min(1, w)) * 1.4;
    const px = (ndc.current.x * viewport.width) / 2;
    const py = (ndc.current.y * viewport.height) / 2;

    for (let i = 0; i < N; i++) {
      let z = zs[i] + spd;
      if (z > NEAR) z -= DEPTH;
      zs[i] = z;

      let x = Math.cos(ang[i]) * rad[i];
      let y = Math.sin(ang[i]) * rad[i];

      if (scatter > 0.01) {
        const dx = x - px;
        const dy = y - py;
        const d2 = dx * dx + dy * dy;
        const R = 2.4;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 0.0001;
          const f = (1 - d / R) * scatter;
          x += (dx / d) * f;
          y += (dy / d) * f;
        }
      }

      const idx = i * 3;
      arr[idx] = x;
      arr[idx + 1] = y;
      arr[idx + 2] = z;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.rotation.z += delta * 0.03 * w;

    if (matRef.current) {
      tmp.copy(cool).lerp(warm, Math.min(1, w));
      matRef.current.color.copy(tmp);
      matRef.current.size = 0.03 + w * 0.035;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.03}
        color="#bcd8ff"
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function SpaceField({ warp = true }: { warp?: boolean }) {
  const [active, setActive] = useState(true);
  useEffect(() => {
    // no warp (e.g. work pages): stars just drift, keep it running always
    if (!warp) {
      setActive(true);
      return;
    }
    const on = () => setActive(window.scrollY < window.innerHeight * 1.4);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [warp]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 8], fov: 62 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Field enableWarp={warp} />
      </Canvas>
    </div>
  );
}
