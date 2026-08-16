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
      className={`relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden ${
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

      <div
        className={`absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/35 to-bg/85 transition-opacity duration-700 ${
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
        className="relative z-10 flex max-w-5xl flex-col items-center px-6 text-center"
      >
        <p
          data-reveal
          className="font-display text-[0.68rem] tracking-[0.22em] text-teal uppercase"
        >
          Architects · Interiors · Landscape
        </p>

        <h1
          data-reveal
          className="mt-6 text-balance font-display text-[3.2rem] font-bold leading-[0.94] tracking-[-0.02em] text-fg sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem]"
        >
          Nature&rsquo;s Beauty <span className="text-terracotta">Delivered</span>
        </h1>

        <p
          data-reveal
          className="mt-6 max-w-xl text-balance font-body text-lg text-fg/85 sm:text-xl"
        >
          Transforming outdoor spaces with thoughtful landscape design &amp;
          execution.
        </p>

        <p
          data-reveal
          className="mt-5 font-display text-[0.68rem] tracking-[0.18em] text-muted uppercase"
        >
          Design · Consultation · Execution · Project Management
        </p>
      </div>

      <div
        data-reveal
        className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-display text-[0.62rem] tracking-[0.2em] text-fg/60 uppercase">
          Scroll
        </span>
        <span className="h-10 w-px animate-pulse bg-fg/40" />
      </div>
    </section>
  );
}
