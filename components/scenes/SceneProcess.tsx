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
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const imageRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      if (prefersReduced) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(targets, { opacity: 0, y: 28 });
      ScrollTrigger.batch(targets, {
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

      // Each card's photo drifts toward the cursor — a quiet sense that
      // this is one continuous environment you're looking into, not a
      // flat image behind text.
      const cleanups: (() => void)[] = [];
      cardRefs.current.forEach((card, i) => {
        const img = imageRefs.current[i];
        if (!card || !img) return;

        const handleMove = (e: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(img, {
            xPercent: px * 6,
            yPercent: py * 6,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        const handleLeave = () => {
          gsap.to(img, {
            xPercent: 0,
            yPercent: 0,
            duration: 0.7,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        card.addEventListener("pointermove", handleMove);
        card.addEventListener("pointerleave", handleLeave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", handleMove);
          card.removeEventListener("pointerleave", handleLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-line bg-bg px-6 py-24 md:px-10 md:py-32"
      style={{
        backgroundImage:
          "radial-gradient(1100px 560px at 88% -8%, var(--color-teal-dim), transparent 60%)",
      }}
    >
      <div className="relative mx-auto max-w-6xl">
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

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {STEPS.map((step, i) => (
            <div
              key={step.index}
              ref={(el) => {
                if (el) cardRefs.current[i] = el;
              }}
              data-reveal
              className="group relative min-h-[300px] overflow-hidden rounded-2xl border border-line transition-colors duration-300 hover:border-teal/40 md:min-h-[340px]"
            >
              <div
                ref={(el) => {
                  if (el) imageRefs.current[i] = el;
                }}
                className="absolute inset-0 [animation:kenburns_18s_ease-in-out_infinite]"
              >
                <Image
                  src={step.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/25" />

              <div className="relative z-10 flex h-full flex-col justify-between p-8">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-bg/40 text-fg/80 backdrop-blur-sm transition-colors duration-300 group-hover:border-teal/50 group-hover:text-teal">
                    {step.icon}
                  </span>
                  <span className="whitespace-nowrap rounded-full border border-line bg-bg/40 px-3 py-1 font-display text-[0.6rem] tracking-[0.14em] text-muted uppercase backdrop-blur-sm">
                    {step.eyebrow}
                  </span>
                </div>

                <div>
                  <p className="flex items-baseline gap-2 font-display text-lg font-bold tracking-[0.01em] text-fg">
                    <span className="text-[0.75rem] font-normal tracking-[0.1em] text-muted">
                      {step.index}
                    </span>
                    {step.title.toUpperCase()}
                  </p>
                  <p className="mt-3 max-w-md font-body text-[0.95rem] leading-relaxed text-fg/80">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
