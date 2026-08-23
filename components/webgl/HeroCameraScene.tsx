"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useVideoTexture } from "@react-three/drei";
import ArchGateway from "./ArchGateway";
import { scrollState } from "@/lib/scrollState";

const ARCH_Z = -6;
const HERO_PLANE_Z = -2.6;
const VIDEO_LOOP_START = 15;
const VIDEO_ASPECT = 1280 / 576;

// Camera keyframes across the hero → arch-passage journey (t: 0 → 1).
const KEYFRAMES: {
  t: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
}[] = [
  { t: 0, pos: [0, 0.15, 5.4], look: [0, 0, -2.6], fov: 40 },
  { t: 0.35, pos: [0, 0.05, 1.2], look: [0, 0, -4], fov: 39 },
  { t: 0.58, pos: [0, 0, -1.6], look: [0, 0, -6.5], fov: 41 },
  { t: 0.82, pos: [0, 0, -4.8], look: [0, 0, -10], fov: 46 },
  { t: 1, pos: [0, 0, -8.6], look: [0, 0, -15], fov: 50 },
];

function sampleKeyframes(t: number) {
  const clamped = Math.min(1, Math.max(0, t));
  let a = KEYFRAMES[0];
  let b = KEYFRAMES[KEYFRAMES.length - 1];
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    if (clamped >= KEYFRAMES[i].t && clamped <= KEYFRAMES[i + 1].t) {
      a = KEYFRAMES[i];
      b = KEYFRAMES[i + 1];
      break;
    }
  }
  const span = b.t - a.t || 1;
  const local = THREE.MathUtils.smoothstep(clamped, a.t, a.t + span);
  const pos = new THREE.Vector3().lerpVectors(
    new THREE.Vector3(...a.pos),
    new THREE.Vector3(...b.pos),
    local
  );
  const look = new THREE.Vector3().lerpVectors(
    new THREE.Vector3(...a.look),
    new THREE.Vector3(...b.look),
    local
  );
  const fov = THREE.MathUtils.lerp(a.fov, b.fov, local);
  return { pos, look, fov };
}

function HeroPlane() {
  const texture = useVideoTexture("/assets/video/prakrti-nilaya.webm", {
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
    crossOrigin: "anonymous",
  });
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { size } = useThree();

  /* eslint-disable react-hooks/immutability -- imperative <video> element
     control (seeking past the intro title card, looping the B-roll), the
     same pattern the DOM hero video already uses. */
  useEffect(() => {
    const video = texture.image as HTMLVideoElement;
    if (!video) return;

    const handleLoaded = () => {
      video.currentTime = VIDEO_LOOP_START;
    };
    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 0.4) {
        video.currentTime = VIDEO_LOOP_START;
      }
    };

    if (video.readyState >= 1) handleLoaded();
    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [texture]);
  /* eslint-enable react-hooks/immutability */

  // Size the plane like CSS `object-fit: cover`: compute the exact world
  // dimensions the camera's starting frustum spans at the plane's depth, so
  // the video fills the viewport edge-to-edge on any window shape — no dead
  // margins — then crop (not stretch) the texture's UVs to the same ratio.
  const { width, height } = useMemo(() => {
    const distance = KEYFRAMES[0].pos[2] - HERO_PLANE_Z;
    const vFovRad = (KEYFRAMES[0].fov * Math.PI) / 180;
    const frameHeight = 2 * Math.tan(vFovRad / 2) * distance;
    const frameAspect = size.width / size.height;
    return {
      width: frameHeight * frameAspect * 1.08,
      height: frameHeight * 1.08,
    };
  }, [size]);

  /* eslint-disable react-hooks/immutability -- cropping the video texture's
     UVs to match the frame aspect (CSS object-fit: cover, done manually
     since three.js has no built-in equivalent). */
  useEffect(() => {
    const frameAspect = width / height;
    if (frameAspect > VIDEO_ASPECT) {
      texture.repeat.set(1, VIDEO_ASPECT / frameAspect);
    } else {
      texture.repeat.set(frameAspect / VIDEO_ASPECT, 1);
    }
    texture.offset.set((1 - texture.repeat.x) / 2, (1 - texture.repeat.y) / 2);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
  }, [texture, width, height]);
  /* eslint-enable react-hooks/immutability */

  useFrame(() => {
    const heroProgress = Math.min(
      1,
      Math.max(0, scrollState.y / Math.max(1, scrollState.vh))
    );
    const opacity = 1 - THREE.MathUtils.smoothstep(heroProgress, 0.2, 0.62);
    if (materialRef.current) materialRef.current.opacity = opacity;
  });

  return (
    <mesh position={[0, 0, HERO_PLANE_Z]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        toneMapped={false}
      />
    </mesh>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const smoothed = useRef(0);
  const lookTarget = useRef(new THREE.Vector3(0, 0, -2.6));

  // Mutating the three.js camera inside useFrame is the correct, documented
  // R3F pattern for per-frame updates — it runs in the WebGL render loop,
  // outside React's render/commit cycle, so React state would be both
  // unnecessary and far too slow for 60fps camera motion. The React
  // Compiler mutation rule doesn't know about this escape hatch.
  /* eslint-disable react-hooks/immutability */
  useFrame((_, delta) => {
    const raw = Math.min(
      1,
      Math.max(0, scrollState.y / Math.max(1, scrollState.vh))
    );
    smoothed.current = THREE.MathUtils.damp(smoothed.current, raw, 3.4, delta);

    const { pos, look, fov } = sampleKeyframes(smoothed.current);
    camera.position.lerp(pos, 1);
    lookTarget.current.lerp(look, 1);
    camera.lookAt(lookTarget.current);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.damp(camera.fov, fov, 3.4, delta);
      camera.updateProjectionMatrix();
    }
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

export default function HeroCameraScene() {
  return (
    <>
      <fog attach="fog" args={["#f3ece0", 6, 17]} />
      <ambientLight intensity={0.75} color="#f3ece0" />
      <directionalLight
        position={[3, 4, 4]}
        intensity={1.3}
        color="#fffaf0"
      />
      <directionalLight
        position={[-4, 1, -2]}
        intensity={0.35}
        color="#c25a30"
      />
      <directionalLight
        position={[0, -2, -5]}
        intensity={0.2}
        color="#2f7d68"
      />
      <HeroPlane />
      <ArchGateway position={[0, -0.3, ARCH_Z]} />
      <CameraRig />
    </>
  );
}
