"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LandscapeOpeningCanvas from "@/components/webgl/LandscapeOpeningCanvas";
import BrickToBloomCanvas from "@/components/webgl/BrickToBloomCanvas";
import MaintenanceBloomCanvas from "@/components/webgl/MaintenanceBloomCanvas";

gsap.registerPlugin(ScrollTrigger);

const TEAL = "#4ca48e";
const TERRACOTTA = "#d97a4e";
const BLUSH = "#dd939a";
const STONE = "#a79e8c";
const ACCENTS = [TEAL, TERRACOTTA, BLUSH];

// The six stages of the flagship sequence — matched 1:1 to the growth
// thresholds inside BrickToBloomCanvas so the label and the geometry
// always agree on what's happening.
const STAGES = [
  { num: "01", name: "Structure", line: "Brick by brick, the frame takes shape.", threshold: 0 },
  { num: "02", name: "Terrain", line: "The ground finds its form.", threshold: 0.26 },
  { num: "03", name: "Planting", line: "Life takes root.", threshold: 0.38 },
  { num: "04", name: "Water", line: "Movement enters the landscape.", threshold: 0.58 },
  { num: "05", name: "Light", line: "Warmth settles over everything.", threshold: 0.74 },
  { num: "06", name: "Life", line: "A landscape, complete.", threshold: 0.9 },
];

type Zone = {
  key: string;
  label: string;
  accent: string;
  line: string;
  services: string[];
};

const ZONES: Zone[] = [
  {
    key: "brick",
    label: "Brick & Stone",
    accent: TERRACOTTA,
    line: "Where structure gives a landscape its bones — the architecture that holds everything else up.",
    services: ["Hardscape", "Pergola & Fabrication"],
  },
  {
    key: "plant",
    label: "Plant",
    accent: TEAL,
    line: "Softscape and living walls — the parts of a landscape that grow, breathe, and change with the seasons.",
    services: ["Terrace Garden", "Vertical Garden", "Softscape", "Moss Wall"],
  },
  {
    key: "water",
    label: "Water",
    accent: BLUSH,
    line: "Pools, fountains, and the quiet engineering of irrigation — water in motion and water at rest.",
    services: ["Swimming Pools", "Water Fountains & Ponds", "Landscape Irrigation"],
  },
  {
    key: "terrain",
    label: "Terrain",
    accent: STONE,
    line: "The full shape of a site — villas, commercial grounds, landscapes built at every scale.",
    services: ["Villa Landscaping", "Luxury Landscapes", "Commercial Landscaping"],
  },
  {
    key: "planter",
    label: "Planter",
    accent: TERRACOTTA,
    line: "The ongoing relationship — indoor greenery, the vessels that bring nature in, and the care that keeps it alive.",
    services: ["Garden Maintenance", "Office Plant Rental", "FRP Planters"],
  },
];

const ALL_SERVICES = ZONES.flatMap((z) => z.services);

const BRIDGE_PHOTOS = [
  { src: "/assets/services/landscape-design.webp", caption: "A courtyard, reclaimed" },
  { src: "/assets/process/execution.webp", caption: "Built by hand, on site" },
  { src: "/assets/landscape/awakens-reveal.webp", caption: "What the land wanted to become" },
];

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

export default function ServicesIndex() {
  const rootRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef<HTMLElement>(null);

  const flagshipStageRef = useRef<HTMLDivElement>(null);
  const stageLabelRefs = useRef<HTMLDivElement[]>([]);
  const activeStageRef = useRef(0);
  const progressRef = useRef({ value: 0 });

  const maintenanceRef = useRef<HTMLElement>(null);

  const [activeZone, setActiveZone] = useState(0);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      if (prefersReduced) {
        gsap.set(reveals, { opacity: 1, y: 0 });
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

      // --- The flagship sequence: pin, and let scroll position alone
      // drive both the 3D growth (via progressRef, read every frame by
      // BrickToBloomCanvas) and the stage-label crossfade below. Desktop
      // only — on narrow viewports the WebGL layer never mounts (see
      // useCinematicMode), so scroll-jacking a blank canvas for 450% of
      // the viewport height would just be a long empty void; mobile gets
      // the plain static list rendered right below instead.
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop) return;

      const labels = stageLabelRefs.current;
      gsap.set(labels, { autoAlpha: 0 });
      gsap.set(labels[0], { autoAlpha: 1 });

      ScrollTrigger.create({
        trigger: flagshipStageRef.current,
        start: "top top",
        end: "+=450%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current.value = self.progress;
          let idx = 0;
          STAGES.forEach((s, i) => {
            if (self.progress >= s.threshold) idx = i;
          });
          if (idx !== activeStageRef.current) {
            const prev = activeStageRef.current;
            activeStageRef.current = idx;
            gsap.to(labels[prev], { autoAlpha: 0, duration: 0.3 });
            gsap.to(labels[idx], { autoAlpha: 1, duration: 0.3 });
          }
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      {/* ENTRY — a small, complete world rendered in real 3D */}
      <section
        ref={openingRef}
        className="relative flex min-h-[26rem] w-full items-end overflow-hidden border-t border-line bg-bg px-6 pb-14 pt-24 md:h-[100dvh] md:min-h-0 md:pb-24 md:pt-0 md:px-10"
      >
        <LandscapeOpeningCanvas sectionRef={openingRef} />
        <div className="relative z-10">
          <h1
            data-reveal
            className="max-w-2xl text-balance font-display text-[2.4rem] font-medium leading-[1.02] tracking-[-0.01em] text-fg sm:text-[3.2rem] md:text-[4rem]"
          >
            Everything between a bare plot and a finished garden.
          </h1>
          <p
            data-reveal
            className="mt-5 max-w-md text-balance font-body text-base text-muted sm:text-lg"
          >
            Scroll through how we build one, start to finish. Then browse
            all fifteen services below.
          </p>
        </div>
      </section>

      {/* THE FLAGSHIP SEQUENCE — a bare slab becomes a living landscape */}
      <section
        ref={flagshipStageRef}
        className="relative hidden h-[100dvh] w-full overflow-hidden border-t border-line bg-bg motion-safe:md:block"
      >
        <BrickToBloomCanvas sectionRef={flagshipStageRef} progressRef={progressRef} />

        <div className="relative z-10 flex h-full flex-col justify-between px-6 py-10 md:px-14 md:py-16">
          <p className="font-body text-sm text-muted">
            Six stages, start to finish — keep scrolling.
          </p>

          <div className="relative min-h-[7rem]">
            {STAGES.map((stage, i) => (
              <div
                key={stage.num}
                ref={(el) => {
                  if (el) stageLabelRefs.current[i] = el;
                }}
                className="absolute inset-x-0 bottom-0"
              >
                <p className="font-display text-[0.68rem] tracking-[0.22em] text-terracotta uppercase">
                  {stage.num} — {stage.name}
                </p>
                <p className="mt-3 max-w-sm text-balance font-display text-[1.7rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.1rem]">
                  {stage.line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reduced-motion fallback for the flagship sequence above — same six
          stages, read as a static list instead of a pinned 3D scroll. */}
      <section className="hidden border-t border-line bg-bg px-6 py-20 max-md:block motion-reduce:block md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="font-body text-sm text-muted">Six stages, start to finish.</p>
          <ul className="mt-10 flex flex-col gap-8">
            {STAGES.map((stage) => (
              <li key={stage.num} className="flex gap-5">
                <span className="font-display text-[0.68rem] tracking-[0.22em] text-terracotta uppercase">
                  {stage.num}
                </span>
                <p className="font-display text-[1.4rem] font-medium leading-[1.15] tracking-[-0.01em] text-fg">
                  {stage.line}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* DISCOVERY — the elements of the landscape, and what each becomes */}
      <section className="border-t border-line bg-bg px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2
            data-reveal
            className="max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
          >
            Five materials. Fifteen disciplines.
          </h2>
          <p data-reveal className="mt-4 max-w-md font-body text-base text-muted">
            Hover or tap a material to see what we build with it.
          </p>

          <div className="mt-14 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <div
              data-reveal
              className="flex flex-row flex-wrap gap-x-8 gap-y-5 md:flex-col md:gap-y-7"
            >
              {ZONES.map((zone, i) => (
                <button
                  key={zone.key}
                  type="button"
                  onMouseEnter={() => setActiveZone(i)}
                  onFocus={() => setActiveZone(i)}
                  onClick={() => setActiveZone(i)}
                  className="group flex items-center gap-4 text-left"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: activeZone === i ? zone.accent : "var(--color-line)",
                      transform: activeZone === i ? "scale(1.5)" : "scale(1)",
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="font-display text-[1.5rem] font-medium tracking-[-0.01em] transition-colors duration-300 sm:text-[1.9rem]"
                    style={{ color: activeZone === i ? zone.accent : "var(--color-fg)" }}
                  >
                    {zone.label}
                  </span>
                </button>
              ))}
            </div>

            <div
              data-reveal
              className="rounded-[1.75rem] border border-line bg-bg-elevated p-8 md:p-10"
            >
              <p
                className="font-display text-[0.68rem] tracking-[0.18em] uppercase"
                style={{ color: ZONES[activeZone].accent }}
              >
                {ZONES[activeZone].label}
              </p>
              <p className="mt-4 max-w-md text-balance font-body text-lg leading-relaxed text-fg/80">
                {ZONES[activeZone].line}
              </p>
              <div className="mt-7 flex flex-col gap-1 border-t border-line pt-6">
                {ZONES[activeZone].services.map((name) => (
                  <Link
                    key={name}
                    href={`/contact?service=${encodeURIComponent(name)}`}
                    className="group flex items-center justify-between gap-4 rounded-lg py-2.5 transition-colors duration-200 hover:bg-bg/60"
                  >
                    <span className="font-display text-base font-medium text-fg sm:text-lg">
                      {name}
                    </span>
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-fg opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                      style={{ color: ZONES[activeZone].accent }}
                      aria-hidden="true"
                    >
                      <ArrowIcon />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE BRIDGE TO REALITY — real work, not illustration */}
      <section className="border-t border-line bg-bg-elevated px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 border-b border-line pb-8 md:flex-row md:items-end">
            <h2
              data-reveal
              className="max-w-xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
            >
              Every one of these is somewhere real.
            </h2>
            <p data-reveal className="max-w-xs font-body text-base text-muted">
              No renders, no stock photography — three frames from sites
              we&rsquo;ve actually built.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {BRIDGE_PHOTOS.map((photo) => (
              <div
                key={photo.src}
                data-reveal
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-line"
              >
                <Image
                  src={photo.src}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-transparent" />
                <p className="absolute bottom-5 left-5 font-display text-sm text-fg/90">
                  {photo.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE FULL DIRECTORY — quiet, for reference */}
      <section className="border-t border-line bg-bg px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="flex items-baseline justify-between gap-4 border-b border-line pb-6">
            <p className="font-display text-[0.68rem] tracking-[0.18em] text-muted uppercase">
              All fifteen, by name
            </p>
          </div>
          <div className="mt-2 columns-1 sm:columns-2 lg:columns-3">
            {ALL_SERVICES.map((name, i) => (
              <Link
                key={name}
                href={`/contact?service=${encodeURIComponent(name)}`}
                data-reveal
                className="group flex items-baseline gap-3 border-b border-line py-4 transition-colors duration-200"
                style={{ breakInside: "avoid" }}
              >
                <span className="font-display text-[0.65rem] text-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-base font-medium text-fg transition-colors duration-200">
                  {name}
                </span>
                <span
                  className="ml-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ color: ACCENTS[i % ACCENTS.length] }}
                  aria-hidden="true"
                >
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MAINTENANCE — the ongoing, living half */}
      <section
        ref={maintenanceRef}
        className="relative overflow-hidden border-t border-line bg-bg-elevated px-6 py-20 md:px-10 md:py-28"
      >
        <MaintenanceBloomCanvas sectionRef={maintenanceRef} />
        <div className="relative mx-auto max-w-6xl">
          <h2
            data-reveal
            className="max-w-lg text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
          >
            A landscape is never really finished.
          </h2>
          <p data-reveal className="mt-4 max-w-md font-body text-base text-muted">
            Monthly visits, seasonal resets, and the plants and water
            features that need someone paying attention year-round.
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-line bg-bg px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-10 md:flex-row md:items-end">
          <h2
            data-reveal
            className="max-w-lg text-balance font-display text-[2.2rem] font-medium leading-[1.05] tracking-[-0.01em] text-fg sm:text-[2.8rem]"
          >
            Have a project in mind?
          </h2>
          <div data-reveal className="max-w-sm">
            <p className="font-body text-base text-muted sm:text-lg">
              Tell us where your site is and what you have in mind —
              we&rsquo;ll take it from there.
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-3 rounded-full border border-line px-6 py-3 font-display text-[0.68rem] tracking-[0.14em] text-fg uppercase transition-colors duration-300 hover:border-teal/50 hover:text-teal"
            >
              Start a conversation
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:translate-x-1 group-hover:border-teal/50">
                <ArrowIcon />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
