"use client";

import { Suspense, useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Flower3D from "./Flower3D";
import { useCinematicMode } from "@/lib/useCinematicMode";

type Pointer = { x: number; y: number };

function CameraRig({ pointer }: { pointer: RefObject<Pointer> }) {
  const { camera } = useThree();

  /* eslint-disable react-hooks/immutability -- per-frame camera parallax,
     same pattern as HeroCameraScene's CameraRig. */
  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      pointer.current.x * 1.1,
      3,
      delta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      pointer.current.y * 0.7,
      3,
      delta
    );
    camera.lookAt(0, 0, 0);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

/**
 * A small, section-scoped WebGL layer (not the fixed viewport-wide canvas
 * the hero uses) — two real 3D flowers drifting in soft depth behind the
 * stats, with the camera reading cursor position over the section itself.
 */
export default function ProofBloomCanvas({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const enabled = useCinematicMode();
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !enabled) return;

    const handleMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      pointer.current.x = (e.clientX - rect.left) / rect.width - 0.5;
      pointer.current.y = -((e.clientY - rect.top) / rect.height - 0.5);
    };
    section.addEventListener("pointermove", handleMove);
    return () => section.removeEventListener("pointermove", handleMove);
  }, [sectionRef, enabled]);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 10], fov: 28, near: 0.1, far: 30 }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#0e0c09", 9, 22]} />
          <ambientLight intensity={0.22} color="#3a362c" />
          <directionalLight position={[3, 4, 5]} intensity={1.4} color="#f1ecdd" />
          <directionalLight position={[-4, 1, 2]} intensity={0.4} color="#d97a4e" />
          <directionalLight position={[0, -2, 3]} intensity={0.18} color="#4ca48e" />
          <Flower3D
            position={[3.6, 2.2, -1]}
            color="#4ca48e"
            scale={0.6}
            spinSpeed={0.035}
          />
          <Flower3D
            position={[-3.7, -2.3, -1.3]}
            color="#d97a4e"
            scale={0.75}
            spinSpeed={-0.024}
          />
          <CameraRig pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
