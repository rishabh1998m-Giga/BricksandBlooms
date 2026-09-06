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
        gsap.set(frames, { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1 });
        gsap.set(images.slice(1), { display: "none" });
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

      gsap.set(frames.slice(1), { clipPath: "inset(0% 0% 100% 0%)" });
      gsap.set(frames[0], { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(images, { scale: 1.16 });
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
        },
        defaults: { ease: "none" },
      });

      BEATS.forEach((_, i) => {
        tl.to(images[i], { scale: 1.0, duration: 1 }, i);

        if (i > 0) {
          tl.to(
            frames[i],
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power2.inOut" },
            i - 0.28
          );

          // Kinetic-typography morph: the outgoing phrase punches forward
          // and dissolves into blur, the incoming phrase resolves out of
          // blur from below full size — a cut, not a crossfade.
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
              duration: 0.4,
              ease: "power2.out",
            },
            i - 0.12
          );
        }
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
        <div className="absolute inset-0">
          {BEATS.map((beat, i) => (
            <div
              key={beat.src}
              ref={(el) => {
                if (el) frameRefs.current[i] = el;
              }}
              className="absolute inset-0"
              style={{ willChange: "clip-path" }}
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

        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-bg/45" />

        <div className="relative z-10 flex max-w-2xl flex-col items-center px-6 text-center">
          <p className="font-display text-[0.68rem] tracking-[0.22em] text-teal uppercase">
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
                <h2 className="text-balance font-display text-[2.4rem] font-medium leading-[0.98] tracking-[-0.01em] text-fg sm:text-[3.4rem] md:text-[4.2rem]">
                  {beat.label}
                  <span className="text-terracotta">.</span>
                </h2>
                <p className="mt-5 max-w-md text-balance font-body text-base text-fg/80 sm:text-lg">
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
