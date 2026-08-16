"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DESKTOP_QUERY = "(min-width: 768px) and (pointer: fine)";

function subscribe(callback: () => void) {
  const mqReduced = window.matchMedia(REDUCED_MOTION_QUERY);
  const mqDesktop = window.matchMedia(DESKTOP_QUERY);
  mqReduced.addEventListener("change", callback);
  mqDesktop.addEventListener("change", callback);
  return () => {
    mqReduced.removeEventListener("change", callback);
    mqDesktop.removeEventListener("change", callback);
  };
}

function getSnapshot() {
  const prefersReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
  const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
  return !prefersReduced && isDesktop;
}

function getServerSnapshot() {
  return false;
}

/**
 * True when the viewer can meaningfully benefit from the WebGL camera
 * layer: a fine-pointer desktop viewport with no reduced-motion preference.
 * Mobile and reduced-motion always get the plain DOM fallback instead.
 */
export function useCinematicMode() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
