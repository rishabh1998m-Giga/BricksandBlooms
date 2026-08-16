"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  id: string;
  title: string;
  description: string;
  before: string;
  after: string;
};

const PROJECTS: Project[] = [
  {
    id: "courtyard",
    title: "Courtyard Renewal",
    description: "From bare ground to a lush, layered retreat",
    before: "/assets/projects/courtyard-before.webp",
    after: "/assets/projects/courtyard-after.webp",
  },
  {
    id: "rooftop",
    title: "Rooftop Refresh",
    description: "A sun-worn deck reimagined as a warm gathering space",
    before: "/assets/projects/rooftop-before.webp",
    after: "/assets/projects/rooftop-after.webp",
  },
];

function BeforeAfterCard({ project }: { project: Project }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(50);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(100, Math.max(0, pct)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setPercent((p) => Math.max(0, p - 3));
    } else if (e.key === "ArrowRight") {
      setPercent((p) => Math.min(100, p + 3));
    }
  };

  return (
    <div data-reveal className="flex flex-col">
      <div
        ref={frameRef}
        role="slider"
        tabIndex={0}
        aria-label={`Before and after comparison for ${project.title}`}
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="relative aspect-[16/9] w-full cursor-ew-resize select-none overflow-hidden rounded-2xl bg-bg-elevated outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        style={{ touchAction: "none" }}
      >
        <Image
          src={project.after}
          alt={`${project.title} — after`}
          fill
          sizes="(min-width: 768px) 48vw, 100vw"
          className="pointer-events-none object-cover"
          draggable={false}
        />

        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        >
          <Image
            src={project.before}
            alt={`${project.title} — before`}
            fill
            sizes="(min-width: 768px) 48vw, 100vw"
            className="object-cover"
            draggable={false}
          />
        </div>

        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-bg/60 px-3 py-1 font-display text-[0.62rem] tracking-[0.16em] text-fg/90 uppercase backdrop-blur-sm">
          Before
        </span>
        <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-bg/60 px-3 py-1 font-display text-[0.62rem] tracking-[0.16em] text-fg/90 uppercase backdrop-blur-sm">
          After
        </span>

        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-fg/70"
          style={{ left: `${percent}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-fg text-bg shadow-lg">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 4 1 8l4 4M11 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      <h3 className="mt-5 font-display text-xl font-bold tracking-[-0.01em] text-fg sm:text-2xl">
        {project.title}
      </h3>
      <p className="mt-1.5 font-body text-base text-muted">
        {project.description}
      </p>
    </div>
  );
}

export default function SceneTransformation() {
  const rootRef = useRef<HTMLDivElement>(null);

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

      gsap.set(targets, { opacity: 0, y: 32 });
      ScrollTrigger.batch(targets, {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
          }),
        once: true,
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative border-t border-line bg-bg px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p
          data-reveal
          className="font-display text-[0.68rem] tracking-[0.22em] text-teal uppercase"
        >
          Transformations
        </p>
        <h2
          data-reveal
          className="mt-4 max-w-xl text-balance font-display text-[2.6rem] font-bold leading-[1.0] tracking-[-0.01em] text-fg sm:text-[3.4rem] md:text-[4.2rem]"
        >
          See the difference
        </h2>
        <p
          data-reveal
          className="mt-4 max-w-lg text-balance font-body text-base text-muted sm:text-lg"
        >
          Drag to reveal the transformation. Every project starts with a
          vision and ends with a living landscape.
        </p>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-8">
          {PROJECTS.map((project) => (
            <BeforeAfterCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
