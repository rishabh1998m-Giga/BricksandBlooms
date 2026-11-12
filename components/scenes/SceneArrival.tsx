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

const HEADLINE_LINES = [
  { words: ["New", "way", "of"], accent: false },
  { words: ["Living"], accent: true },
];

export default function SceneArrival() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ctaRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const badgeRingRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const cinematic = useCinematicMode();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // On desktop, HeroCameraScene's WebGL plane (see components/webgl)
    // loads and decodes this exact same file itself. Also loading and
    // playing it here — just invisibly, via opacity — fetched and decoded
    // the same ~30MB video twice at once, which was a real contributor to
    // the hero feeling slow/stuck on first load. The <source> below is
    // omitted entirely in cinematic mode so this element never starts a
    // request for it; .load() here (with no source left in the DOM)
    // explicitly aborts any request already in flight from the brief
    // window before useCinematicMode resolves on the client, since it
    // starts as false on the very first render.
    if (cinematic) {
      video.pause();
      video.load();
      return;
    }

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
  }, [cinematic]);

  // The WebGL hero plane has no native "poster" of its own the way a plain
  // <video> does, so without this, desktop visitors saw nothing at all
  // (just the page background) for however long the video took to start
  // decoding. This poster image sits in front of the WebGL canvas and
  // fades away the moment HeroCameraScene's own video actually starts
  // playing (see the "hero-video-ready" event dispatched there) — with a
  // fallback timer in case that event is ever missed (e.g. autoplay
  // blocked), so it never gets stuck covering a working video.
  useEffect(() => {
    if (!cinematic) return;
    const el = posterRef.current;
    if (!el) return;

    let hidden = false;
    const hide = () => {
      if (hidden) return;
      hidden = true;
      gsap.to(el, { opacity: 0, duration: 0.6, ease: "power2.out" });
    };

    window.addEventListener("hero-video-ready", hide);
    const fallback = setTimeout(hide, 4500);
    return () => {
      window.removeEventListener("hero-video-ready", hide);
      clearTimeout(fallback);
    };
  }, [cinematic]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
      const ctas = ctaRefs.current.filter(Boolean) as HTMLAnchorElement[];
      const simpleTargets = gsap.utils.toArray<HTMLElement>(
        "[data-reveal-simple]"
      );

      if (prefersReduced) {
        gsap.set(simpleTargets, { opacity: 1, y: 0 });
        gsap.set(words, { opacity: 1, rotationX: 0 });
        return;
      }

      gsap.set(simpleTargets, { opacity: 0, y: 26 });
      gsap.to(simpleTargets, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.3,
      });

      // The headline arrives as if each word is a hinged flap swinging up
      // out of the frame — real 3D rotation, not a fade — the single
      // biggest "this page was designed, not templated" first impression.
      gsap.set(words, {
        opacity: 0,
        rotationX: -100,
        transformPerspective: 500,
        transformOrigin: "50% 100%",
      });
      gsap.to(words, {
        opacity: 1,
        rotationX: 0,
        duration: 1.1,
        ease: "back.out(1.6)",
        stagger: 0.07,
        delay: 0.45,
      });

      // Everything that dresses up the frame (aurora wash, grain, the
      // floating stat chip, the headline + CTAs) clears out together as
      // you scroll in, so the 3D arch passage (owned by the WebGL camera
      // rig) takes over a clean frame instead of fighting a still-visible
      // overlay.
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
      // anyone touches the page.
      if (chipRef.current) {
        gsap.to(chipRef.current, {
          y: -8,
          duration: 2.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // The scroll badge spins slowly and continuously — a small signature
      // detail, not tied to the cursor or scroll position at all.
      if (badgeRingRef.current) {
        gsap.to(badgeRingRef.current, {
          rotate: 360,
          duration: 16,
          ease: "none",
          repeat: -1,
        });
      }

      if (!isFinePointer) return;

      // Pointer-driven 3D tilt on the copy block and the stat chip — two
      // depth planes leaning opposite the cursor by different amounts, the
      // classic layered-parallax read of "this is a real 3D scene,"
      // without touching the WebGL layer at all.
      const copyX = copyRef.current
        ? gsap.quickTo(copyRef.current, "rotationX", { duration: 0.7, ease: "power3.out" })
        : null;
      const copyY = copyRef.current
        ? gsap.quickTo(copyRef.current, "rotationY", { duration: 0.7, ease: "power3.out" })
        : null;
      const chipX = chipRef.current
        ? gsap.quickTo(chipRef.current, "rotationX", { duration: 0.9, ease: "power3.out" })
        : null;
      const chipY = chipRef.current
        ? gsap.quickTo(chipRef.current, "rotationY", { duration: 0.9, ease: "power3.out" })
        : null;

      // Magnetic CTAs — each button nudges toward the cursor within a
      // small radius and snaps back once it leaves, the tactile "this
      // button wants to be clicked" detail a lot of templated sites skip.
      const magnetCleanups = ctas.map((cta) => {
        const quickX = gsap.quickTo(cta, "x", { duration: 0.4, ease: "power3.out" });
        const quickY = gsap.quickTo(cta, "y", { duration: 0.4, ease: "power3.out" });
        const handleMagnet = (e: PointerEvent) => {
          const rect = cta.getBoundingClientRect();
          const relX = e.clientX - (rect.left + rect.width / 2);
          const relY = e.clientY - (rect.top + rect.height / 2);
          const dist = Math.hypot(relX, relY);
          const radius = 80;
          if (dist < radius) {
            const pull = 1 - dist / radius;
            quickX(relX * 0.45 * pull);
            quickY(relY * 0.45 * pull);
          } else {
            quickX(0);
            quickY(0);
          }
        };
        window.addEventListener("pointermove", handleMagnet);
        return () => window.removeEventListener("pointermove", handleMagnet);
      });

      const handleMove = (e: PointerEvent) => {
        const rect = rootRef.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        copyX?.(py * -5);
        copyY?.(px * 6);
        chipX?.(py * 10);
        chipY?.(px * -14);
      };
      const handleLeave = () => {
        copyX?.(0);
        copyY?.(0);
        chipX?.(0);
        chipY?.(0);
      };

      const root = rootRef.current;
      root?.addEventListener("pointermove", handleMove);
      root?.addEventListener("pointerleave", handleLeave);
      return () => {
        root?.removeEventListener("pointermove", handleMove);
        root?.removeEventListener("pointerleave", handleLeave);
        magnetCleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: rootRef }
  );

  let wordIndex = 0;

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
        preload={cinematic ? "none" : "auto"}
        poster="/assets/video/prakrti-nilaya-poster.webp"
      >
        {!cinematic && (
          <source src="/assets/video/prakrti-nilaya.webm" type="video/webm" />
        )}
      </video>

      {/* Stands in for a native <video poster> on the WebGL path, which
          has no such thing — otherwise this frame is blank until the
          WebGL video starts playing. Sits above the (transparent) section
          background, in front of the fixed WebGL canvas behind it, and
          fades out once that video is confirmed playing. */}
      {cinematic && (
        <div
          ref={posterRef}
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url(/assets/video/prakrti-nilaya-poster.webp)" }}
          aria-hidden="true"
        />
      )}

      {/* Scrim only where the copy sits, so the video reads clearly across
          the rest of the frame instead of being dimmed edge to edge. The
          div itself is clipped to the bottom half — rather than spanning
          the full frame with custom gradient-stop percentages — so there
          is no ambiguity about the top of the hero staying scrim-free. */}
      <div
        className={`absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-bg/95 to-transparent transition-opacity duration-700 ${
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
          tilting opposite the copy block under the cursor so the frame
          reads as layered 3D space rather than flat text on a backdrop. */}
      <div
        ref={chipRef}
        data-hero-copy
        data-reveal-simple
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

      {/* The hero statement — no card, no box, just huge type standing
          directly in the scene, each word hinging up into place in real
          3D on load and leaning with the cursor afterward. */}
      <div
        data-hero-copy
        ref={copyRef}
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start px-6 pb-14 sm:px-10 sm:pb-16 md:px-14 md:pb-20"
        style={{ transformStyle: "preserve-3d" }}
      >
        <p
          data-reveal-simple
          className="font-display text-[0.72rem] font-semibold tracking-[0.22em] text-teal uppercase"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.75)" }}
        >
          Architects · Interiors · Landscape
        </p>

        <h1 className="mt-4 max-w-4xl text-balance font-display text-[3rem] font-medium leading-[0.96] tracking-[-0.02em] sm:text-[5rem] md:text-[6.4rem] lg:text-[7.6rem]">
          {HEADLINE_LINES.map((line, lineIdx) => (
            <span key={lineIdx} className="block overflow-hidden">
              {line.words.map((word) => {
                const idx = wordIndex++;
                return (
                  <span
                    key={word}
                    ref={(el) => {
                      wordRefs.current[idx] = el;
                    }}
                    className={`mr-[0.28em] inline-block ${
                      line.accent ? "text-terracotta" : "text-fg"
                    }`}
                    style={{
                      textShadow:
                        "1px 1px 0 rgba(43,36,28,0.45), 2px 2px 0 rgba(43,36,28,0.3), 3px 3px 10px rgba(43,36,28,0.25)",
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <div data-reveal-simple className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/services"
            ref={(el) => {
              ctaRefs.current[0] = el;
            }}
            className="rounded-full border border-fg/25 bg-bg/40 px-7 py-3.5 font-display text-[0.8rem] font-medium tracking-[0.02em] text-fg backdrop-blur-md transition-colors duration-300 hover:bg-bg/70"
          >
            Our Work
          </Link>
          <Link
            href="/contact"
            ref={(el) => {
              ctaRefs.current[1] = el;
            }}
            className="rounded-full bg-terracotta px-7 py-3.5 font-display text-[0.8rem] font-medium tracking-[0.02em] text-bg shadow-[0_10px_30px_rgba(192,95,56,0.4)] transition-shadow duration-300 hover:shadow-[0_14px_40px_rgba(192,95,56,0.55)]"
          >
            Book Appointment
          </Link>
        </div>
      </div>

      {/* A slowly rotating "scroll" badge in place of a plain pulsing
          line — a small signature detail that reads as designed rather
          than templated. */}
      <div
        data-reveal-simple
        className="absolute bottom-8 right-6 z-10 h-20 w-20 sm:right-10 sm:h-24 sm:w-24 md:right-14"
        aria-hidden="true"
      >
        <div ref={badgeRingRef} className="h-full w-full text-fg/50">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <defs>
              <path
                id="heroScrollPath"
                d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              />
            </defs>
            <text fontSize="7.6" letterSpacing="2" fill="currentColor">
              <textPath href="#heroScrollPath">
                SCROLL TO EXPLORE • SCROLL TO EXPLORE •
              </textPath>
            </text>
          </svg>
        </div>
        <span className="absolute inset-0 flex items-center justify-center text-fg/70">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 2v11M8 13l-4-4M8 13l4-4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </section>
  );
}
