"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// The only pair in the project's photo library that's genuinely the same
// spot at two different moments (not a staged "before" shot) — a brick
// corner photographed early in planting, then again once it had filled
// in. Both are desaturated to the same tone here so the drag reveals one
// continuous photograph changing, rather than two different colour
// grades cutting against each other.
const PROJECT = {
  title: "Structure to bloom",
  description:
    "The same corner, caught at two different moments — bare brick, then fully grown in.",
  before: "/assets/process/execution.webp",
  after: "/assets/process/grow.webp",
};

function BeforeAfterSlider() {
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

  // A brief, one-time wiggle of the handle shortly after the section
  // arrives — the only hint that this image is draggable, since nothing
  // else about a photograph suggests it.
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const proxy = { value: 50 };
    const tl = gsap.timeline({ delay: 1, defaults: { ease: "power2.inOut" } });
    tl.to(proxy, {
      value: 33,
      duration: 0.9,
      onUpdate: () => setPercent(proxy.value),
    }).to(proxy, {
      value: 50,
      duration: 0.9,
      onUpdate: () => setPercent(proxy.value),
    });
    return () => {
      tl.kill();
    };
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
    <div
      ref={frameRef}
      role="slider"
      tabIndex={0}
      aria-label={`Before and after comparison for ${PROJECT.title}`}
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className="absolute inset-0 h-full w-full cursor-ew-resize select-none outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-inset"
      style={{ touchAction: "none" }}
    >
      <Image
        src={PROJECT.after}
        alt={`${PROJECT.title} — after`}
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover grayscale"
        draggable={false}
      />

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      >
        <Image
          src={PROJECT.before}
          alt={`${PROJECT.title} — before`}
          fill
          priority
          sizes="100vw"
          className="object-cover grayscale"
          draggable={false}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-bg/80"
        style={{ left: `${percent}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-bg text-fg shadow-[0_8px_30px_rgba(43,36,28,0.35)]">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

      // A single trigger tied to the section itself, not per-element
      // (ScrollTrigger.batch) — this section fills the full viewport, so
      // the bottom row's own position already sits right at the ~90%
      // line the moment the section is framed, firing inconsistently
      // right when it should be visible. Triggering off the section's
      // own entry and staggering every [data-reveal] target from there
      // guarantees the whole frame — top heading and bottom labels alike
      // — reveals together, reliably.
      gsap.set(targets, { opacity: 0, y: 28 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative h-[100dvh] w-full overflow-hidden border-t border-line bg-bg"
    >
      <BeforeAfterSlider />

      {/* Scrims top and bottom only — the photograph itself stays clear
          across the middle, where the drag happens. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-bg/92 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-bg/90 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-10 pt-24 md:px-14 md:pb-14 md:pt-28">
        <div className="max-w-xl">
          <p
            data-reveal
            className="font-display text-[0.68rem] tracking-[0.22em] text-teal uppercase"
          >
            Transformations
          </p>
          <h2
            data-reveal
            className="mt-4 text-balance font-display text-[2.6rem] font-medium leading-[1.0] tracking-[-0.01em] text-fg sm:text-[3.6rem] md:text-[4.6rem]"
          >
            See the difference
          </h2>
          <p
            data-reveal
            className="mt-4 max-w-md text-balance font-body text-base text-muted sm:text-lg"
          >
            Drag to reveal the transformation — every project starts with a
            vision and ends with a living landscape.
          </p>
        </div>

        <div data-reveal className="flex items-end justify-between gap-6">
          <span className="rounded-full border border-fg/15 bg-bg/70 px-4 py-2 font-display text-[0.65rem] tracking-[0.18em] text-fg/90 uppercase backdrop-blur-sm">
            Before
          </span>
          <div className="hidden max-w-sm text-center sm:block">
            <h3 className="font-display text-base font-medium text-fg">
              {PROJECT.title}
            </h3>
            <p className="mt-1 font-body text-sm text-muted">
              {PROJECT.description}
            </p>
          </div>
          <span className="rounded-full border border-fg/15 bg-bg/70 px-4 py-2 font-display text-[0.65rem] tracking-[0.18em] text-fg/90 uppercase backdrop-blur-sm">
            After
          </span>
        </div>
      </div>
    </section>
  );
}
