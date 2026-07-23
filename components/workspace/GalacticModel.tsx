"use client";

import { useEffect, useMemo, useRef } from "react";
import { Bounds, useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export default function GalacticModel() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/galactic-incident-lite/scene.glb");
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // play whatever baked animation shipped with the model (a formation /
    // dispersal of the point cloud, going by the "Galactic Incident" title)
    // — three.js's default loop mode is LoopRepeat/Infinity, so left alone
    // this snaps back to the starting cluster and replays forever, which
    // combined with Bounds re-fitting the camera each time reads as the
    // whole thing violently "blinking". Play it once and hold the last frame.
    Object.values(actions).forEach((a) => {
      if (!a) return;
      a.reset();
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = true;
      a.play();
    });
  }, [actions]);

  // the model ships with no material size/blending set for its points, so
  // the default THREE.PointsMaterial (size 1, opaque) renders every point as
  // a huge, fully-opaque splat — hence the blown-out white blob and the
  // slowdown (that's massive overdraw, not point count). Derive a size from
  // the model's own scale instead of a hardcoded guess, since it's the only
  // way to know what "small" means for this asset — sized up a bit from the
  // original 2.95M-point version, since decimating to 491K points spread the
  // same points out more and needs slightly bigger splats to stay full-looking.
  //
  // blending is additive, not normal: with normal blending, overlapping
  // semi-transparent points stack toward flat opaque white and wash out the
  // model's actual vertex colors (which do range white -> warm orange/red).
  // Additive blending lets brightness/color accumulate instead — that's what
  // gives Sketchfab-style renders their glowing, colorful falloff instead of
  // a flat white blob (still no substitute for real bloom post-processing,
  // which Sketchfab's viewer applies and we don't, but this gets much closer).
  useMemo(() => {
    const sphere = new THREE.Box3().setFromObject(scene).getBoundingSphere(new THREE.Sphere());
    const size = Math.max(0.08, sphere.radius * 0.0045);
    scene.traverse((obj) => {
      if (!(obj as THREE.Points).isPoints) return;
      const pts = obj as THREE.Points;
      pts.material = new THREE.PointsMaterial({
        size,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        depthWrite: false, // avoid dark cutouts where transparent points depth-test each other
        blending: THREE.AdditiveBlending,
      });
    });
  }, [scene]);

  return (
    <>
      <Bounds fit clip observe margin={1.2}>
        <group ref={group}>
          <primitive object={scene} />
        </group>
      </Bounds>
      <OrbitControls enableDamping dampingFactor={0.08} />
    </>
  );
}

useGLTF.preload("/models/galactic-incident-lite/scene.glb");
