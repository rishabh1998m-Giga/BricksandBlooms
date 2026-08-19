"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BEATS = [
  { text: "Clear process.", size: "small" },
  { text: "Thoughtful planning.", size: "small" },
  { text: "Seamless execution.", size: "small" },
  { text: "Landscapes that begin with your vision.", size: "large" },
] as const;

export default function SceneVision() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const texts = textRefs.current;

      if (prefersReduced) {
        gsap.set(texts, {
          autoAlpha: 0,
          scale: 1,
          filter: "blur(0px)",
          display: "none",
        });
        gsap.set(texts[texts.length - 1], { autoAlpha: 1, display: "flex" });
        return;
      }

      gsap.set(texts, { autoAlpha: 0, scale: 0.7, filter: "blur(18px)" });
      gsap.set(texts[0], { autoAlpha: 1, scale: 1, filter: "blur(0px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=220%",
          scrub: 1.1,
          pin: stageRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      BEATS.forEach((_, i) => {
        if (i === 0) return;

        tl.to(
          texts[i - 1],
          {
            autoAlpha: 0,
            scale: 1.3,
            filter: "blur(16px)",
            duration: 0.32,
            ease: "power2.in",
          },
          i - 0.3
        );
        tl.to(
          texts[i],
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.45,
            ease: "power2.out",
          },
          i - 0.12
        );
      });

      tl.to({}, { duration: 0.5 });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-line bg-bg"
      style={{
        backgroundImage:
          "radial-gradient(1000px 520px at 50% 110%, var(--color-terracotta-dim), transparent 60%)",
      }}
    >
      <div
        ref={stageRef}
        className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden px-6"
      >
        {BEATS.map((beat, i) => (
          <div
            key={beat.text}
            ref={(el) => {
              if (el) textRefs.current[i] = el;
            }}
            className="absolute inset-x-6 flex justify-center text-center"
          >
            <p
              className={
                beat.size === "large"
                  ? "max-w-4xl text-balance font-display text-[2.4rem] font-bold leading-[1.05] tracking-[-0.01em] text-fg sm:text-[3.4rem] md:text-[4.6rem]"
                  : "max-w-xl text-balance font-display text-[1.6rem] font-medium tracking-[-0.005em] text-muted sm:text-[2rem] md:text-[2.4rem]"
              }
            >
              {beat.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
