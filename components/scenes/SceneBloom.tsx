"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// The site's own five-petal flower silhouette (see ContactExperience.tsx) —
// reused here so this sequence reads as the same brand mark blooming, not
// a different flower drawn for one section.
const PETAL_D = "M0 0 C-0.62 0.28 -0.47 1.24 0 1.5 C0.47 1.24 0.62 0.28 0 0Z";
const LEAF_D = "M0,0 C-9,-14 -7,-34 0,-46 C7,-34 9,-14 0,0 Z";

// A deliberate, one-section departure from the site's dark palette — warm,
// human, and specific to this moment, not a new global direction.
const INK = "#3b2c22";
const INK_MUTED = "#7a6a5a";
const TERRACOTTA = "#B35A45";
const EARTH = "#8C4632";
const EARTH_LIGHT = "#C97B5E";
const SAGE = "#5B6B4A";
const LEAF_GREEN = "#7C9166";
const BLUSH = "#F2C6C6";
const CORAL = "#E6A7A1";
const CREAM = "#FBF6F0";

const WORDS = ["Rooted.", "Built.", "Growing.", "Blooming."];

// A generously large, non-normalized dash length for the "line draw" reveal
// on the crack/stem/vine paths below — comfortably bigger than any of their
// real pixel lengths (a few hundred units at most). Using pathLength={1}
// with fractional 0–1 dash values instead puts the reveal math exactly on
// a floating-point boundary at each path's endpoint, which some renderers
// resolve as a stray one-pixel dot rather than fully hidden.
const DASH = 1600;

function Flower({
  colors,
  refCb,
}: {
  colors: string[];
  refCb: (el: SVGGElement | null) => void;
}) {
  return (
    <g ref={refCb} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      {colors.map((c, i) => (
        <g key={i} transform={`rotate(${i * 72})`}>
          <path d={PETAL_D} fill={c} fillOpacity={0.95} />
        </g>
      ))}
      <circle r="0.55" fill={INK} fillOpacity={0.75} />
    </g>
  );
}

function Leaf({
  x,
  y,
  rotate,
  scale = 1,
  color = LEAF_GREEN,
  refCb,
}: {
  x: number;
  y: number;
  rotate: number;
  scale?: number;
  color?: string;
  refCb: (el: SVGGElement | null) => void;
}) {
  // Static placement (translate/rotate/scale) lives on this outer <g> as a
  // plain SVG attribute; GSAP's animated scale goes on the inner <g> only —
  // a CSS transform GSAP writes fully replaces an element's own SVG
  // transform attribute rather than composing with it, so the two can
  // never share one node (see the same split in ContactExperience.tsx).
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g ref={refCb} style={{ transformBox: "fill-box", transformOrigin: "0px 0px" }}>
        <path d={LEAF_D} fill={color} />
        <line x1={0} y1={-4} x2={0} y2={-42} stroke={SAGE} strokeWidth={0.7} opacity={0.4} />
      </g>
    </g>
  );
}

export default function SceneBloom() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<SVGGElement>(null);
  const crackRef = useRef<SVGPathElement>(null);
  const stemRef = useRef<SVGPathElement>(null);
  const sideVineRef = useRef<SVGPathElement>(null);
  const leafRefs = useRef<(SVGGElement | null)[]>([]);
  const flowerRefs = useRef<(SVGGElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const finalLineRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const leaves = leafRefs.current.filter(Boolean) as SVGGElement[];
      const flowers = flowerRefs.current.filter(Boolean) as SVGGElement[];
      const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];

      gsap.set([crackRef.current, stemRef.current, sideVineRef.current], {
        strokeDashoffset: DASH,
      });
      // scale:0 alone leaves a stray sub-pixel artifact in some Chromium
      // rasterizer paths (a genuinely zero-area transform still gets a
      // hairline of antialiased coverage) — pairing it with opacity:0
      // guarantees these are actually invisible pre-growth.
      gsap.set(leaves, { scale: 0, opacity: 0, transformOrigin: "0px 0px" });
      gsap.set(flowers, { scale: 0, opacity: 0 });
      // Origin sits near the vertical middle of the whole composition (brick
      // at ~500, bloom tip at ~105) rather than down at the brick itself —
      // zooming in around a low origin flings the stem's tip disproportion-
      // ately upward, which at high zoom pushed the final bloom behind the
      // fixed nav bar.
      gsap.set(cameraRef.current, { scale: 1, x: 0, y: 0, transformOrigin: "300px 320px" });

      if (prefersReduced) {
        gsap.set([crackRef.current, stemRef.current, sideVineRef.current], {
          strokeDashoffset: 0,
        });
        gsap.set(leaves, { scale: 1, opacity: 1 });
        gsap.set(flowers, { scale: 1, opacity: 1 });
        gsap.set(cameraRef.current, { scale: 1.1, x: -5, y: 4 });
        gsap.set(words, { autoAlpha: 0 });
        gsap.set(finalLineRef.current, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(words, { autoAlpha: 0 });
      gsap.set(words[0], { autoAlpha: 1 });
      gsap.set(finalLineRef.current, { autoAlpha: 0, y: 12 });

      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: isMobile ? "+=260%" : "+=380%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      // Word crossfade — four quiet beats, never tied 1:1 to the visual
      // stages below; they're a separate, slower rhythm.
      words.forEach((_, i) => {
        if (i === 0) return;
        tl.to(words[i - 1], { autoAlpha: 0, duration: 0.06 }, i * 0.25 - 0.06);
        tl.to(words[i], { autoAlpha: 1, duration: 0.06 }, i * 0.25);
      });

      // 0–20%: bare brick, hairline crack begins to draw.
      tl.to(crackRef.current, { strokeDashoffset: 0, duration: 0.2 }, 0.02);

      // 20–35%: the shoot climbs out of the crack.
      tl.to(cameraRef.current, { scale: 1.15, x: -8, y: -6, duration: 0.3 }, 0.18);
      tl.to(stemRef.current, { strokeDashoffset: DASH * 0.72, duration: 0.15 }, 0.2);

      // 35–50%: leaves unfurl along the stem.
      tl.to(stemRef.current, { strokeDashoffset: DASH * 0.42, duration: 0.15 }, 0.35);
      tl.to(leaves.slice(0, 2), {
        scale: 1,
        opacity: 1,
        duration: 0.15,
        stagger: 0.05,
        ease: "back.out(1.6)",
      }, 0.36);

      // 50–65%: growth wraps around the brick; camera pushes to macro.
      tl.to(cameraRef.current, { scale: 1.35, x: -20, y: -12, duration: 0.3 }, 0.5);
      tl.to(stemRef.current, { strokeDashoffset: DASH * 0.1, duration: 0.15 }, 0.5);
      tl.to(sideVineRef.current, { strokeDashoffset: 0, duration: 0.15 }, 0.52);
      tl.to(leaves.slice(2), {
        scale: 1,
        opacity: 1,
        duration: 0.15,
        stagger: 0.06,
        ease: "back.out(1.6)",
      }, 0.55);

      // 65–80%: first blooms.
      tl.to(stemRef.current, { strokeDashoffset: 0, duration: 0.1 }, 0.65);
      tl.to(flowers.slice(0, 2), {
        scale: 1,
        opacity: 1,
        duration: 0.15,
        stagger: 0.07,
        ease: "back.out(1.8)",
      }, 0.68);

      // 80–100%: full bloom, camera settles back to reveal the whole piece.
      tl.to(flowers.slice(2), {
        scale: 1,
        opacity: 1,
        duration: 0.18,
        stagger: 0.06,
        ease: "back.out(1.8)",
      }, 0.82);
      tl.to(cameraRef.current, { scale: 1.1, x: -5, y: 4, duration: 0.2 }, 0.85);
      tl.to(finalLineRef.current, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.92);

      tl.to({}, { duration: 0.06 });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative h-[100dvh] w-full overflow-hidden"
      style={{ backgroundColor: CREAM }}
    >
      {/* Soft seams back into the site's dark palette on either side. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24"
        style={{ background: "linear-gradient(to bottom, var(--color-bg), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24"
        style={{ background: "linear-gradient(to top, var(--color-bg), transparent)" }}
      />

      <svg
        viewBox="0 -30 600 760"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <g ref={cameraRef}>
          {/* Ground shadow + a few grains of dirt — physicality, not polish */}
          <ellipse cx={290} cy={606} rx={140} ry={16} fill={INK} opacity={0.12} />
          {[
            [212, 604],
            [252, 611],
            [338, 609],
            [368, 601],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.6} fill={EARTH} opacity={0.5} />
          ))}

          {/* The brick — three faces, hand-shaded, deliberately imperfect */}
          <polygon points="200,600 380,600 380,520 200,520" fill={TERRACOTTA} />
          <polygon points="200,520 380,520 416,498 236,498" fill={EARTH_LIGHT} />
          <polygon points="380,600 380,520 416,498 416,578" fill={EARTH} />
          <ellipse cx={250} cy={555} rx={22} ry={10} fill={EARTH} opacity={0.18} />
          <ellipse cx={330} cy={580} rx={16} ry={7} fill={EARTH} opacity={0.14} />

          {/* The crack it grows from */}
          <path
            ref={crackRef}
            d="M250,512 L262,506 L258,499 L276,504 L270,495 L292,500 L288,492 L310,497 L305,489 L330,494"
            fill="none"
            stroke={INK}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={DASH}
            opacity={0.6}
          />

          {/* The main shoot */}
          <path
            ref={stemRef}
            d="M290,500 C300,440 255,410 280,360 C300,320 340,300 320,240 C305,195 335,165 315,110"
            fill="none"
            stroke={SAGE}
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeDasharray={DASH}
          />

          {/* A second vine wrapping the brick's edge */}
          <path
            ref={sideVineRef}
            d="M382,555 C405,545 412,515 392,495 C378,482 385,462 402,452"
            fill="none"
            stroke={SAGE}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={DASH}
          />

          <Leaf x={275} y={430} rotate={-40} refCb={(el) => (leafRefs.current[0] = el)} />
          <Leaf x={300} y={350} rotate={35} refCb={(el) => (leafRefs.current[1] = el)} />
          <Leaf x={330} y={270} rotate={-30} scale={1.05} refCb={(el) => (leafRefs.current[2] = el)} />
          <Leaf x={312} y={170} rotate={20} refCb={(el) => (leafRefs.current[3] = el)} />
          <Leaf x={398} y={470} rotate={65} scale={0.85} refCb={(el) => (leafRefs.current[4] = el)} />

          {/* PETAL_D is authored for a ~1.5-unit-tall petal (see
              ContactExperience.tsx's own tiny viewBox) — this illustration's
              coordinate space is two orders of magnitude larger, hence the
              *20-ish wrapper scales below to bring blooms up to a size that
              actually reads next to the brick and leaves. */}
          <g transform="translate(322 235) scale(17)">
            <Flower colors={[BLUSH, CORAL, BLUSH, CORAL, BLUSH]} refCb={(el) => (flowerRefs.current[0] = el)} />
          </g>
          <g transform="translate(405 448) scale(15)">
            <Flower colors={[CORAL, BLUSH, CORAL, BLUSH, CORAL]} refCb={(el) => (flowerRefs.current[1] = el)} />
          </g>
          <g transform="translate(313 105) scale(26)">
            <Flower colors={[TERRACOTTA, BLUSH, CORAL, BLUSH, TERRACOTTA]} refCb={(el) => (flowerRefs.current[2] = el)} />
          </g>
          <g transform="translate(345 128) scale(8)">
            <Flower colors={[CREAM, CREAM, CREAM, CREAM, CREAM]} refCb={(el) => (flowerRefs.current[3] = el)} />
          </g>
          <g transform="translate(292 258) scale(7)">
            <Flower colors={[CREAM, CREAM, CREAM, CREAM, CREAM]} refCb={(el) => (flowerRefs.current[4] = el)} />
          </g>
        </g>
      </svg>

      <div className="relative z-10 h-full w-full px-6 py-10 md:px-14 md:py-16">
        <div className="relative h-6">
          {WORDS.map((word, i) => (
            <span
              key={word}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className="absolute inset-0 font-display text-[0.72rem] tracking-[0.14em] uppercase"
              style={{ color: INK_MUTED }}
            >
              {word}
            </span>
          ))}
        </div>

        <p
          ref={finalLineRef}
          className="absolute bottom-14 left-1/2 max-w-sm -translate-x-1/2 text-balance text-center font-body text-lg italic sm:text-xl"
          style={{ color: INK }}
        >
          Strong foundations make room for growth.
        </p>
      </div>
    </section>
  );
}
