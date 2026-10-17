"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArchMotif from "@/components/ArchMotif";
import FlowerBud from "@/components/FlowerBud";
import { useCinematicMode } from "@/lib/useCinematicMode";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_LOOP_START = 15;

export default function SceneArrival() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
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

      // Everything that dresses up the frame (aurora wash, grain, the
      // floating stat chip, the glass copy panel) clears out together as
      // you scroll in, the same way the copy alone used to — so the 3D
      // arch passage (owned by the WebGL camera rig) takes over a clean
      // frame instead of fighting a still-visible overlay.
      const fadeTargets = gsap.utils.toArray<HTMLElement>("[data-hero-copy]");
      if (fadeTargets.length) {
        gsap.to(fadeTargets, {
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

      // A slow, idle bob on the floating stat chip — alive even before
      // anyone touches the page, restrained per this site's house rule
      // that luxury motion is slow motion.
      if (chipRef.current) {
        gsap.to(chipRef.current, {
          y: -8,
          duration: 2.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // Pointer-driven 3D tilt — the copy panel and the stat chip sit on
      // two different depth planes and lean opposite the cursor by
      // different amounts, the classic layered-parallax read of "this is
      // a real 3D scene," without touching the WebGL layer at all. Fine
      // pointer only; touch devices keep the idle bob above instead.
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      if (isFinePointer && (panelRef.current || chipRef.current)) {
        const panelX = panelRef.current
          ? gsap.quickTo(panelRef.current, "rotationX", { duration: 0.7, ease: "power3.out" })
          : null;
        const panelY = panelRef.current
          ? gsap.quickTo(panelRef.current, "rotationY", { duration: 0.7, ease: "power3.out" })
          : null;
        const chipX = chipRef.current
          ? gsap.quickTo(chipRef.current, "rotationX", { duration: 0.9, ease: "power3.out" })
          : null;
        const chipY = chipRef.current
          ? gsap.quickTo(chipRef.current, "rotationY", { duration: 0.9, ease: "power3.out" })
          : null;

        const handleMove = (e: PointerEvent) => {
          const rect = rootRef.current?.getBoundingClientRect();
          if (!rect) return;
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          panelX?.(py * -6);
          panelY?.(px * 8);
          chipX?.(py * 10);
          chipY?.(px * -14);
        };
        const handleLeave = () => {
          panelX?.(0);
          panelY?.(0);
          chipX?.(0);
          chipY?.(0);
        };

        const root = rootRef.current;
        root?.addEventListener("pointermove", handleMove);
        root?.addEventListener("pointerleave", handleLeave);
        return () => {
          root?.removeEventListener("pointermove", handleMove);
          root?.removeEventListener("pointerleave", handleLeave);
        };
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
      style={{ perspective: "1600px" }}
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
          the rest of the frame instead of being dimmed edge to edge. The
          div itself is clipped to the bottom half — rather than spanning
          the full frame with custom gradient-stop percentages — so there
          is no ambiguity about the top of the hero staying scrim-free. */}
      <div
        className={`absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-bg/95 to-transparent transition-opacity duration-700 ${
          cinematic ? "opacity-70" : "opacity-100"
        }`}
      />

      {/* A soft wash of the brand's own accent colours at the edges only —
          the video itself is untouched; this just tints the frame around
          it, "soft-light" blended so the footage still reads through
          rather than being flattened to a solid colour. */}
      <div
        data-hero-copy
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full mix-blend-soft-light blur-[130px]"
          style={{ background: "var(--color-teal)", opacity: 0.28 }}
        />
        <div
          className="absolute -bottom-48 -right-32 h-[38rem] w-[38rem] rounded-full mix-blend-soft-light blur-[140px]"
          style={{ background: "var(--color-terracotta)", opacity: 0.32 }}
        />
        <div
          className="absolute right-[18%] top-[18%] h-64 w-64 rounded-full mix-blend-soft-light blur-[100px]"
          style={{ background: "var(--color-blush)", opacity: 0.22 }}
        />
      </div>

      {/* A faint film-grain texture — the one cheap trick that keeps a
          colour wash over real footage reading as cinematic rather than
          like a flat digital gradient. */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay"
        aria-hidden="true"
      >
        <filter id="heroGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#heroGrain)" />
      </svg>

      {!cinematic && (
        <ArchMotif
          animate
          className="pointer-events-none absolute right-[-8vw] top-1/2 h-[70vh] w-auto -translate-y-1/2 text-terracotta opacity-40 md:right-[-2vw]"
        />
      )}

      {/* Floating credibility chip — a second depth plane above the video,
          tilting opposite the copy panel under the cursor so the frame
          reads as layered 3D space rather than flat text on a backdrop. */}
      <div
        ref={chipRef}
        data-hero-copy
        data-reveal
        className="absolute right-6 top-24 z-10 hidden items-center gap-2.5 rounded-full border border-fg/15 bg-bg/40 py-2 pl-2.5 pr-4 shadow-[0_8px_30px_rgba(43,36,28,0.12)] backdrop-blur-xl sm:right-10 sm:flex md:right-14 md:top-28"
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg width="22" height="22" viewBox="-4.5 -4.5 9 9" className="text-teal" aria-hidden="true">
          <FlowerBud color="currentColor" />
        </svg>
        <p className="font-display text-[0.78rem] font-medium tracking-[-0.005em] text-fg">
          10,000<span className="text-terracotta">+</span>
          <span className="ml-1.5 font-body text-[0.7rem] font-normal text-muted">
            plants installed
          </span>
        </p>
      </div>

      {/* The glass copy panel — the frame's third depth plane, a floating
          surface the eye can actually read as sitting in front of the
          video rather than printed flat on top of it. */}
      <div
        data-hero-copy
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start px-6 pb-14 sm:px-10 sm:pb-16 md:px-14 md:pb-20"
      >
        <div
          ref={panelRef}
          className="max-w-xl rounded-[2rem] border border-fg/10 bg-bg/35 p-6 shadow-[0_20px_60px_rgba(43,36,28,0.18)] backdrop-blur-xl sm:p-8"
          style={{ transformStyle: "preserve-3d" }}
        >
          <p
            data-reveal
            className="font-display text-[0.72rem] font-semibold tracking-[0.22em] text-teal uppercase"
          >
            Architects · Interiors · Landscape
          </p>

          <h1
            data-reveal
            className="mt-4 max-w-xl text-balance font-display text-[2rem] font-medium leading-[1.05] tracking-[-0.01em] text-fg sm:text-[2.6rem] md:text-[3.2rem]"
          >
            New way of <span className="text-terracotta">Living</span>
          </h1>

          <div data-reveal className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/services"
              className="rounded-full border border-fg/25 bg-bg/40 px-6 py-3 font-display text-[0.75rem] font-medium tracking-[0.02em] text-fg backdrop-blur-md transition-colors duration-300 hover:bg-bg/70"
            >
              Our Work
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-terracotta px-6 py-3 font-display text-[0.75rem] font-medium tracking-[0.02em] text-bg shadow-[0_10px_30px_rgba(192,95,56,0.35)] transition-transform duration-300 hover:scale-[1.03]"
            >
              Book Appointment
            </Link>
          </div>
        </div>
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
