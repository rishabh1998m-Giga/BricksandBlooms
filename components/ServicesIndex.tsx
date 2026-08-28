"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlowerBud from "@/components/FlowerBud";
import MaintenanceBloomCanvas from "@/components/webgl/MaintenanceBloomCanvas";

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

// The hero's background motif: a rectilinear "brick coursing" line that
// crossfades into an organic bloom-vine curve as the kinetic type turns
// from "Brick." to "Bloom." — the brand's own name, drawn.
const BRICK_PATH =
  "M -5,66 H 20 V 44 H 46 V 66 H 72 V 44 H 98 V 66 H 124 V 44 H 150 V 66 H 165";
const VINE_PATH =
  "M -5,74 C 22,58 10,36 34,30 C 60,24 54,50 80,44 C 106,38 100,14 126,20 C 146,25 152,42 165,36";

// The spine that runs the full length of the two service categories —
// rectilinear (brick-like) through Design & Execution, resolving into a
// blooming vine by Maintenance. One continuous path, one continuous idea.
const SPINE_PATH =
  "M 30,0 L 30,90 L 10,90 L 10,180 L 30,180 L 30,270 L 50,270 L 50,360 L 30,360 L 30,450 L 10,450 L 10,540 " +
  "L 30,540 C 14,590 46,640 30,690 C 15,730 45,770 30,810 C 19,840 41,870 30,900 L 30,1000";
const SPINE_BUD_FRACTIONS = [0.68, 0.8, 0.9];

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
  const heroStageRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<HTMLDivElement[]>([]);
  const brickPathRef = useRef<SVGPathElement>(null);
  const vinePathRef = useRef<SVGPathElement>(null);

  const spineWrapperRef = useRef<HTMLDivElement>(null);
  const spineSvgRef = useRef<SVGSVGElement>(null);
  const spinePathRef = useRef<SVGPathElement>(null);
  const spineBudPositionRefs = useRef<SVGGElement[]>([]);
  const spineBudBloomRefs = useRef<SVGGElement[]>([]);

  const maintenanceRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      // --- The spine: position its blooms along the path, then tie its
      // growth to normal (unpinned) scroll across both category sections.
      const spinePath = spinePathRef.current;
      if (spinePath) {
        const length = spinePath.getTotalLength();
        const svgRect = spineSvgRef.current?.getBoundingClientRect();
        const scaleX = (svgRect?.width ?? 60) / 60;
        const scaleY = (svgRect?.height ?? 1000) / 1000;
        const correction = scaleX > 0 ? scaleY / scaleX : 1;

        SPINE_BUD_FRACTIONS.forEach((frac, i) => {
          const pt = spinePath.getPointAtLength(length * frac);
          spineBudPositionRefs.current[i]?.setAttribute(
            "transform",
            `translate(${pt.x} ${pt.y}) scale(${correction} 1)`
          );
        });

        if (prefersReduced) {
          spinePath.style.strokeDasharray = `${length}`;
          spinePath.style.strokeDashoffset = "0";
          gsap.set(spineBudBloomRefs.current, { scale: 1, transformOrigin: "center" });
        } else {
          gsap.set(spinePath, { strokeDasharray: length, strokeDashoffset: length });
          gsap.set(spineBudBloomRefs.current, { scale: 0, transformOrigin: "center" });

          const spineTl = gsap.timeline({
            scrollTrigger: {
              trigger: spineWrapperRef.current,
              start: "top 75%",
              end: "bottom bottom",
              scrub: 0.6,
            },
          });
          spineTl.to(spinePath, { strokeDashoffset: 0, ease: "none" }, 0);
          SPINE_BUD_FRACTIONS.forEach((frac, i) => {
            spineTl.to(
              spineBudBloomRefs.current[i],
              { scale: 1, ease: "back.out(2.2)", duration: 0.08 },
              frac - 0.05
            );
          });
        }
      }

      if (prefersReduced) {
        gsap.set(reveals, { opacity: 1, y: 0 });
        gsap.set(beatRefs.current, { autoAlpha: 0, display: "none" });
        gsap.set(beatRefs.current[beatRefs.current.length - 1], {
          autoAlpha: 1,
          display: "flex",
        });
        gsap.set(brickPathRef.current, { autoAlpha: 0 });
        gsap.set(vinePathRef.current, { autoAlpha: 1 });
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

      // --- The pinned kinetic hero: Brick. -> Bloom. -> the real headline,
      // with the background line motif crossfading rectilinear -> organic
      // in step with the words themselves.
      const beats = beatRefs.current;
      gsap.set(beats, { autoAlpha: 0, scale: 0.75, filter: "blur(16px)" });
      gsap.set(beats[0], { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
      gsap.set(vinePathRef.current, { autoAlpha: 0 });

      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroStageRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      beats.forEach((_, i) => {
        if (i === 0) return;
        heroTl
          .to(
            beats[i - 1],
            { autoAlpha: 0, scale: 1.25, filter: "blur(14px)", duration: 0.3, ease: "power2.in" },
            i - 0.3
          )
          .to(
            beats[i],
            { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "power2.out" },
            i - 0.12
          );
      });
      heroTl.to(
        brickPathRef.current,
        { autoAlpha: 0, duration: 0.5 },
        0.6
      );
      heroTl.to(
        vinePathRef.current,
        { autoAlpha: 1, duration: 0.5 },
        0.6
      );
      heroTl.to({}, { duration: 0.5 });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      {/* Eyebrow */}
      <div className="relative mx-auto max-w-6xl px-6 pt-24 md:px-10 md:pt-32">
        <div data-reveal className="flex items-center gap-3">
          <span className="h-px w-8 bg-line" />
          <p className="font-display text-[0.68rem] tracking-[0.18em] text-teal uppercase">
            Services
          </p>
        </div>
      </div>

      {/* Pinned kinetic hero — Brick. / Bloom. / the headline */}
      <div
        ref={heroStageRef}
        className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden px-6"
      >
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full text-fg/[0.14]"
          viewBox="0 0 160 90"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={brickPathRef}
            d={BRICK_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            ref={vinePathRef}
            d={VINE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
            strokeLinecap="round"
          />
        </svg>

        {[
          <p
            key="brick"
            className="text-balance font-display text-[3.4rem] font-bold leading-[0.95] tracking-[-0.01em] text-fg sm:text-[5rem] md:text-[6.5rem]"
          >
            Brick.
          </p>,
          <p
            key="bloom"
            className="text-balance font-display text-[3.4rem] font-bold leading-[0.95] tracking-[-0.01em] text-terracotta sm:text-[5rem] md:text-[6.5rem]"
          >
            Bloom.
          </p>,
          <div key="final" className="flex max-w-3xl flex-col items-center px-6 text-center">
            <h1 className="text-balance font-display text-[2.6rem] font-bold leading-[1.0] tracking-[-0.01em] text-fg sm:text-[3.4rem] md:text-[4.6rem]">
              From first bloom to lasting care.
            </h1>
            <p className="mt-5 max-w-lg text-balance font-body text-base text-muted sm:text-lg">
              Fifteen disciplines under one studio — from a terrace garden&rsquo;s
              first sketch to the quiet care that keeps it thriving.
            </p>
          </div>,
        ].map((node, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) beatRefs.current[i] = el;
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {node}
          </div>
        ))}
      </div>

      {/* The spine-connected categories */}
      <div ref={spineWrapperRef} className="relative">
        <svg
          ref={spineSvgRef}
          className="pointer-events-none absolute inset-y-0 left-[22px] hidden w-[60px] text-line md:block lg:left-[calc((100%-72rem)/2+22px)]"
          viewBox="0 0 60 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            ref={spinePathRef}
            d={SPINE_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {SPINE_BUD_FRACTIONS.map((_, i) => (
            <g
              key={i}
              ref={(el) => {
                if (el) spineBudPositionRefs.current[i] = el;
              }}
            >
              <g
                ref={(el) => {
                  if (el) spineBudBloomRefs.current[i] = el;
                }}
                transform="scale(2.2)"
              >
                <FlowerBud color={ACCENTS[i % ACCENTS.length]} />
              </g>
            </g>
          ))}
        </svg>

        {/* Design & Execution */}
        <section className="border-t border-line bg-bg px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-6xl md:pl-16">
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
        <section
          ref={maintenanceRef}
          className="relative overflow-hidden border-t border-line bg-bg-elevated px-6 py-20 md:px-10 md:py-28"
        >
          <MaintenanceBloomCanvas sectionRef={maintenanceRef} />

          <div className="relative mx-auto max-w-6xl md:pl-16">
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
                    className="group rounded-2xl border border-line bg-bg/40 p-8 backdrop-blur-sm transition-colors duration-300"
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
      </div>

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
