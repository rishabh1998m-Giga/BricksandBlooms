"use client";

import { useRef, type ReactElement } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEAL = "#2b8870";
const TERRACOTTA = "#c05f38";
const BLUSH = "#c97079";
const STONE = "#a79e8c";

type IconComponent = (props: { className?: string }) => ReactElement;

function IconDiscovery({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <circle cx="13" cy="13" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M19 19 27 27" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 13c0-2.2 1.8-4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconPlanning({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="6" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6 13h20M13 6v20" stroke="currentColor" strokeWidth="1.1" strokeDasharray="2 3" />
      <circle cx="19" cy="19" r="2.2" fill="currentColor" />
    </svg>
  );
}

function IconExecution({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="19" width="8" height="5" rx="0.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="15" y="19" width="8" height="5" rx="0.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="10" y="14" width="8" height="5" rx="0.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M21 10l4-3M25 7v4h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconGrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M16 27V15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M16 15C16 10 20 6 25 6C25 11 21 15 16 15Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M16 19C16 15.1 12.9 12 9 12C9 15.9 12.1 19 16 19Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBrick({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 10h10M18 10h10M4 16h6M14 16h10M4 22h10M18 22h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPlant({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M16 27V15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M16 15C16 9.5 20.5 5 26 5C26 10.5 21.5 15 16 15Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M16 19C16 15.1 12.9 12 9 12C9 15.9 12.1 19 16 19Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconWater({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M16 5c4 6 7 10.2 7 14a7 7 0 1 1-14 0c0-3.8 3-8 7-14Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTerrain({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 22l6-9 5 6 4-5 9 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 25h24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconPlanter({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M9 13h14l-2 13H11L9 13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16 13V9c0-2 1.5-4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 9c0-1.8-1.3-3.3-3-3.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconLoop({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 12a8 8 0 0 1 14-5.3M24 20a8 8 0 0 1-14 5.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M22 4v4h-4M10 28v-4h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

// The four phases every project moves through, illustrated with simple
// line icons instead of photographed the way they used to be — the page
// is about the process, not a documentary of one particular site.
const PROCESS_STEPS: {
  num: string;
  name: string;
  line: string;
  icon: IconComponent;
}[] = [
  {
    num: "01",
    name: "Discovery",
    line: "We read the site itself — light, soil, what's already growing, what the space is asking to become.",
    icon: IconDiscovery,
  },
  {
    num: "02",
    name: "Planning",
    line: "Materials, layout, and planting are worked out on paper before a single brick moves.",
    icon: IconPlanning,
  },
  {
    num: "03",
    name: "Execution",
    line: "Structure goes in first — brickwork and hardscape, the bones the rest of the space leans on.",
    icon: IconExecution,
  },
  {
    num: "04",
    name: "Grow",
    line: "Planting takes root, and the landscape keeps filling in long after we've left.",
    icon: IconGrow,
  },
];

type Zone = {
  key: string;
  label: string;
  accent: string;
  line: string;
  services: string[];
  icon: IconComponent;
};

const ZONES: Zone[] = [
  {
    key: "brick",
    label: "Brick & Stone",
    accent: TERRACOTTA,
    line: "Where structure gives a landscape its bones — the architecture that holds everything else up.",
    services: ["Hardscape", "Pergola & Fabrication"],
    icon: IconBrick,
  },
  {
    key: "plant",
    label: "Plant",
    accent: TEAL,
    line: "Softscape and living walls — the parts of a landscape that grow, breathe, and change with the seasons.",
    services: ["Terrace Garden", "Vertical Garden", "Softscape", "Moss Wall"],
    icon: IconPlant,
  },
  {
    key: "water",
    label: "Water",
    accent: BLUSH,
    line: "Pools, fountains, and the quiet engineering of irrigation — water in motion and water at rest.",
    services: ["Swimming Pools", "Water Fountains & Ponds", "Landscape Irrigation"],
    icon: IconWater,
  },
  {
    key: "terrain",
    label: "Terrain",
    accent: STONE,
    line: "The full shape of a site — villas, commercial grounds, landscapes built at every scale.",
    services: ["Villa Landscaping", "Luxury Landscapes", "Commercial Landscaping"],
    icon: IconTerrain,
  },
  {
    key: "planter",
    label: "Planter",
    accent: TERRACOTTA,
    line: "The ongoing relationship — indoor greenery, the vessels that bring nature in, and the care that keeps it alive.",
    services: ["Garden Maintenance", "Office Plant Rental", "FRP Planters"],
    icon: IconPlanter,
  },
];

const ALL_SERVICES_WITH_ZONE = ZONES.flatMap((zone) =>
  zone.services.map((name) => ({ name, accent: zone.accent }))
);

export default function ServicesIndex() {
  const rootRef = useRef<HTMLDivElement>(null);

  const heroArchRef = useRef<SVGPathElement>(null);
  const heroVineRef = useRef<SVGPathElement>(null);
  const heroLeafRefs = useRef<(SVGEllipseElement | null)[]>([]);

  const catalogRootRef = useRef<HTMLDivElement>(null);
  const catalogTrackRef = useRef<HTMLDivElement>(null);
  const catalogRailFillRef = useRef<HTMLSpanElement>(null);
  const catalogIndexRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      if (prefersReduced) {
        gsap.set(reveals, { opacity: 1, y: 0 });
        if (heroArchRef.current) gsap.set(heroArchRef.current, { strokeDashoffset: 0 });
        if (heroVineRef.current) gsap.set(heroVineRef.current, { strokeDashoffset: 0 });
        if (heroLeafRefs.current.length) gsap.set(heroLeafRefs.current, { scale: 1 });
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

      // --- Hero illustration: an arch and a vine drawing themselves on,
      // in place of a photograph — the brand mark's own line language,
      // scaled up.
      const archEl = heroArchRef.current;
      const vineEl = heroVineRef.current;
      const leaves = heroLeafRefs.current;
      if (archEl && vineEl) {
        const archLen = archEl.getTotalLength();
        const vineLen = vineEl.getTotalLength();
        gsap.set(archEl, { strokeDasharray: archLen, strokeDashoffset: archLen });
        gsap.set(vineEl, { strokeDasharray: vineLen, strokeDashoffset: vineLen });
        gsap.set(leaves, { scale: 0, transformOrigin: "center" });

        gsap
          .timeline({ delay: 0.2 })
          .to(archEl, { strokeDashoffset: 0, duration: 1.3, ease: "power2.inOut" })
          .to(vineEl, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, "-=0.85")
          .to(leaves, { scale: 1, duration: 0.5, ease: "back.out(2.2)", stagger: 0.12 }, "-=0.45");
      }

      // --- The Catalog: five materials scrolled through sideways instead
      // of listed down the page — a pinned horizontal pan. Desktop +
      // motion-safe only; mobile gets the swipeable carousel below.
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop) return;

      const catalogTrack = catalogTrackRef.current;
      const catalogFill = catalogRailFillRef.current;
      const catalogIndexEl = catalogIndexRef.current;
      if (catalogTrack) {
        const panelCount = ZONES.length;
        gsap.set(catalogTrack, { xPercent: 0 });
        gsap.set(catalogFill, { scaleX: 0, transformOrigin: "left center" });

        ScrollTrigger.create({
          trigger: catalogRootRef.current,
          start: "top top",
          end: () => "+=" + (panelCount - 1) * window.innerWidth * 0.7,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(catalogTrack, {
              xPercent: (-100 * (panelCount - 1) * self.progress) / panelCount,
            });
            if (catalogFill) {
              gsap.set(catalogFill, { scaleX: self.progress });
            }
            if (catalogIndexEl) {
              const idx = Math.min(
                panelCount - 1,
                Math.floor(self.progress * panelCount)
              );
              catalogIndexEl.textContent = String(idx + 1).padStart(2, "0");
            }
          },
        });
      }
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      {/* ENTRY — an arch and a vine, drawn in line instead of photographed */}
      <section className="relative flex min-h-[30rem] w-full items-center overflow-hidden border-t border-line bg-bg px-6 py-20 md:min-h-[34rem] md:px-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1fr_auto]">
          <div className="order-2 md:order-1">
            <h1
              data-reveal
              className="max-w-xl text-balance font-display text-[2.4rem] font-medium leading-[1.02] tracking-[-0.01em] text-fg sm:text-[3.2rem] md:text-[3.6rem]"
            >
              Everything between a bare plot and a finished garden.
            </h1>
            <p
              data-reveal
              className="mt-5 max-w-md text-balance font-body text-base text-muted sm:text-lg"
            >
              Fifteen disciplines, one studio. Scroll through how we get
              there.
            </p>
          </div>

          <svg
            viewBox="0 0 400 460"
            className="order-1 h-[16rem] w-auto shrink-0 justify-self-center md:order-2 md:h-[22rem]"
            aria-hidden="true"
          >
            <path
              ref={heroArchRef}
              d="M70 440 V220 C70 124 139 50 200 50 C261 50 330 124 330 220 V440"
              stroke="var(--color-fg)"
              strokeOpacity="0.7"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              ref={heroVineRef}
              d="M200 440 C196 360 230 330 206 270 C182 210 220 180 204 120 C196 88 210 70 200 50"
              stroke={TEAL}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {[
              { cx: 214, cy: 330, rot: -30 },
              { cx: 188, cy: 250, rot: 30 },
              { cx: 214, cy: 170, rot: -30 },
              { cx: 190, cy: 100, rot: 30 },
            ].map((leaf, i) => (
              <ellipse
                key={i}
                ref={(el) => {
                  heroLeafRefs.current[i] = el;
                }}
                cx={leaf.cx}
                cy={leaf.cy}
                rx="13"
                ry="6.5"
                transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
                fill={TERRACOTTA}
                opacity="0.85"
              />
            ))}
          </svg>
        </div>
      </section>

      {/* THE PROCESS — four phases, told in icon and copy, not photographed */}
      <section className="border-t border-line bg-bg px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Eyebrow>The Process</Eyebrow>
          <h2
            data-reveal
            className="mt-4 max-w-xl text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
          >
            Four phases, every project.
          </h2>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.num}
                data-reveal
                className="flex flex-col gap-4 border-t border-line pt-6"
              >
                <step.icon className="h-8 w-8 text-teal" />
                <div>
                  <span className="font-display text-[0.65rem] tracking-[0.18em] text-muted uppercase">
                    {step.num} — {step.name}
                  </span>
                  <p className="mt-2 font-display text-base font-medium leading-snug text-fg">
                    {step.line}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE CATALOG — five materials, scrolled through sideways instead
          of hovered over a list. Desktop + motion-safe only; mobile and
          reduced-motion get the swipeable carousel below. */}
      <div
        ref={catalogRootRef}
        className="relative hidden h-[100dvh] w-full flex-col overflow-hidden border-t border-line bg-bg motion-safe:md:flex"
      >
        <div className="flex items-center justify-between px-6 pt-10 md:px-14">
          <div>
            <p className="font-display text-[0.68rem] tracking-[0.22em] text-teal uppercase">
              The Catalog
            </p>
            <h2 className="mt-3 max-w-md text-balance font-display text-[1.6rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2rem]">
              Five materials. Fifteen disciplines.
            </h2>
          </div>
          <p className="shrink-0 font-display text-sm tracking-[0.08em] text-muted tabular-nums">
            <span ref={catalogIndexRef}>01</span> /{" "}
            {String(ZONES.length).padStart(2, "0")}
          </p>
        </div>

        <div className="relative mt-6 flex-1 overflow-hidden">
          <div ref={catalogTrackRef} className="flex h-full w-[500%]">
            {ZONES.map((zone, i) => (
              <div
                key={zone.key}
                className="relative flex h-full w-[20%] shrink-0 flex-col justify-between overflow-hidden px-6 py-10 md:px-14"
                style={{ backgroundColor: `${zone.accent}10` }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-display text-[13rem] font-medium leading-none opacity-[0.06] md:text-[16rem]"
                  style={{ color: zone.accent }}
                >
                  {zone.label}
                </span>

                <div className="relative max-w-md">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center"
                    style={{ color: zone.accent }}
                  >
                    <zone.icon className="h-8 w-8" />
                  </span>
                  <span className="mt-4 block font-display text-[0.65rem] tracking-[0.18em] text-muted uppercase">
                    {String(i + 1).padStart(2, "0")} — Material
                  </span>
                  <h3
                    className="mt-3 text-balance font-display text-[2.6rem] font-medium leading-[0.95] tracking-[-0.01em] sm:text-[3.4rem]"
                    style={{ color: zone.accent }}
                  >
                    {zone.label}
                  </h3>
                  <p className="mt-4 max-w-sm text-balance font-body text-base text-fg/80 sm:text-lg">
                    {zone.line}
                  </p>
                </div>

                <div className="relative flex flex-col gap-1 border-t border-line pt-5">
                  {zone.services.map((name) => (
                    <Link
                      key={name}
                      href={`/contact?service=${encodeURIComponent(name)}`}
                      className="group flex items-center justify-between gap-4 rounded-lg py-2 transition-colors duration-200 hover:bg-bg/60"
                    >
                      <span className="font-display text-lg font-medium text-fg sm:text-xl">
                        {name}
                      </span>
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                        style={{ color: zone.accent }}
                        aria-hidden="true"
                      >
                        <ArrowIcon />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 px-6 pb-8 md:px-14">
          <div className="relative h-px flex-1 bg-line">
            <span
              ref={catalogRailFillRef}
              className="absolute inset-y-0 left-0 w-full bg-teal"
            />
          </div>
          <p className="shrink-0 font-display text-[0.6rem] tracking-[0.14em] text-muted uppercase">
            Scroll
          </p>
        </div>
      </div>

      {/* Mobile / reduced-motion fallback — the same five materials,
          swiped through as snap-scrolling cards. */}
      <section className="hidden border-t border-line bg-bg px-6 py-20 max-md:block motion-reduce:block md:px-10 md:py-28">
        <Eyebrow>The Catalog</Eyebrow>
        <h2
          data-reveal
          className="mt-4 max-w-md text-balance font-display text-[2rem] font-medium leading-[1.1] tracking-[-0.01em] text-fg sm:text-[2.6rem]"
        >
          Five materials. Fifteen disciplines.
        </h2>
        <p data-reveal className="mt-3 font-body text-sm text-muted">
          Swipe to explore all five.
        </p>

        <div className="mt-8 -mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4">
          {ZONES.map((zone, i) => (
            <div
              key={zone.key}
              data-reveal
              className="flex w-[85%] shrink-0 snap-center flex-col justify-between rounded-[1.75rem] border border-line p-7"
              style={{ backgroundColor: `${zone.accent}10` }}
            >
              <div>
                <span
                  className="inline-flex h-9 w-9 items-center justify-center"
                  style={{ color: zone.accent }}
                >
                  <zone.icon className="h-7 w-7" />
                </span>
                <span className="mt-3 block font-display text-[0.65rem] tracking-[0.18em] text-muted uppercase">
                  {String(i + 1).padStart(2, "0")} — Material
                </span>
                <h3
                  className="mt-2 font-display text-[1.8rem] font-medium leading-[1.0] tracking-[-0.01em]"
                  style={{ color: zone.accent }}
                >
                  {zone.label}
                </h3>
                <p className="mt-3 font-body text-sm text-fg/80">{zone.line}</p>
              </div>
              <div className="mt-6 flex flex-col gap-1 border-t border-line pt-4">
                {zone.services.map((name) => (
                  <Link
                    key={name}
                    href={`/contact?service=${encodeURIComponent(name)}`}
                    className="flex items-center justify-between gap-3 py-1.5"
                  >
                    <span className="font-display text-base font-medium text-fg">
                      {name}
                    </span>
                    <span style={{ color: zone.accent }} aria-hidden="true">
                      <ArrowIcon />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
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
          <div className="mt-8 flex flex-wrap gap-3">
            {ALL_SERVICES_WITH_ZONE.map(({ name, accent }) => (
              <Link
                key={name}
                href={`/contact?service=${encodeURIComponent(name)}`}
                data-reveal
                className="group inline-flex items-center gap-2.5 rounded-full border border-line px-5 py-2.5 transition-colors duration-200 hover:bg-bg-elevated"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: accent }}
                  aria-hidden="true"
                />
                <span className="font-display text-sm font-medium text-fg">
                  {name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA — the ongoing-care note folds in here instead of
          getting its own full section */}
      <section className="border-t border-line bg-bg px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Eyebrow>Let&rsquo;s Begin</Eyebrow>
          <div className="mt-4 flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div className="max-w-lg">
              <h2
                data-reveal
                className="text-balance font-display text-[2.2rem] font-medium leading-[1.05] tracking-[-0.01em] text-fg sm:text-[2.8rem]"
              >
                Have a project in mind?
              </h2>
              <p
                data-reveal
                className="mt-4 flex items-start gap-2.5 font-body text-sm text-muted"
              >
                <IconLoop className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                <span>
                  A landscape is never really finished — monthly visits
                  and seasonal resets keep it that way, long after we
                  hand it over.
                </span>
              </p>
            </div>
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
