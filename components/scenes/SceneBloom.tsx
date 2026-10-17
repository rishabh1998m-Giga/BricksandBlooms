"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeBloomCanvas from "@/components/webgl/HomeBloomCanvas";

gsap.registerPlugin(ScrollTrigger);

// Four quiet beats tied to HomeBloomCanvas's own growth thresholds (see
// that file's <Grow threshold={...}> calls) so the word on screen always
// matches what the 3D scene is actually doing underneath it.
const WORDS = [
  { word: "Rooted.", threshold: 0 },
  { word: "Built.", threshold: 0.2 },
  { word: "Growing.", threshold: 0.46 },
  { word: "Blooming.", threshold: 0.8 },
];

/**
 * The homepage's second scroll beat — a bare slab of ground becomes a real
 * brick, planted, watered, lit landscape, rendered in actual 3D (the same
 * technique as the /services flagship sequence) rather than a flat
 * illustrated vignette. A full-bleed canvas reads as a real place; a
 * centered line drawing on an empty canvas reads as a greeting card.
 */
export default function SceneBloom() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeWordRef = useRef(0);
  const finalShownRef = useRef(false);
  const finalLineRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef({ value: 0 });

  useGSAP(
    () => {
      const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      // Mirrors useCinematicMode's own gate exactly — on any viewport where
      // HomeBloomCanvas will render null, there's nothing to scrub against,
      // so skip the scroll-jack entirely rather than pinning the screen on
      // an empty bg-bg void.
      const cinematic =
        !prefersReduced &&
        window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;

      if (!cinematic) {
        progressRef.current.value = 1;
        gsap.set(words, { autoAlpha: 0 });
        gsap.set(words[words.length - 1], { autoAlpha: 1 });
        gsap.set(finalLineRef.current, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(words, { autoAlpha: 0 });
      gsap.set(words[0], { autoAlpha: 1 });
      gsap.set(finalLineRef.current, { autoAlpha: 0, y: 12 });

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "+=380%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current.value = self.progress;

          let idx = 0;
          WORDS.forEach((w, i) => {
            if (self.progress >= w.threshold) idx = i;
          });
          if (idx !== activeWordRef.current) {
            const prev = activeWordRef.current;
            activeWordRef.current = idx;
            gsap.to(words[prev], { autoAlpha: 0, duration: 0.3 });
            gsap.to(words[idx], { autoAlpha: 1, duration: 0.3 });
          }

          const showFinal = self.progress >= 0.88;
          if (showFinal !== finalShownRef.current) {
            finalShownRef.current = showFinal;
            gsap.to(finalLineRef.current, {
              autoAlpha: showFinal ? 1 : 0,
              y: showFinal ? 0 : 12,
              duration: 0.3,
              overwrite: true,
            });
          }
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative min-h-[32rem] w-full overflow-hidden border-t border-line bg-bg py-16 md:h-[100dvh] md:min-h-0 md:py-0"
    >
      <HomeBloomCanvas sectionRef={rootRef} progressRef={progressRef} />

      <div className="relative z-10 flex h-full flex-col justify-between px-6 md:px-14 md:py-16">
        <div className="relative h-6">
          {WORDS.map(({ word }, i) => (
            <span
              key={word}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className="absolute inset-0 font-display text-[0.72rem] tracking-[0.14em] text-muted uppercase"
            >
              {word}
            </span>
          ))}
        </div>

        <p
          ref={finalLineRef}
          className="max-w-sm text-balance font-display text-[1.7rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.1rem]"
        >
          Strong foundations make room for growth.
        </p>
      </div>
    </section>
  );
}
