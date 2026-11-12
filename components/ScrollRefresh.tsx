"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollRefresh() {
  useEffect(() => {
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
