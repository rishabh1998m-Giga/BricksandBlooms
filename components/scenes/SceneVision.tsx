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

      // Cursor-reactive tilt: the words lean gently toward the pointer,
      // like they're magnetically aware of it. Runs on x/y/rotate only,
      // so it never fights the scroll timeline's scale/filter tweens.
      const stage = stageRef.current;
      if (stage) {
        const handleMove = (e: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(texts, {
            xPercent: px * 6,
            yPercent: py * 4,
            rotate: px * 1.4,
            duration: 1,
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
      className="relative overflow-hidden border-t border-line bg-bg"
      style={{
        backgroundImage:
          "radial-gradient(1300px 800px at 12% -5%, var(--color-terracotta-dim), transparent 55%), radial-gradient(1300px 800px at 88% 105%, var(--color-teal-dim), transparent 55%)",
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
                  ? "max-w-5xl text-balance font-display text-[3.2rem] font-bold leading-[1.02] tracking-[-0.015em] text-fg sm:text-[4.6rem] md:text-[6.4rem] lg:text-[7.2rem]"
                  : "max-w-2xl text-balance font-display text-[2.1rem] font-medium tracking-[-0.005em] text-muted sm:text-[2.9rem] md:text-[3.6rem]"
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
