"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  MeshDistortMaterial,
  Float,
  Environment,
  Lightformer,
} from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

function docProgress() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  return max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;
}

function Blob() {
  const mesh = useRef<THREE.Mesh>(null);
  const ptr = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    const p = docProgress();

    // 1. Your existing movement, rotation, and scaling logic
    m.rotation.y = p * Math.PI * 2.2 + t * 0.05 + ptr.current.x * 0.3;
    m.rotation.x = p * Math.PI * 0.7 - ptr.current.y * 0.2;
    m.position.x = 1.9 - p * 3.6;
    m.position.y = -p * 1.4;
    m.scale.setScalar(2 + Math.sin(t * 0.8) * 0.05 + p * 0.7);

    // 2. New Dynamic Color Logic
    const mat = m.material as THREE.MeshStandardMaterial;
    if (mat && mat.color) {
      // Tying the hue to BOTH time and scroll progress gives a gorgeous organic drift
      // Lower numbers like 0.03 mean a slower, more elegant color evolution
      const hue = (t * 0.03 + p * 0.2) % 1; 
      
      // setHSL arguments: (hue, saturation, lightness)
      // Saturation at 0.35 keeps it silver/metallic instead of neon plastic
      // Lightness at 0.75 keeps it incredibly bright and clean
      mat.color.setHSL(hue, 0.35, 0.75);
    }
  });

  return (
    <mesh ref={mesh} position={[1.9, 0, 0]}>
      <icosahedronGeometry args={[1, 24]} />
      {/* Increased metalness to 0.4 so it catches your Lightformers beautifully */}
      <MeshDistortMaterial
        color="#c2dce0"
        metalness={0.4} 
        roughness={0.1}
        distort={0.42}
        speed={3}
      />
    </mesh>
  );
}

export default function ScrollScene() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[3, 3, 3]} intensity={1.4} color="#ffffff" />
        <Environment resolution={256}>
          <Lightformer intensity={2.2} position={[0, 3, 2]} scale={[7, 7, 1]} color="#ffffff" />
          <Lightformer intensity={1.4} position={[-4, 0, 2]} scale={[3, 8, 1]} color="#c9d4e0" />
          <Lightformer intensity={1.1} position={[4, -2, 2]} scale={[5, 4, 1]} color="#ffffff" />
          <Lightformer intensity={0.8} position={[0, -4, -3]} scale={[8, 4, 1]} color="#aeb6c2" />
        </Environment>
        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.7}>
          <Blob />
        </Float>
      </Canvas>
    </div>
  );
}