"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WORDS = ["Rooted.", "Built.", "Growing.", "Blooming."];

/**
 * The homepage's second scroll beat — two real photographs of the same
 * brick-and-foliage corner (not an illustration, not a 3D render): the
 * brick underneath, full in frame from the start, with the planted,
 * blooming version rising up over it from the ground as you scroll — a
 * literal "brick becomes bloom" told with an actual place, the same
 * clip-path reveal technique SceneAwakens already uses for real photography
 * right below this section.
 */
export default function SceneBloom() {
  const rootRef = useRef<HTMLDivElement>(null);
  const brickImgRef = useRef<HTMLDivElement>(null);
  const bloomFrameRef = useRef<HTMLDivElement>(null);
  const bloomImgRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const finalLineRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        gsap.set(bloomFrameRef.current, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set([brickImgRef.current, bloomImgRef.current], { scale: 1 });
        gsap.set(words, { autoAlpha: 0 });
        gsap.set(words[words.length - 1], { autoAlpha: 1 });
        gsap.set(finalLineRef.current, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(bloomFrameRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set([brickImgRef.current, bloomImgRef.current], { scale: 1.14 });
      gsap.set(words, { autoAlpha: 0 });
      gsap.set(words[0], { autoAlpha: 1 });
      gsap.set(finalLineRef.current, { autoAlpha: 0, y: 12 });

      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: isMobile ? "+=160%" : "+=230%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      // The bloom rises up from the ground to cover the bare brick —
      // reducing the bottom inset is what makes the reveal climb upward
      // rather than wipe sideways or fade in place.
      tl.to(bloomFrameRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
        ease: "power1.inOut",
      }, 0);
      tl.to(brickImgRef.current, { scale: 1, duration: 1 }, 0);
      tl.to(bloomImgRef.current, { scale: 1, duration: 1 }, 0);

      words.forEach((_, i) => {
        if (i === 0) return;
        const at = (i / (words.length - 1)) * 0.82;
        tl.to(words[i - 1], { autoAlpha: 0, duration: 0.06 }, at - 0.06);
        tl.to(words[i], { autoAlpha: 1, duration: 0.06 }, at);
      });

      tl.to(finalLineRef.current, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.88);
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative h-[100dvh] w-full overflow-hidden border-t border-line bg-bg"
    >
      <div className="absolute inset-0">
        <div ref={brickImgRef} className="absolute inset-0" style={{ willChange: "transform" }}>
          <Image
            src="/assets/process/execution.webp"
            alt="A brick wall, built by hand"
            fill
            sizes="100vw"
            className="object-cover grayscale"
          />
        </div>

        <div
          ref={bloomFrameRef}
          className="absolute inset-0"
          style={{ willChange: "clip-path" }}
        >
          <div ref={bloomImgRef} className="absolute inset-0" style={{ willChange: "transform" }}>
            <Image
              src="/assets/process/grow.webp"
              alt="The same corner, planted and in bloom"
              fill
              sizes="100vw"
              className="object-cover grayscale"
            />
          </div>
        </div>
      </div>

      {/* A light, mostly-transparent wash — see SceneAwakens for why this
          stays near-flat instead of a full gradient (the latter reads as a
          milky haze over a photo once the theme's base colour is light).
          Legibility comes mainly from the text-shadow glow on the copy. */}
      <div className="absolute inset-0 bg-bg/18" />

      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-10 md:px-14 md:py-16">
        <div className="relative h-6">
          {WORDS.map((word, i) => (
            <span
              key={word}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className="absolute inset-0 font-display text-[0.72rem] tracking-[0.14em] text-teal uppercase"
              style={{ textShadow: "0 1px 12px rgba(247,242,232,0.9), 0 1px 3px rgba(247,242,232,0.9)" }}
            >
              {word}
            </span>
          ))}
        </div>

        <p
          ref={finalLineRef}
          className="max-w-sm text-balance font-display text-[1.7rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.1rem]"
          style={{ textShadow: "0 2px 20px rgba(247,242,232,0.95), 0 1px 4px rgba(247,242,232,0.95)" }}
        >
          Strong foundations make room for growth.
        </p>
      </div>
    </section>
  );
}
