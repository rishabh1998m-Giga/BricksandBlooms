"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Step = {
  index: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  eyebrow: string;
};

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16.5 16.5 13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BulbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5a5.5 5.5 0 0 0-3 10.1c.5.35.8.9.8 1.5v.4h4.4v-.4c0-.6.3-1.15.8-1.5A5.5 5.5 0 0 0 10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M8.2 17h3.6M8.7 18.5h2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5a7.5 7.5 0 1 0 0 15c1 0 1.5-.6 1.5-1.4 0-.4-.15-.7-.4-1-.25-.3-.4-.6-.4-1 0-.8.65-1.4 1.45-1.4h1.5c1.9 0 3.4-1.55 3.4-3.5 0-3.7-3.3-6.7-7.05-6.7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="6.6" cy="9" r="1" fill="currentColor" />
      <circle cx="9.2" cy="6.2" r="1" fill="currentColor" />
      <circle cx="12.8" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5c2.5 1 4 3.6 4 6.8 0 1.6-.4 3-1 4.2l-3-1.2-3 1.2c-.6-1.2-1-2.6-1-4.2 0-3.2 1.5-5.8 4-6.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8.5" r="1.3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 13.5 5.5 17M13 13.5l1.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const STEPS: Step[] = [
  {
    index: "//01",
    title: "Discovery",
    description:
      "We begin by understanding your space, lifestyle, and vision. Site visits, soil study, sunlight patterns, and functional needs are carefully mapped before design begins.",
    icon: <SearchIcon />,
    image: "/assets/process/discovery.webp",
    eyebrow: "Landscape",
  },
  {
    index: "//02",
    title: "Planning & Design",
    description:
      "With insights in place, we create thoughtful landscape concepts. Layouts, plant selection, zoning, irrigation planning, and 3D visualizations ensure clarity before execution.",
    icon: <BulbIcon />,
    image: "/assets/process/planning.webp",
    eyebrow: "Architecture",
  },
  {
    index: "//03",
    title: "Execution & Build",
    description:
      "Design comes to life with precision. From sourcing materials to on-site supervision, we manage every detail to ensure quality and timeline control.",
    icon: <PaletteIcon />,
    image: "/assets/process/execution.webp",
    eyebrow: "Materials & Craft",
  },
  {
    index: "//04",
    title: "Grow & Maintain",
    description:
      "Installation is just the beginning. We guide plant care, maintenance schedules, and seasonal upgrades to ensure your landscape thrives long-term.",
    icon: <RocketIcon />,
    image: "/assets/process/grow.webp",
    eyebrow: "Living Landscape",
  },
];

export default function SceneProcess() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<HTMLDivElement[]>([]);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const railItemRefs = useRef<HTMLDivElement[]>([]);
  const railFillRef = useRef<HTMLDivElement>(null);

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

      gsap.set(reveals, { opacity: 0, y: 28 });
      ScrollTrigger.batch(reveals, {
        start: "top 85%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
          }),
      });

      // A pinned chapter walkthrough — scroll steps through the four stages
      // one full-bleed photo at a time, instead of a static grid.
      const photos = photoRefs.current;
      const panels = panelRefs.current;
      const railItems = railItemRefs.current;

      gsap.set(photos, { autoAlpha: 0 });
      gsap.set(photos[0], { autoAlpha: 1 });
      gsap.set(panels, { autoAlpha: 0, y: 28 });
      gsap.set(panels[0], { autoAlpha: 1, y: 0 });
      gsap.set(railItems, { opacity: 0.35 });
      gsap.set(railItems[0], { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (railFillRef.current) {
              gsap.set(railFillRef.current, { scaleY: self.progress });
            }
          },
        },
        defaults: { ease: "none" },
      });

      STEPS.forEach((_, i) => {
        if (i === 0) return;
        const pos = i - 0.15;
        tl.to(photos[i - 1], { autoAlpha: 0, duration: 0.5 }, pos)
          .to(photos[i], { autoAlpha: 1, duration: 0.6 }, pos + 0.05)
          .to(
            panels[i - 1],
            { autoAlpha: 0, y: -20, duration: 0.35, ease: "power2.in" },
            pos
          )
          .to(
            panels[i],
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
            pos + 0.15
          )
          .to(railItems[i - 1], { opacity: 0.35, duration: 0.3 }, pos)
          .to(railItems[i], { opacity: 1, duration: 0.3 }, pos + 0.1);
      });

      // A trailing hold so the section doesn't unpin the instant the last
      // chapter arrives — gives it a beat to actually be read.
      tl.to({}, { duration: 0.4 });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-line bg-bg"
    >
      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-24 md:px-10 md:pb-20 md:pt-32">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-line" />
          <p className="font-display text-[0.68rem] tracking-[0.18em] text-teal uppercase">
            How We Work
          </p>
        </div>

        <div className="mt-6 flex items-start justify-between gap-6 border-b border-line pb-10">
          <div className="max-w-2xl">
            <h2
              data-reveal
              className="text-balance font-display text-[2.6rem] font-bold leading-[1.0] tracking-[-0.01em] text-fg sm:text-[3.4rem] md:text-[4.2rem]"
            >
              The process behind every landscape
            </h2>
            <p
              data-reveal
              className="mt-4 max-w-lg text-balance font-body text-base text-muted sm:text-lg"
            >
              We work with clarity and care. Every step is designed to
              transform your space with confidence.
            </p>
          </div>

          <div
            data-reveal
            className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line font-display text-[0.7rem] tracking-[0.08em] text-fg/80 sm:flex"
            aria-hidden="true"
          >
            B&amp;B
          </div>
        </div>
      </div>

      {/* Cinematic chapter walkthrough — pinned, scroll-scrubbed */}
      <div
        ref={stageRef}
        className="relative hidden h-[100dvh] w-full overflow-hidden motion-safe:block"
      >
        {STEPS.map((step, i) => (
          <div
            key={step.index}
            ref={(el) => {
              if (el) photoRefs.current[i] = el;
            }}
            className="absolute inset-0 [animation:kenburns_18s_ease-in-out_infinite]"
          >
            <Image
              src={step.image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to top, var(--color-bg) 0%, var(--color-bg) 14%, color-mix(in srgb, var(--color-bg) 55%, transparent) 34%, transparent 60%)",
          }}
        />

        <div className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 items-stretch gap-5 rounded-2xl bg-bg/40 px-4 py-4 backdrop-blur-md md:right-14 md:flex">
          <div className="relative w-px self-stretch bg-line/50">
            <div
              ref={railFillRef}
              className="absolute inset-x-0 top-0 w-px origin-top bg-teal"
              style={{ height: "100%", transform: "scaleY(0)" }}
            />
          </div>
          <div className="flex flex-col justify-between gap-10 py-1">
            {STEPS.map((step, i) => (
              <div
                key={step.index}
                ref={(el) => {
                  if (el) railItemRefs.current[i] = el;
                }}
                className="text-right"
              >
                <p className="font-display text-[0.7rem] tracking-[0.14em] text-fg">
                  {step.index}
                </p>
                <p className="mt-1 whitespace-nowrap font-display text-[0.58rem] tracking-[0.12em] text-muted uppercase">
                  {step.eyebrow}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-8 md:p-14">
          <div className="relative min-h-[230px] max-w-2xl sm:min-h-[210px] md:min-h-[190px]">
            {STEPS.map((step, i) => (
              <div
                key={step.index}
                ref={(el) => {
                  if (el) panelRefs.current[i] = el;
                }}
                className="absolute inset-0"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-bg/40 text-teal backdrop-blur-sm">
                    {step.icon}
                  </span>
                  <span className="whitespace-nowrap rounded-full border border-line bg-bg/40 px-3 py-1 font-display text-[0.6rem] tracking-[0.14em] text-muted uppercase backdrop-blur-sm">
                    {step.eyebrow}
                  </span>
                </div>
                <p className="mt-6 flex items-baseline gap-3 font-display text-[2.1rem] font-bold leading-[1.0] tracking-[-0.01em] text-fg sm:text-[2.8rem] md:text-[3.6rem]">
                  <span className="text-[0.85rem] font-normal tracking-[0.1em] text-muted">
                    {step.index}
                  </span>
                  {step.title}
                </p>
                <p className="mt-4 max-w-lg font-body text-base leading-relaxed text-fg/80 sm:text-lg">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reduced-motion fallback — every step visible at once, no pinning */}
      <div className="mx-auto hidden max-w-6xl px-6 pb-24 motion-reduce:block md:px-10 md:pb-32">
        <div className="grid gap-6">
          {STEPS.map((step) => (
            <div
              key={step.index}
              className="flex flex-col gap-6 rounded-2xl border border-line p-8 sm:flex-row sm:items-center"
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-48">
                <Image
                  src={step.image}
                  alt=""
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-teal">
                    {step.icon}
                  </span>
                  <span className="font-display text-[0.6rem] tracking-[0.14em] text-muted uppercase">
                    {step.eyebrow}
                  </span>
                </div>
                <p className="mt-3 flex items-baseline gap-2 font-display text-lg font-bold tracking-[0.01em] text-fg">
                  <span className="text-[0.75rem] font-normal tracking-[0.1em] text-muted">
                    {step.index}
                  </span>
                  {step.title.toUpperCase()}
                </p>
                <p className="mt-2 max-w-md font-body text-[0.95rem] leading-relaxed text-fg/80">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
