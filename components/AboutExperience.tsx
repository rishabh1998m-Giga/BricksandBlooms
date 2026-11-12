"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEAL = "#2b8870";
const TERRACOTTA = "#c05f38";
const BLUSH = "#c97079";

type Phase = "design" | "execution";

const PHASES: Record<
  Phase,
  { label: string; short: string; accent: string; items: string[] }
> = {
  design: {
    label: "Design & Planning",
    short: "Design",
    accent: TEAL,
    items: [
      "Concept Design",
      "3D Visualization",
      "Planting Design",
      "Hardscape Design",
      "Lighting & Irrigation Planning",
    ],
  },
  execution: {
    label: "Execution & Management",
    short: "Execution",
    accent: TERRACOTTA,
    items: [
      "End-to-End Project Management",
      "Hardscape Construction",
      "Softscape Installation",
      "Water Features",
      "Outdoor Lighting",
      "Complete Site Execution",
    ],
  },
};

const HARDSCAPE = ["Pavings", "Pergolas", "Decks", "Stonework", "Water Bodies"];
const SOFTSCAPE = ["Planting", "Lawns", "Vertical Gardens", "Trees"];

const WHO_WE_SERVE = [
  { num: "01", label: "Villa Gardens", line: "A serene villa garden." },
  { num: "02", label: "Corporate Campuses", line: "A welcoming corporate campus." },
  { num: "03", label: "Hospitality Landscapes", line: "An immersive hospitality landscape." },
  { num: "04", label: "Institutional Courtyards", line: "A calm institutional courtyard." },
];

// Real work, not colour swatches — the same duotone photography used
// elsewhere on the site, one frame per tile so no two are alike.
const TILE_PHOTOS = [
  { src: "/assets/landscape/awakens-detail.webp", alt: "A detail from one of our landscapes" },
  { src: "/assets/landscape/awakens-character.webp", alt: "The character of a finished site" },
  { src: "/assets/landscape/awakens-reveal.webp", alt: "A landscape, revealed" },
  { src: "/assets/process/discovery.webp", alt: "Site discovery" },
  { src: "/assets/process/planning.webp", alt: "Design planning" },
  { src: "/assets/process/execution.webp", alt: "On-site execution" },
  { src: "/assets/process/grow.webp", alt: "Planting taking root" },
  { src: "/assets/services/consultation.webp", alt: "A design consultation" },
  { src: "/assets/services/landscape-design.webp", alt: "A courtyard landscape design" },
  { src: "/assets/services/terrace-balcony.webp", alt: "A terrace and balcony landscape" },
  { src: "/assets/services/transformations.webp", alt: "A site transformation" },
  { src: "/assets/services/execution.webp", alt: "Turnkey execution in progress" },
];
const TILE_COUNT = TILE_PHOTOS.length;

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 8h11M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PROOF_PHOTO = "/assets/services/landscape-design.webp";
const LENS_ZOOM = 2.4;

export default function AboutExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const proofRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<Phase>("design");
  const [lens, setLens] = useState({ x: 0, y: 0, bgW: 0, bgH: 0, visible: false });

  const handleProofMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = proofRef.current?.getBoundingClientRect();
    if (!rect) return;
    setLens({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      bgW: rect.width * LENS_ZOOM,
      bgH: rect.height * LENS_ZOOM,
      visible: true,
    });
  };

  // Deterministic per-tile scatter values (no Math.random() during render) —
  // same seeded-sine technique used for DustMotes elsewhere on the site.
  const tileVariants = useMemo(
    () =>
      Array.from({ length: TILE_COUNT }, (_, i) => {
        const a = Math.sin(i * 12.9898) * 43758.5453;
        const b = Math.sin(i * 78.233) * 12543.789;
        const rot = ((a - Math.floor(a)) - 0.5) * 34;
        const scale = 0.62 + ((b - Math.floor(b)) * 0.55);
        const hueIndex = i % 3;
        const color = [TERRACOTTA, TEAL, BLUSH][hueIndex];
        return { rot, scale, color };
      }),
    []
  );

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      if (prefersReduced) {
        gsap.set(reveals, { opacity: 1, y: 0 });
        gsap.set(tileRefs.current, {
          rotate: (i: number) => tileVariants[i].rot,
          scale: (i: number) => tileVariants[i].scale,
          borderColor: (i: number) => tileVariants[i].color,
        });
        return;
      }

      gsap.set(reveals, { opacity: 0, y: 22 });
      ScrollTrigger.batch(reveals, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.06,
          }),
      });

      // The "no templates" grid — a uniform grid of identical square crops
      // that breaks itself apart into unique sizes, angles, and accent
      // colours the moment it enters view. The metaphor does the
      // explaining; the photos underneath are real project work.
      gsap.set(tileRefs.current, { rotate: 0, scale: 1 });
      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          tileRefs.current.forEach((tile, i) => {
            if (!tile) return;
            gsap.to(tile, {
              rotate: tileVariants[i].rot,
              scale: tileVariants[i].scale,
              borderColor: tileVariants[i].color,
              duration: 0.8,
              delay: i * 0.045,
              ease: "back.out(1.7)",
            });
          });
        },
      });
    },
    { scope: rootRef, dependencies: [tileVariants] }
  );

  return (
    <div ref={rootRef}>
      {/* ENTRY — an editorial, mixed-scale sentence rather than an eyebrow
          + headline + subhead stack. The number does the emphasis work. */}
      <section className="relative overflow-hidden border-t border-line bg-bg px-6 pb-20 pt-32 md:px-14 md:pb-28 md:pt-40">
        <div className="mx-auto max-w-4xl">
          <p
            data-reveal
            className="font-display text-[0.7rem] tracking-[0.2em] text-muted uppercase"
          >
            About Brick &amp; Blooms Ventures
          </p>
          <p
            data-reveal
            className="mt-8 text-balance font-display font-medium leading-[1.15] tracking-[-0.01em] text-fg"
          >
            <span className="text-[1.7rem] sm:text-[2.1rem] md:text-[2.5rem]">
              For over{" "}
            </span>
            <span className="text-terracotta text-[3.4rem] sm:text-[4.4rem] md:text-[5.4rem]">
              six years
            </span>
            <span className="text-[1.7rem] sm:text-[2.1rem] md:text-[2.5rem]">
              {" "}
              we&rsquo;ve led exterior landscape architecture and turnkey
              execution across India.
            </span>
          </p>
        </div>
      </section>

      {/* NO TEMPLATES — the philosophy, visualised as a grid that refuses
          to stay a grid. */}
      <section className="relative overflow-hidden border-t border-line bg-bg-elevated px-6 py-24 md:px-14 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1fr_1.05fr] md:items-center">
          <div>
            <h2
              data-reveal
              className="text-balance font-display text-[2rem] font-medium leading-[1.12] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
            >
              No templates. No repetition.
            </h2>
            <p
              data-reveal
              className="mt-5 max-w-md font-body text-lg leading-relaxed text-fg/80"
            >
              Every project begins with a blank canvas and a deep
              understanding of you. We deliver custom works, custom designs,
              and a custom approach to execution and project management.
            </p>
          </div>

          <div
            ref={gridRef}
            className="grid grid-cols-4 grid-rows-3 gap-3 sm:gap-4"
          >
            {TILE_PHOTOS.map((photo, i) => (
              <div key={photo.src} className="relative aspect-square">
                <div
                  ref={(el) => {
                    tileRefs.current[i] = el;
                  }}
                  className="absolute inset-0 overflow-hidden rounded-md border-2 border-transparent transition-transform duration-300 hover:!scale-90"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 640px) 12vw, 20vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TURNKEY, TWO PHASES — a segmented toggle instead of a hover panel,
          deliberately different from the Services page's discovery zones. */}
      <section className="border-t border-line bg-bg px-6 py-24 md:px-14 md:py-32">
        <div className="mx-auto max-w-4xl">
          <h2
            data-reveal
            className="max-w-lg text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
          >
            Comprehensive, turnkey, start to finish.
          </h2>

          <div
            data-reveal
            className="relative mt-10 inline-flex rounded-full border border-line p-1"
            role="tablist"
            aria-label="Turnkey service phases"
          >
            <span
              className="absolute inset-y-1 w-1/2 rounded-full transition-transform duration-300 ease-out"
              style={{
                backgroundColor: PHASES[phase].accent,
                opacity: 0.16,
                transform: phase === "design" ? "translateX(0%)" : "translateX(100%)",
              }}
              aria-hidden="true"
            />
            {(Object.keys(PHASES) as Phase[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={phase === key}
                onClick={() => setPhase(key)}
                className="relative z-10 rounded-full px-5 py-2.5 font-display text-[0.72rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-300 sm:px-7"
                style={{ color: phase === key ? PHASES[key].accent : "var(--color-muted)" }}
              >
                {PHASES[key].short}
              </button>
            ))}
          </div>

          <ul
            data-reveal
            key={phase}
            className="mt-10 grid gap-x-8 gap-y-1 sm:grid-cols-2"
          >
            {PHASES[phase].items.map((item, i) => (
              <li
                key={item}
                className="flex items-baseline gap-3 border-b border-line py-4 font-display text-lg font-medium text-fg opacity-0"
                style={{
                  animation: "about-item-in 0.5s ease-out forwards",
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <span
                  className="font-display text-[0.65rem] tabular-nums"
                  style={{ color: PHASES[phase].accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HARDSCAPE + SOFTSCAPE — two lists interlocked at the seam, the same
          brick/bloom duality the rest of the site uses, told through
          material lists instead of another 3D scene. */}
      <section className="relative overflow-hidden border-t border-line bg-bg-elevated px-6 py-24 md:px-14 md:py-32">
        <div className="mx-auto max-w-5xl">
          <h2
            data-reveal
            className="max-w-lg text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
          >
            One exterior, two materials.
          </h2>
          <p data-reveal className="mt-4 max-w-md font-body text-base text-muted">
            Hardscape and softscape, integrated into one cohesive, serene,
            luxurious exterior — not planned separately and stitched
            together.
          </p>

          <div className="relative mt-14 grid gap-0 sm:grid-cols-2">
            <div
              data-reveal
              className="relative z-10 rounded-2xl border border-line bg-bg p-8 sm:mr-[-1.5rem] sm:rounded-r-none md:p-10"
            >
              <p className="font-display text-[0.68rem] tracking-[0.18em] uppercase" style={{ color: TERRACOTTA }}>
                Hardscape
              </p>
              <ul className="mt-6 flex flex-col gap-1 border-t border-line pt-5">
                {HARDSCAPE.map((item) => (
                  <li key={item} className="py-2 font-display text-base font-medium text-fg sm:text-lg">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg-elevated font-display text-lg text-fg sm:flex"
            >
              +
            </div>

            <div
              data-reveal
              className="relative z-10 rounded-2xl border border-line bg-bg p-8 sm:ml-[-1.5rem] sm:rounded-l-none md:p-10"
            >
              <p className="font-display text-[0.68rem] tracking-[0.18em] uppercase" style={{ color: TEAL }}>
                Softscape
              </p>
              <ul className="mt-6 flex flex-col gap-1 border-t border-line pt-5">
                {SOFTSCAPE.map((item) => (
                  <li key={item} className="py-2 font-display text-base font-medium text-fg sm:text-lg">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE SERVE — plain, confident typographic list. No stock photos
          standing in for site types we don't have real photography of. */}
      <section className="border-t border-line bg-bg px-6 py-24 md:px-14 md:py-32">
        <div className="mx-auto max-w-4xl">
          <h2
            data-reveal
            className="max-w-lg text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
          >
            Whether it&rsquo;s one of these, or something else entirely.
          </h2>

          <ul className="mt-12 flex flex-col">
            {WHO_WE_SERVE.map((entry) => (
              <li
                key={entry.num}
                data-reveal
                className="group flex flex-col gap-1 border-b border-line py-6 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="font-display text-[0.7rem] text-muted tabular-nums">
                  {entry.num}
                </span>
                <span className="font-display text-2xl font-medium text-fg transition-colors duration-200 group-hover:text-terracotta sm:text-3xl">
                  {entry.label}
                </span>
                <span className="font-body text-base text-muted sm:ml-auto">
                  {entry.line}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROOF — a real photo from a real site, with the kind of close
          detail a "custom, unmatched quality" claim should hold up to. */}
      <section className="border-t border-line bg-bg-elevated px-6 py-24 md:px-14 md:py-32">
        <div className="mx-auto max-w-4xl">
          <h2
            data-reveal
            className="max-w-lg text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
          >
            On-time delivery. Unmatched quality.
          </h2>
          <p data-reveal className="mt-4 max-w-md font-body text-base text-muted">
            Move over the photo to look closer — this is one of our own
            sites, not a render.
          </p>

          <div
            ref={proofRef}
            data-reveal
            className="relative mt-10 aspect-[4/3] w-full cursor-none select-none overflow-hidden rounded-2xl border border-line sm:aspect-[16/9]"
            onPointerMove={handleProofMove}
            onPointerLeave={() => setLens((l) => ({ ...l, visible: false }))}
          >
            <Image
              src={PROOF_PHOTO}
              alt="Ironwork and courtyard planting at one of our sites"
              fill
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />

            <div
              className="pointer-events-none absolute z-10 hidden h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fg/80 shadow-2xl transition-opacity duration-150 sm:block"
              style={{
                left: lens.x,
                top: lens.y,
                opacity: lens.visible ? 1 : 0,
                backgroundImage: `url(${PROOF_PHOTO})`,
                backgroundSize: `${lens.bgW}px ${lens.bgH}px`,
                backgroundPosition: `${-(lens.x * LENS_ZOOM - 80)}px ${-(lens.y * LENS_ZOOM - 80)}px`,
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* CLOSING SIGNATURE */}
      <section className="border-t border-line bg-bg px-6 py-28 md:px-14 md:py-36">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <h2
            data-reveal
            className="text-balance font-display font-medium leading-[1.05] tracking-[-0.01em]"
          >
            <span className="block text-[2.4rem] text-fg sm:text-[3.2rem] md:text-[3.8rem]">
              Curating Exteriors.
            </span>
            <span className="block text-[2.4rem] text-terracotta sm:text-[3.2rem] md:text-[3.8rem]">
              Cultivating Lifestyles.
            </span>
          </h2>
          <Link
            href="/contact"
            data-reveal
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-line px-6 py-3 font-display text-[0.68rem] tracking-[0.14em] text-fg uppercase transition-colors duration-300 hover:border-teal/50 hover:text-teal"
          >
            Start a conversation
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:translate-x-1 group-hover:border-teal/50">
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
