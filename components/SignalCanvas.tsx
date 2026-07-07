"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Blob() {
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
        color="#ffffff"
        roughness={0.25}
        metalness={0}
        distort={0.45}
        speed={2}
      />
    </mesh>
  );
}

export default function SignalCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* duotone lighting → a pink→violet gradient across the blob */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 2, 4]} intensity={2.6} color="#ff3d81" />
      <directionalLight position={[-3, -1, 2]} intensity={2.3} color="#8b5cff" />
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.9}>
        <Blob />
      </Float>
    </Canvas>
  );
}
