"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import HeroCameraScene from "./HeroCameraScene";
import { useCinematicMode } from "@/lib/useCinematicMode";

export default function WorldCanvas() {
  const enabled = useCinematicMode();

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.15, 5.4], fov: 40, near: 0.1, far: 30 }}
      >
        <Suspense fallback={null}>
          <HeroCameraScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
