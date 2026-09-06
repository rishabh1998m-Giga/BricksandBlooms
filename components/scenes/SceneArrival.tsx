"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArchMotif from "@/components/ArchMotif";
import { useCinematicMode } from "@/lib/useCinematicMode";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_LOOP_START = 15;

export default function SceneArrival() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const cinematic = useCinematicMode();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      const freezeOnPoster = () => {
        video.pause();
        video.currentTime = 90;
      };
      if (video.readyState >= 1) freezeOnPoster();
      video.addEventListener("loadedmetadata", freezeOnPoster);
      return () => video.removeEventListener("loadedmetadata", freezeOnPoster);
    }

    const handleLoaded = () => {
      video.currentTime = VIDEO_LOOP_START;
      video.play().catch(() => {});
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
  }, []);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (prefersReduced) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }
      gsap.set(targets, { opacity: 0, y: 26 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.3,
      });

      // The camera rig (see components/webgl) owns the cinematic push-in
      // through the arch on desktop; the DOM copy just needs to clear out
      // of the way early so it doesn't fight the passage visually.
      const copy = document.querySelector<HTMLElement>("[data-hero-copy]");
      if (copy) {
        gsap.to(copy, {
          opacity: 0,
          y: -50,
          scale: 0.94,
          ease: "power1.in",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "24% top",
            scrub: 0.3,
          },
        });
      }
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className={`relative h-[100dvh] w-full overflow-hidden ${
        cinematic ? "" : "bg-bg"
      }`}
    >
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          cinematic ? "opacity-0" : "opacity-100"
        }`}
        muted
        playsInline
        preload="auto"
        poster="/assets/video/prakrti-nilaya-poster.png"
      >
        <source src="/assets/video/prakrti-nilaya.webm" type="video/webm" />
      </video>

      {/* Scrim only where the copy sits, so the video reads clearly across
          the rest of the frame instead of being dimmed edge to edge. Stops
          are pulled in tight so the whole copy block — eyebrow included —
          sits on solid dark ground, not just the headline. */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-bg/90 from-0% via-bg/70 via-35% to-transparent to-60% transition-opacity duration-700 ${
          cinematic ? "opacity-60" : "opacity-100"
        }`}
      />

      {!cinematic && (
        <ArchMotif
          animate
          className="pointer-events-none absolute right-[-8vw] top-1/2 h-[70vh] w-auto -translate-y-1/2 text-terracotta opacity-40 md:right-[-2vw]"
        />
      )}

      <div
        data-hero-copy
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start px-6 pb-14 sm:px-10 sm:pb-16 md:px-14 md:pb-20"
      >
        <p
          data-reveal
          className="font-display text-[0.72rem] font-semibold tracking-[0.22em] text-teal uppercase"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.75)" }}
        >
          Architects · Interiors · Landscape
        </p>

        <h1
          data-reveal
          className="mt-4 max-w-xl text-balance font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.01em] text-fg sm:text-[2.6rem] md:text-[3.2rem]"
        >
          New way of <span className="text-terracotta">Living</span>
        </h1>
      </div>

      <div
        data-reveal
        className="absolute bottom-9 right-6 z-10 flex flex-col items-center sm:right-10 md:right-14"
        aria-hidden="true"
      >
        <span className="h-10 w-px animate-pulse bg-fg/40" />
      </div>
    </section>
  );
}
