"use client";

import { Suspense, useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Flower3D from "./Flower3D";
import { useCinematicMode } from "@/lib/useCinematicMode";

type Pointer = { x: number; y: number };

function CameraRig({ pointer }: { pointer: RefObject<Pointer> }) {
  const { camera } = useThree();

  // Mutating the three.js camera inside useFrame is the correct, documented
  // R3F pattern for per-frame updates (see HeroCameraScene's CameraRig) —
  // the React Compiler mutation rule doesn't know about this escape hatch.
  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      pointer.current.x * 1,
      3,
      delta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      pointer.current.y * 0.6,
      3,
      delta
    );
    camera.lookAt(0, 0, 0);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

/**
 * The Maintenance section's real 3D bloom — where "Design & Execution"
 * reads as structure and typography, "Maintenance" is where the brand's
 * living half takes over. A section-scoped canvas, same recipe as the
 * Proof section's flowers, gated to desktop + motion-safe.
 */
export default function MaintenanceBloomCanvas({
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
        camera={{ position: [0, 0, 10], fov: 30, near: 0.1, far: 30 }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#17140f", 9, 23]} />
          <ambientLight intensity={0.24} color="#3a362c" />
          <directionalLight position={[3, 4, 5]} intensity={1.3} color="#f1ecdd" />
          <directionalLight position={[-4, 1, 2]} intensity={0.4} color="#d97a4e" />
          <directionalLight position={[0, -2, 3]} intensity={0.2} color="#4ca48e" />
          <Flower3D position={[-5.4, 2.4, -3]} color="#4ca48e" scale={0.34} spinSpeed={0.03} />
          <Flower3D position={[5.6, -2.6, -3.6]} color="#d97a4e" scale={0.4} spinSpeed={-0.022} />
          <Flower3D position={[0.4, 3.4, -4.2]} color="#dd939a" scale={0.3} spinSpeed={0.026} />
          <CameraRig pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}
