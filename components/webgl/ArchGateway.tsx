"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * The site's real arch motif (traced from the client's own ironwork/plaster
 * archways) rebuilt as a physical doorway: a slab with an arch-shaped hole
 * the camera travels through. Not a generic 3D primitive — it's the brand
 * mark, in the world.
 */
export default function ArchGateway({
  position,
  color = "#f1ecdd",
}: {
  position: [number, number, number];
  color?: string;
}) {
  const geometry = useMemo(() => {
    const halfWidth = 1.15;
    const straightTop = 0.9;
    const bottom = -3.2;

    const hole = new THREE.Path();
    hole.moveTo(-halfWidth, bottom);
    hole.lineTo(-halfWidth, straightTop);
    hole.absarc(0, straightTop, halfWidth, Math.PI, 0, true);
    hole.lineTo(halfWidth, bottom);
    hole.lineTo(-halfWidth, bottom);
    hole.closePath();

    const outer = new THREE.Shape();
    outer.moveTo(-5, bottom);
    outer.lineTo(-5, 5);
    outer.lineTo(5, 5);
    outer.lineTo(5, bottom);
    outer.closePath();
    outer.holes.push(hole);

    const geo = new THREE.ExtrudeGeometry(outer, {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 3,
      curveSegments: 48,
    });
    geo.center();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} position={position} receiveShadow castShadow>
      <meshStandardMaterial color={color} roughness={0.92} metalness={0} />
    </mesh>
  );
}
