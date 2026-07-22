"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useInView } from "@/components/v4/useInView";

function Galaxy({ zoom }: { zoom: { current: number } }) {
  const group = useRef<THREE.Group>(null);
  const ptr = useRef({ x: 0, y: 0 });
  const eased = useRef({ x: 0, y: 0 });
  const spin = useRef(0);
  const ez = useRef(1);

  const { positions, colors } = useMemo(() => {
    const count = 80000;
    const radiusMax = 20;       // was 15
    const spiralArms = 2;       // was 4 (branchAngle % 4)
    const spiralTightness = 2.5; // was hardcoded 1.2
    const randomness = 0.3;
    const randomnessPower = 2;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorInside = new THREE.Color(0x7fdd40);
    const colorOutside = new THREE.Color(0x0099ff);

  for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * radiusMax;
        const spinAngle = radius * spiralTightness;
        const branchAngle = ((i % spiralArms) / spiralArms) * Math.PI * 2;

        // this is the missing piece: random offset per axis, biased toward 0
        const randomX =
          Math.pow(Math.random(), randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          randomness *
          radius;
        const randomY =
          Math.pow(Math.random(), randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          randomness *
          radius;
        const randomZ =
          Math.pow(Math.random(), randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          randomness *
          radius;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        const c = colorInside.clone().lerp(colorOutside, radius / radiusMax);
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
      }
      return { positions, colors };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    spin.current += 0.0009; // steady base rotation
    // ease the galaxy toward the cursor (yaw + tilt)
    eased.current.x += (ptr.current.x * 0.5 - eased.current.x) * 0.05;
    eased.current.y += (ptr.current.y * 0.35 - eased.current.y) * 0.05;
    g.rotation.y = spin.current + eased.current.x;
    g.rotation.x = eased.current.y;
    // ease the scroll-driven zoom
    ez.current += (zoom.current - ez.current) * 0.1;
    g.scale.setScalar(ez.current);
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.01}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>
    </group>
  );
}

export default function GalaxyBackground() {
  const { ref, inView } = useInView();
  const zoom = useRef(1);

  // while the cursor is within the galaxy band, the wheel zooms it and page
  // scroll is suppressed; move the cursor off the band to scroll again.
  // The work content sits on top of the galaxy, so hover is decided by testing
  // the cursor position against the band rect (not mouseenter on the element).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let mx = -9999, my = -9999;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const inside = () => {
      const b = el.getBoundingClientRect();
      const shrink = b.height * 0.2; // shrinks 20% off top and bottom = 60% effective height
      const top = b.top + shrink;
      const bottom = b.bottom - shrink;
      return mx >= b.left && mx <= b.right && my >= top && my <= bottom;
    };
    const MAX = 2.6, MIN = 0.4;
    const onWheel = (e: WheelEvent) => {
      if (!inside()) return;
      const zoomingIn = e.deltaY > 0;
      // at the zoom limits, let the wheel fall through to page scroll
      if ((zoomingIn && zoom.current >= MAX) || (!zoomingIn && zoom.current <= MIN)) {
        return;
      }
      // capture-phase + stopImmediatePropagation blocks Lenis's smooth-wheel
      e.preventDefault();
      e.stopImmediatePropagation();
      const f = zoomingIn ? 1.08 : 0.92;
      zoom.current = Math.min(MAX, Math.max(MIN, zoom.current * f));
    };
    window.addEventListener("mousemove", onMove);
    // capture:true so this runs before Lenis's window wheel listener
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("wheel", onWheel, { capture: true } as EventListenerOptions);
    };
  }, [ref]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" style={{ background: "#000008" }}>
      <Canvas
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 14, 34], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Galaxy zoom={zoom} />
      </Canvas>
      {/* fade to black at edges + bottom so it blends with the section */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.85), transparent 25%, transparent 75%, rgba(0,0,0,0.85)), linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 45%, rgba(0,0,0,0.96))",
        }}
      />
    </div>
  );
}
