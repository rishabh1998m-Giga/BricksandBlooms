"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEAL = "#4ca48e";
const TERRACOTTA = "#d97a4e";
const BLUSH = "#dd939a";
const ACCENTS = [TEAL, TERRACOTTA, BLUSH];

const DESIGN_AND_EXECUTION = [
  "Terrace Garden",
  "Vertical Garden",
  "Villa Landscaping",
  "Pergola & Fabrication",
  "Luxury Landscapes",
  "Swimming Pools",
  "Water Fountains & Ponds",
  "Commercial Landscaping",
  "Landscape Irrigation",
  "Softscape",
  "Hardscape",
  "Moss Wall",
];

const MAINTENANCE = ["Garden Maintenance", "Office Plant Rental", "FRP Planters"];

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

function IndexRow({ num, name }: { num: number; name: string }) {
  const accent = ACCENTS[(num - 1) % ACCENTS.length];
  return (
    <Link
      href={`/contact?service=${encodeURIComponent(name)}`}
      data-reveal
      className="group flex items-center justify-between gap-6 border-b border-line py-6 transition-colors duration-300"
      style={{ ["--accent" as string]: accent }}
    >
      <div className="flex items-baseline gap-5 md:gap-7">
        <span className="w-6 shrink-0 font-display text-[0.72rem] tracking-[0.1em] text-muted tabular-nums">
          {String(num).padStart(2, "0")}
        </span>
        <span className="text-balance font-display text-[1.5rem] font-bold leading-[1.1] tracking-[-0.01em] text-fg transition-colors duration-300 group-hover:text-[var(--accent)] sm:text-[1.8rem] md:text-[2.1rem]">
          {name}
        </span>
      </div>
      <span
        className="flex h-10 w-10 shrink-0 -translate-x-2 items-center justify-center rounded-full border border-line text-fg opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:border-[var(--accent)]/50 group-hover:text-[var(--accent)] group-hover:opacity-100"
        aria-hidden="true"
      >
        <ArrowIcon />
      </span>
    </Link>
  );
}

export default function ServicesIndex() {
  const rootRef = useRef<HTMLDivElement>(null);

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
    },
    { scope: rootRef }
  );

  // A quiet cursor-tilt on the hero heading, matching the rest of the site.
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;
    const stage = rootRef.current;
    if (!stage) return;
    const handleMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(headingRef.current, {
        xPercent: px * 0.8,
        yPercent: py * 0.6,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    stage.addEventListener("pointermove", handleMove);
    return () => stage.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section className="relative overflow-hidden border-t border-line bg-bg px-6 pb-16 pt-24 md:px-10 md:pb-20 md:pt-32">
        <p
          className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[13rem] font-bold leading-none text-fg/[0.04] md:text-[18rem]"
          aria-hidden="true"
        >
          15
        </p>
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-line" />
            <p className="font-display text-[0.68rem] tracking-[0.18em] text-teal uppercase">
              Services
            </p>
          </div>
          <h1
            ref={headingRef}
            data-reveal
            className="mt-6 max-w-3xl text-balance font-display text-[2.6rem] font-bold leading-[1.0] tracking-[-0.01em] text-fg sm:text-[3.4rem] md:text-[4.6rem]"
          >
            From first bloom to lasting care.
          </h1>
          <p
            data-reveal
            className="mt-5 max-w-lg text-balance font-body text-base text-muted sm:text-lg"
          >
            Fifteen disciplines under one studio — from a terrace garden&rsquo;s
            first sketch to the quiet care that keeps it thriving.
          </p>
        </div>
      </section>

      {/* Design & Execution */}
      <section className="border-t border-line bg-bg px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-line" />
              <p className="font-display text-[0.68rem] tracking-[0.18em] text-teal uppercase">
                Design &amp; Execution
              </p>
            </div>
            <p className="font-display text-[0.68rem] tracking-[0.1em] text-muted uppercase">
              {String(DESIGN_AND_EXECUTION.length).padStart(2, "0")} disciplines
            </p>
          </div>

          <div className="mt-2 grid md:grid-cols-2 md:gap-x-16">
            <div>
              {DESIGN_AND_EXECUTION.slice(0, 6).map((name, i) => (
                <IndexRow key={name} num={i + 1} name={name} />
              ))}
            </div>
            <div>
              {DESIGN_AND_EXECUTION.slice(6).map((name, i) => (
                <IndexRow key={name} num={i + 7} name={name} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance */}
      <section className="border-t border-line bg-bg-elevated px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-8">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-line" />
              <p className="font-display text-[0.68rem] tracking-[0.18em] text-terracotta uppercase">
                Maintenance
              </p>
            </div>
            <p className="font-display text-[0.68rem] tracking-[0.1em] text-muted uppercase">
              The care that keeps it beautiful
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {MAINTENANCE.map((name, i) => {
              const num = DESIGN_AND_EXECUTION.length + i + 1;
              const accent = ACCENTS[(num - 1) % ACCENTS.length];
              return (
                <Link
                  key={name}
                  href={`/contact?service=${encodeURIComponent(name)}`}
                  data-reveal
                  className="group rounded-2xl border border-line p-8 transition-colors duration-300"
                  style={{ ["--accent" as string]: accent }}
                >
                  <p className="font-display text-[2.4rem] font-bold leading-none text-fg/15 transition-colors duration-300 group-hover:text-[var(--accent)]/25">
                    {String(num).padStart(2, "0")}
                  </p>
                  <p className="mt-4 text-balance font-display text-xl font-bold leading-tight tracking-[-0.01em] text-fg">
                    {name}
                  </p>
                  <span
                    className="mt-5 flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg transition-all duration-300 group-hover:translate-x-1 group-hover:border-[var(--accent)]/50 group-hover:text-[var(--accent)]"
                    aria-hidden="true"
                  >
                    <ArrowIcon />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-line bg-bg px-6 py-24 text-center md:px-10 md:py-32">
        <div className="mx-auto max-w-2xl">
          <p
            data-reveal
            className="font-display text-[0.68rem] tracking-[0.18em] text-teal uppercase"
          >
            Let&rsquo;s Talk
          </p>
          <h2
            data-reveal
            className="mt-5 text-balance font-display text-[2.2rem] font-bold leading-[1.05] tracking-[-0.01em] text-fg sm:text-[2.8rem]"
          >
            Have a project in mind?
          </h2>
          <p
            data-reveal
            className="mt-4 text-balance font-body text-base text-muted sm:text-lg"
          >
            Tell us where your site is and what you have in mind — we&rsquo;ll
            take it from there.
          </p>
          <Link
            href="/contact"
            data-reveal
            className="group mt-8 inline-flex items-center gap-3 rounded-full border border-line px-6 py-3 font-display text-[0.68rem] tracking-[0.14em] text-fg uppercase transition-colors duration-300 hover:border-teal/50 hover:text-teal"
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
