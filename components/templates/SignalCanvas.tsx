"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment, Lightformer } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Blob({ tint }: { tint: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const pointer = useThree((s) => s.pointer);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;

    // ease rotation toward the cursor, with a slow idle drift
    m.rotation.y += (pointer.x * 0.8 - m.rotation.y) * 0.04 + 0.0015;
    m.rotation.x += (-pointer.y * 0.5 - m.rotation.x) * 0.04;

    // gentle breathing scale
    m.scale.setScalar(2 + Math.sin(t * 0.8) * 0.06);
  });

  return (
    <mesh ref={mesh} position={[1.6, 0, 0]}>
      <icosahedronGeometry args={[1, 24]} />
      <MeshDistortMaterial
        color={tint}
        metalness={1}
        roughness={0.2}
        distort={0.42}
        speed={2}
      />
    </mesh>
  );
}

export default function SignalCanvas({ tint = "#cdd2d8" }: { tint?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 3, 3]} intensity={1.4} color="#ffffff" />

      {/* reflections for the chrome — built from light-formers, no external HDR */}
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 3, 2]} scale={[7, 7, 1]} color="#ffffff" />
        <Lightformer intensity={1.4} position={[-4, 0, 2]} scale={[3, 8, 1]} color="#c9d4e0" />
        <Lightformer intensity={1.1} position={[4, -2, 2]} scale={[5, 4, 1]} color="#ffffff" />
        <Lightformer intensity={0.8} position={[0, -4, -3]} scale={[8, 4, 1]} color="#aeb6c2" />
      </Environment>

      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.9}>
        <Blob tint={tint} />
      </Float>
    </Canvas>
  );
}
