"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEAL = "#2b8870";
const TERRACOTTA = "#c05f38";
const BLUSH = "#c97079";
const STONE = "#a79e8c";
const ACCENTS = [TEAL, TERRACOTTA, BLUSH];

// Four real moments from real sites — not a modelled brick-to-bloom
// animation — standing in for the four phases every project actually
// goes through. Each one is a genuine photo of that kind of work, not a
// single project documented start to finish.
const JOURNEY_STAGES = [
  {
    num: "01",
    name: "Discovery",
    line: "We start by reading the site itself — light, soil, what's already growing, what the space is asking to become.",
    image: "/assets/process/discovery.webp",
  },
  {
    num: "02",
    name: "Planning",
    line: "Materials, layout, and planting are worked out on paper before a single brick moves.",
    image: "/assets/process/planning.webp",
  },
  {
    num: "03",
    name: "Execution",
    line: "Structure goes in first — brickwork and hardscape, the bones the rest of the space leans on.",
    image: "/assets/process/execution.webp",
  },
  {
    num: "04",
    name: "Grow",
    line: "Planting takes root, and the landscape starts to fill in and carry on growing long after we've left.",
    image: "/assets/process/grow.webp",
  },
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

function Eyebrow({ children }: { children: string }) {
  return (
    <p
      data-reveal
      className="flex items-center gap-3 font-display text-[0.68rem] tracking-[0.2em] text-teal uppercase"
    >
      <span className="h-px w-8 bg-line" />
      {children}
    </p>
  );
}

export default function ServicesIndex() {
  const rootRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef<HTMLElement>(null);

  const journeyRootRef = useRef<HTMLDivElement>(null);
  const journeyStageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const journeyContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const journeyRailRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

      // --- The Journey: four real photographs, each rising up from the
      // bottom to cover the one before it as you scroll — the structure
      // literally layering up, the same idea the old 3D sequence was
      // reaching for, told with real sites instead of modelled geometry.
      // Desktop + motion-safe only; mobile gets the static list below.
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop) return;

      const stages = journeyStageRefs.current;
      const content = journeyContentRefs.current;
      const rail = journeyRailRefs.current;
      const n = JOURNEY_STAGES.length;

      gsap.set(stages.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(content, { autoAlpha: 0 });
      gsap.set(content[0], { autoAlpha: 1 });
      gsap.set(rail, { opacity: 0.35 });
      gsap.set(rail[0], { opacity: 1 });

      let activeStage = 0;
      const segment = 1 / n;

      const applyJourney = (progress: number) => {
        stages.forEach((el, i) => {
          if (!el || i === 0) return;
          const segProgress = gsap.utils.clamp(
            0,
            1,
            (progress - (i - 1) * segment) / segment
          );
          gsap.set(el, {
            clipPath: `inset(${100 - segProgress * 100}% 0% 0% 0%)`,
          });
        });

        const idx = Math.min(n - 1, Math.floor(progress * n));
        if (idx !== activeStage) {
          const prev = activeStage;
          activeStage = idx;
          gsap.to(content[prev], { autoAlpha: 0, duration: 0.3 });
          gsap.to(content[idx], { autoAlpha: 1, duration: 0.3 });
          gsap.to(rail[prev], { opacity: 0.35, duration: 0.3 });
          gsap.to(rail[idx], { opacity: 1, duration: 0.3 });
        }
      };

      ScrollTrigger.create({
        trigger: journeyRootRef.current,
        start: "top top",
        end: "+=360%",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyJourney(self.progress),
      });

      applyJourney(0);
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      {/* ENTRY — a real finished space, not a rendered one */}
      <section
        ref={openingRef}
        className="relative flex min-h-[26rem] w-full items-end overflow-hidden border-t border-line bg-bg px-6 pb-14 pt-24 md:h-[100dvh] md:min-h-0 md:pb-24 md:pt-0 md:px-10"
      >
        <Image
          src="/assets/landscape/awakens-character.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-bg/95 to-transparent" />
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
            Scroll through how we get there. Then browse all fifteen
            services below.
          </p>
        </div>
      </section>

      {/* THE JOURNEY — four real phases, each photo rising to cover the
          last as the project moves forward */}
      <div
        ref={journeyRootRef}
        className="relative hidden h-[100dvh] w-full overflow-hidden border-t border-line bg-bg motion-safe:md:block"
      >
        {JOURNEY_STAGES.map((stage, i) => (
          <div
            key={stage.num}
            ref={(el) => {
              journeyStageRefs.current[i] = el;
            }}
            className="absolute inset-0"
          >
            <Image
              src={stage.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-bg/95 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-between px-6 py-10 md:px-14 md:py-16">
          <div className="flex items-center justify-between gap-6">
            <p className="font-display text-[0.68rem] tracking-[0.22em] text-teal uppercase">
              The Journey
            </p>
            <div className="flex items-center gap-3">
              {JOURNEY_STAGES.map((stage, i) => (
                <button
                  key={stage.num}
                  type="button"
                  ref={(el) => {
                    journeyRailRefs.current[i] = el;
                  }}
                  onClick={() => {
                    const trigger = ScrollTrigger.getById("journey");
                    if (trigger) {
                      const y =
                        trigger.start +
                        (i / JOURNEY_STAGES.length) *
                          (trigger.end - trigger.start) +
                        4;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  className="font-display text-[0.62rem] tracking-[0.1em] text-fg uppercase transition-opacity"
                >
                  {stage.num}
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[9rem] max-w-xl">
            {JOURNEY_STAGES.map((stage, i) => (
              <div
                key={stage.num}
                ref={(el) => {
                  journeyContentRefs.current[i] = el;
                }}
                className="absolute inset-x-0 bottom-0"
              >
                <p className="font-display text-[0.68rem] tracking-[0.22em] text-terracotta uppercase">
                  {stage.num} — {stage.name}
                </p>
                <p className="mt-3 max-w-lg text-balance font-display text-[1.7rem] font-medium leading-[1.15] tracking-[-0.01em] text-fg sm:text-[2.1rem]">
                  {stage.line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / reduced-motion fallback — the same four real photos,
          read as a static stacked list. */}
      <section className="hidden border-t border-line bg-bg px-6 py-20 max-md:block motion-reduce:block md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl">
          <Eyebrow>The Journey</Eyebrow>
          <ul className="mt-10 flex flex-col gap-10">
            {JOURNEY_STAGES.map((stage) => (
              <li key={stage.num} className="flex gap-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line">
                  <Image
                    src={stage.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-display text-[0.68rem] tracking-[0.22em] text-terracotta uppercase">
                    {stage.num} — {stage.name}
                  </span>
                  <p className="mt-2 font-display text-[1.15rem] font-medium leading-[1.25] tracking-[-0.01em] text-fg">
                    {stage.line}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* THE MATERIALS — the elements of the landscape, and what each becomes */}
      <section className="border-t border-line bg-bg px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Eyebrow>The Materials</Eyebrow>
          <h2
            data-reveal
            className="mt-4 max-w-2xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
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

      {/* THE PROOF — real work, not illustration */}
      <section className="border-t border-line bg-bg-elevated px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-4 border-b border-line pb-8 md:flex-row md:items-end">
            <div>
              <Eyebrow>The Proof</Eyebrow>
              <h2
                data-reveal
                className="mt-4 max-w-xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
              >
                Every one of these is somewhere real.
              </h2>
            </div>
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

      {/* THE DIRECTORY — quiet, for reference */}
      <section className="border-t border-line bg-bg px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="border-b border-line pb-6">
            <Eyebrow>The Directory</Eyebrow>
            <p className="mt-4 font-body text-base text-muted">
              All fifteen, by name.
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

      {/* THE ONGOING STORY — the part that never really ends */}
      <section className="relative overflow-hidden border-t border-line bg-bg-elevated px-6 py-20 md:min-h-[28rem] md:px-10 md:py-28">
        <Image
          src="/assets/services/maintenance.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-elevated/96 via-bg-elevated/80 to-bg-elevated/35" />
        <div className="relative mx-auto max-w-6xl">
          <Eyebrow>The Ongoing Story</Eyebrow>
          <h2
            data-reveal
            className="mt-4 max-w-lg text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
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
        <div className="mx-auto max-w-6xl">
          <Eyebrow>Let&rsquo;s Begin</Eyebrow>
          <div className="mt-4 flex flex-col justify-between gap-10 md:flex-row md:items-end">
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
        </div>
      </section>
    </div>
  );
}
