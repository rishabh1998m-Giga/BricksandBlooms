"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Forces GSAP to recompute all ScrollTrigger start/end positions once every
 * scene has mounted and pinned. Sequential pins across sibling components
 * can be measured before later pin-spacers exist in the DOM, so a refresh
 * after mount keeps every trigger's offsets accurate.
 */
export default function ScrollRefresh() {
  useEffect(() => {
    // Sequential pinned sections can be measured before earlier siblings'
    // pin-spacers exist, leaving stale start/end offsets. Sorting and
    // refreshing converges the whole chain, but needs a couple of passes
    // since each scene's correct offset depends on the one before it.
    const timers = [250, 800, 2000].map((delay) =>
      setTimeout(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh(true);
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return null;
}
