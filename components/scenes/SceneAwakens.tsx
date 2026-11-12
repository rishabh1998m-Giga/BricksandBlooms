"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BEATS = [
  {
    src: "/assets/landscape/awakens-detail.webp",
    label: "We Observe",
    caption: "Every site begins as a quiet study — light, texture, what already wants to grow.",
  },
  {
    src: "/assets/landscape/awakens-character.webp",
    label: "We Design",
    caption: "Form follows the land. Materials are chosen to belong, not to announce.",
  },
  {
    src: "/assets/landscape/awakens-reveal.webp",
    label: "We Transform",
    caption: "A space that was merely outdoors becomes a place worth arriving at.",
  },
];

// Tuned once as constants rather than inlined per-call, since both the
// initial gsap.set() and the per-frame scrub onUpdate below need the exact
// same numbers to agree on where a photo "belongs" for a given offset.
const MAX_ANGLE = 56; // degrees a card is rotated away from facing the camera
const SPACING = 58; // % of its own width a card shifts per step of offset
const DEPTH = 560; // px a card is pushed back per step of offset
const FADE_START = 0.82; // |offset| at which a card starts fading out
const FADE_END = 1.55; // |offset| at which a card is fully invisible

// Each photo is laid out purely as a function of its distance from
// "current" (offset = index - beatPosition), so the whole deck reduces to
// one continuous value scrubbed by scroll instead of per-beat keyframes —
// the same photo rotates smoothly past the camera rather than cutting.
function cardLayout(offset: number) {
  const clamped = Math.max(-1.6, Math.min(1.6, offset));
  const abs = Math.abs(clamped);
  const opacity = Math.max(
    0,
    Math.min(1, 1 - (abs - FADE_START) / (FADE_END - FADE_START))
  );
  return {
    rotationY: -clamped * MAX_ANGLE,
    x: `${clamped * SPACING}%`,
    z: -abs * DEPTH,
    opacity,
    innerScale: 1 + Math.min(abs, 1) * 0.1,
  };
}

export default function SceneAwakens() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<HTMLDivElement[]>([]);
  const imgRefs = useRef<HTMLDivElement[]>([]);
  const textRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const frames = frameRefs.current;
      const images = imgRefs.current;
      const texts = textRefs.current;

      if (prefersReduced) {
        frames.forEach((frame, i) => {
          const isLast = i === frames.length - 1;
          gsap.set(frame, {
            rotationY: 0,
            x: isLast ? "0%" : "100%",
            z: isLast ? 0 : -700,
            opacity: isLast ? 1 : 0,
          });
        });
        gsap.set(images, { scale: 1 });
        gsap.set(texts, {
          autoAlpha: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          display: "none",
        });
        gsap.set(texts[texts.length - 1], { autoAlpha: 1, display: "block" });
        return;
      }

      frames.forEach((frame, i) => {
        const l = cardLayout(i);
        gsap.set(frame, {
          rotationY: l.rotationY,
          x: l.x,
          z: l.z,
          opacity: l.opacity,
        });
        if (images[i]) gsap.set(images[i], { scale: l.innerScale });
      });
      gsap.set(texts, { autoAlpha: 0, scale: 0.7, filter: "blur(18px)" });
      gsap.set(texts[0], { autoAlpha: 1, scale: 1, filter: "blur(0px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=280%",
          scrub: 1.1,
          pin: stageRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: () => {
            // Clamped to the last beat's index — without this, the trailing
            // "rest" tween appended below (tl.to({}, {duration:0.35})) keeps
            // tl.time() climbing past BEATS.length-1 while it plays, which
            // dragged the final card past dead-center instead of letting it
            // settle there.
            const beatPosition = Math.min(tl.time(), BEATS.length - 1);
            frames.forEach((frame, i) => {
              const l = cardLayout(i - beatPosition);
              gsap.set(frame, {
                rotationY: l.rotationY,
                x: l.x,
                z: l.z,
                opacity: l.opacity,
              });
              if (images[i]) gsap.set(images[i], { scale: l.innerScale });
            });
          },
        },
        defaults: { ease: "none" },
      });

      // The text crossfade stays on its own simple timeline beats — it
      // doesn't need to know about the 3D deck's continuous layout, only
      // which beat is "current" at roughly the same moments.
      BEATS.forEach((_, i) => {
        if (i === 0) return;
        tl.to(
          texts[i - 1],
          { autoAlpha: 0, scale: 1.3, filter: "blur(16px)", duration: 0.32, ease: "power2.in" },
          i - 0.3
        );
        tl.to(
          texts[i],
          { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "power2.out" },
          i - 0.12
        );
      });

      tl.to({}, { duration: 0.35 });

      const stage = stageRef.current;
      if (stage) {
        const handleMove = (e: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(images, {
            xPercent: px * 2.2,
            yPercent: py * 2.2,
            duration: 0.9,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        stage.addEventListener("pointermove", handleMove);
        return () => stage.removeEventListener("pointermove", handleMove);
      }
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative bg-bg-elevated"
    >
      <div
        ref={stageRef}
        className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{ perspective: "1700px", transformStyle: "preserve-3d" }}
        >
          {BEATS.map((beat, i) => (
            <div
              key={beat.src}
              ref={(el) => {
                if (el) frameRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ willChange: "transform, opacity" }}
            >
              <div
                ref={(el) => {
                  if (el) imgRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{ willChange: "transform" }}
              >
                <Image
                  src={beat.src}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>

        {/* A light, mostly-transparent wash rather than a full gradient
            wash — the latter read as a milky haze over the photo once the
            theme's base colour went light. Legibility now comes mainly
            from the text-shadow glow on the copy itself, below. */}
        <div className="absolute inset-0 bg-bg/18" />

        <div className="relative z-10 flex max-w-2xl flex-col items-center px-6 text-center">
          <p
            className="font-display text-[0.68rem] tracking-[0.22em] text-teal uppercase"
            style={{ textShadow: "0 1px 12px rgba(247,242,232,0.9), 0 1px 3px rgba(247,242,232,0.9)" }}
          >
            The Landscape Awakens
          </p>

          <div className="relative mt-6 h-[11.5rem] w-full sm:h-[10.5rem] md:h-[10rem]">
            {BEATS.map((beat, i) => (
              <div
                key={beat.label}
                ref={(el) => {
                  if (el) textRefs.current[i] = el;
                }}
                className="absolute inset-x-0 top-0 flex flex-col items-center"
              >
                <h2
                  className="text-balance font-display text-[2.4rem] font-medium leading-[0.98] tracking-[-0.01em] text-fg sm:text-[3.4rem] md:text-[4.2rem]"
                  style={{ textShadow: "0 2px 16px rgba(43,36,28,0.35), 0 1px 4px rgba(43,36,28,0.3)" }}
                >
                  {beat.label}
                  <span className="text-terracotta">.</span>
                </h2>
                <p
                  className="mt-5 max-w-md text-balance font-body text-base text-fg/80 sm:text-lg"
                  style={{ textShadow: "0 1px 14px rgba(247,242,232,0.9), 0 1px 3px rgba(247,242,232,0.9)" }}
                >
                  {beat.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
