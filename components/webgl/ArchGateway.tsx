"use client";

import { useMemo } from "react";
import * as THREE from "three";

const HALF_WIDTH = 0.95;
const STRAIGHT_TOP = 0.75;
const HOLE_BOTTOM = -2.4;
const HOLE_TOP = STRAIGHT_TOP + HALF_WIDTH;
// The hole's own vertical center — independent of the outer slab's extent,
// so growing the slab (for edge-to-edge coverage) never drags the doorway
// opening out of the camera's view the way geometry.center()'s bounding-box
// math would if it centered on the outer rectangle instead.
const HOLE_CENTER_Y = (HOLE_BOTTOM + HOLE_TOP) / 2;
const OUTER_HALF_SPAN = 9;
const OUTER_BOTTOM = HOLE_CENTER_Y - OUTER_HALF_SPAN;
const OUTER_TOP = HOLE_CENTER_Y + OUTER_HALF_SPAN;
const DEPTH = 0.5;
const CENTER_Z = DEPTH / 2;

function ArchRimGlow({ color = "#d97a4e" }: { color?: string }) {
  const geometry = useMemo(() => {
    const path2d = new THREE.Path();
    path2d.moveTo(-HALF_WIDTH, HOLE_BOTTOM);
    path2d.lineTo(-HALF_WIDTH, STRAIGHT_TOP);
    path2d.absarc(0, STRAIGHT_TOP, HALF_WIDTH, Math.PI, 0, true);
    path2d.lineTo(HALF_WIDTH, HOLE_BOTTOM);

    const points = path2d
      .getPoints(48)
      .map(
        (p) =>
          new THREE.Vector3(
            p.x,
            p.y - HOLE_CENTER_Y,
            DEPTH - CENTER_Z + 0.03
          )
      );
    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom");
    return new THREE.TubeGeometry(curve, 96, 0.035, 12, false);
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#1a1712"
        emissive={color}
        emissiveIntensity={2.2}
        roughness={0.5}
        toneMapped={false}
        fog={false}
      />
    </mesh>
  );
}

/**
 * The site's real arch motif (traced from the client's own ironwork/plaster
 * archways) rebuilt as a physical doorway: a dark shadowed threshold with a
 * warm glowing edge tracing the opening, that the camera travels through.
 * Not a generic 3D primitive — it's the brand mark, in the world.
 */
export default function ArchGateway({
  position,
  color = "#171310",
}: {
  position: [number, number, number];
  color?: string;
}) {
  const geometry = useMemo(() => {
    const hole = new THREE.Path();
    hole.moveTo(-HALF_WIDTH, HOLE_BOTTOM);
    hole.lineTo(-HALF_WIDTH, STRAIGHT_TOP);
    hole.absarc(0, STRAIGHT_TOP, HALF_WIDTH, Math.PI, 0, true);
    hole.lineTo(HALF_WIDTH, HOLE_BOTTOM);
    hole.lineTo(-HALF_WIDTH, HOLE_BOTTOM);
    hole.closePath();

    const outer = new THREE.Shape();
    outer.moveTo(-9, OUTER_BOTTOM);
    outer.lineTo(-9, OUTER_TOP);
    outer.lineTo(9, OUTER_TOP);
    outer.lineTo(9, OUTER_BOTTOM);
    outer.closePath();
    outer.holes.push(hole);

    const geo = new THREE.ExtrudeGeometry(outer, {
      depth: DEPTH,
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
    <group position={position}>
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial color={color} roughness={0.95} metalness={0} />
      </mesh>
      <ArchRimGlow />
    </group>
  );
}
