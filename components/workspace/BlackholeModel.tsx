"use client";

import { useEffect, useRef } from "react";
import { Bounds, useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export default function BlackholeModel() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/blackhole/scene.gltf");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    Object.values(actions).forEach((a) => a?.reset().play());
  }, [actions]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} />
      <Bounds fit clip observe margin={1.2}>
        <group ref={group}>
          <primitive object={scene} />
        </group>
      </Bounds>
      <OrbitControls enableDamping dampingFactor={0.08} />
    </>
  );
}

useGLTF.preload("/models/blackhole/scene.gltf");
