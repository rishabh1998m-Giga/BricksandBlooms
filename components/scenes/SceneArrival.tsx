"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ArchMotif from "@/components/ArchMotif";

const VIDEO_LOOP_START = 15;

export default function SceneArrival() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

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
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative flex h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-bg"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
        poster="/prakrti-nilaya-poster.png"
      >
        <source src="/hero-prakrti-nilaya.webm" type="video/webm" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/35 to-bg/85" />

      <ArchMotif
        animate
        className="pointer-events-none absolute right-[-8vw] top-1/2 h-[70vh] w-auto -translate-y-1/2 text-terracotta opacity-40 md:right-[-2vw]"
      />

      <div className="relative z-10 flex max-w-5xl flex-col items-center px-6 text-center">
        <p
          data-reveal
          className="font-ui text-[0.7rem] font-semibold tracking-[0.32em] text-teal uppercase"
        >
          Architects · Interiors · Landscape
        </p>

        <h1
          data-reveal
          className="mt-7 text-balance font-display text-[3.4rem] font-black leading-[0.92] tracking-[-0.02em] text-fg sm:text-[5.4rem] md:text-[7.2rem] lg:text-[8.4rem]"
        >
          Nature&rsquo;s Beauty
          <br />
          <span className="italic text-terracotta">Delivered</span>
        </h1>

        <p
          data-reveal
          className="mt-8 max-w-xl text-balance font-body text-xl text-fg/85 sm:text-2xl"
        >
          Transforming outdoor spaces with thoughtful landscape design &amp;
          execution.
        </p>

        <p
          data-reveal
          className="mt-6 font-ui text-[0.68rem] font-medium tracking-[0.24em] text-muted uppercase"
        >
          Design · Consultation · Execution · Project Management
        </p>
      </div>

      <div
        data-reveal
        className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-ui text-[0.62rem] font-medium tracking-[0.28em] text-fg/60 uppercase">
          Scroll
        </span>
        <span className="h-10 w-px animate-pulse bg-fg/40" />
      </div>
    </section>
  );
}
