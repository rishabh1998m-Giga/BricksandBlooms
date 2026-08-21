"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlowerBud from "@/components/FlowerBud";

gsap.registerPlugin(ScrollTrigger);

const BEATS = [
  { text: "Clear process.", size: "small" },
  { text: "Thoughtful planning.", size: "small" },
  { text: "Seamless execution.", size: "small" },
  { text: "Landscapes that begin with your vision.", size: "large" },
] as const;

// A single meandering line, hugging the edges of the frame so it never
// crosses the centered text — grows in sync with scroll, then sprouts a
// small blossom at each phrase, blooming fully at the last one.
const VINE_PATH =
  "M -5,92 C 14,84 6,62 17,47 C 28,32 10,18 24,15 C 40,3 58,20 74,18 C 96,15 104,5 124,15 C 146,25 148,35 165,30";

const BUD_FRACTIONS = [0.06, 0.35, 0.62, 0.9];
const BUD_COLORS = ["#4ca48e", "#d97a4e", "#dd939a", "#f1ecdd"];

export default function SceneVision() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLDivElement[]>([]);
  const vinePathRef = useRef<SVGPathElement>(null);
  const budPositionRefs = useRef<SVGGElement[]>([]);
  const budBloomRefs = useRef<SVGGElement[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const texts = textRefs.current;
      const vine = vinePathRef.current;
      const buds = budBloomRefs.current;

      // Position every bud along the vine path regardless of motion
      // preference — this is just layout, not animation. The viewBox is
      // stretched non-uniformly (preserveAspectRatio="none", so the vine
      // line reaches every edge on any screen shape) which would squash
      // the round flowers into ovals on narrow viewports, so each bud
      // gets a one-time counter-scale baked into this outer group,
      // completely separate from the inner group GSAP animates — GSAP's
      // own scale tween would otherwise overwrite a correction applied
      // to the same element.
      if (vine) {
        const length = vine.getTotalLength();
        const svgRect = svgRef.current?.getBoundingClientRect();
        const scaleX = (svgRect?.width ?? 160) / 160;
        const scaleY = (svgRect?.height ?? 90) / 90;
        const correction = scaleX > 0 ? scaleY / scaleX : 1;

        BUD_FRACTIONS.forEach((frac, i) => {
          const pt = vine.getPointAtLength(length * frac);
          budPositionRefs.current[i]?.setAttribute(
            "transform",
            `translate(${pt.x} ${pt.y}) scale(${correction} 1)`
          );
        });

        if (prefersReduced) {
          vine.style.strokeDasharray = `${length}`;
          vine.style.strokeDashoffset = "0";
        }
      }

      if (prefersReduced) {
        gsap.set(texts, {
          autoAlpha: 0,
          scale: 1,
          filter: "blur(0px)",
          display: "none",
        });
        gsap.set(texts[texts.length - 1], { autoAlpha: 1, display: "flex" });
        gsap.set(buds, { scale: 1, transformOrigin: "center" });
        return;
      }

      gsap.set(texts, { autoAlpha: 0, scale: 0.7, filter: "blur(18px)" });
      gsap.set(texts[0], { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
      gsap.set(buds, { scale: 0, transformOrigin: "center" });

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

      // A blossom pops open at each phrase, the last one biggest — the
      // final statement literally arrives in bloom.
      const budPositions = [0.1, 0.7, 1.7, 2.88];
      buds.forEach((bud, i) => {
        if (!bud) return;
        tl.to(
          bud,
          {
            scale: i === buds.length - 1 ? 1.4 : 1,
            duration: 0.5,
            ease: "back.out(2.2)",
          },
          budPositions[i]
        );
      });

      // The vine grows the full length of the sequence, arriving in step
      // with the final bloom rather than finishing early or lagging.
      if (vine) {
        const length = vine.getTotalLength();
        gsap.set(vine, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(
          vine,
          { strokeDashoffset: 0, duration: tl.duration(), ease: "none" },
          0
        );
      }

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
          gsap.to(svgRef.current, {
            xPercent: px * 1.5,
            yPercent: py * 1.5,
            duration: 1.2,
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
        <svg
          ref={svgRef}
          className="pointer-events-none absolute inset-0 h-full w-full text-fg/25"
          viewBox="0 0 160 90"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={vinePathRef}
            d={VINE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.35"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {BUD_FRACTIONS.map((_, i) => (
            <g
              key={i}
              ref={(el) => {
                if (el) budPositionRefs.current[i] = el;
              }}
            >
              <g
                ref={(el) => {
                  if (el) budBloomRefs.current[i] = el;
                }}
              >
                <FlowerBud color={BUD_COLORS[i]} />
              </g>
            </g>
          ))}
        </svg>

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
