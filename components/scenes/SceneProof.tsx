"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  target: number;
  format: "thousands" | "plain";
  suffix: string;
  label: string;
};

const STATS: Stat[] = [
  {
    target: 10000,
    format: "thousands",
    suffix: "+",
    label: "Plants Installed",
  },
  {
    target: 50,
    format: "plain",
    suffix: "+",
    label: "Terrace & Balcony Gardens",
  },
  {
    target: 4,
    format: "plain",
    suffix: "+",
    label: "Years of Design & Execution Expertise",
  },
  {
    target: 95,
    format: "plain",
    suffix: "%",
    label: "Project Completion Within Timeline",
  },
];

export default function SceneProof() {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<HTMLSpanElement[]>([]);
  const barRefs = useRef<HTMLSpanElement[]>([]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const bars = barRefs.current;
      const values = valueRefs.current;

      if (prefersReduced) {
        gsap.set(reveals, { opacity: 1, y: 0 });
        gsap.set(bars, { scaleX: 1 });
        values.forEach((el, i) => {
          el.textContent = formatStat(STATS[i], STATS[i].target);
        });
        return;
      }

      gsap.set(reveals, { opacity: 0, y: 28 });
      gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });
      values.forEach((el) => {
        el.textContent = formatStat(
          { format: "plain" } as Stat,
          0
        );
      });

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

      STATS.forEach((stat, i) => {
        const el = values[i];
        const bar = bars[i];
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const proxy = { val: 0 };
            gsap.to(proxy, {
              val: stat.target,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = formatStat(stat, proxy.val);
              },
            });
            if (bar) {
              gsap.to(bar, {
                scaleX: 1,
                duration: 1.4,
                ease: "power3.out",
              });
            }
          },
        });
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
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-xl">
            <p
              data-reveal
              className="font-display text-[0.68rem] tracking-[0.22em] text-teal uppercase"
            >
              Performance
            </p>
            <h2
              data-reveal
              className="mt-4 text-balance font-display text-[2.6rem] font-bold leading-[1.0] tracking-[-0.01em] text-fg sm:text-[3.4rem] md:text-[4.2rem]"
            >
              The proof behind our landscapes
            </h2>
            <p
              data-reveal
              className="mt-4 max-w-md text-balance font-body text-base text-muted sm:text-lg"
            >
              From concept to completion, we design and deliver outdoor
              spaces that stand the test of time.
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

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-8">
          {STATS.map((stat, i) => (
            <div key={stat.label} data-reveal>
              <div className="flex items-baseline font-display text-[3rem] font-bold leading-none tracking-[-0.01em] text-fg sm:text-[3.8rem] md:text-[4.4rem]">
                <span
                  ref={(el) => {
                    if (el) valueRefs.current[i] = el;
                  }}
                >
                  0
                </span>
                <span className="text-teal">{stat.suffix}</span>
              </div>
              <p className="mt-3 font-display text-[0.68rem] tracking-[0.1em] text-muted uppercase">
                {stat.label}
              </p>
              <div className="mt-4 h-px w-full bg-line">
                <span
                  ref={(el) => {
                    if (el) barRefs.current[i] = el;
                  }}
                  className="block h-px w-full bg-teal"
                />
              </div>
              <p className="mt-2 font-display text-[0.6rem] tracking-[0.14em] text-muted/70">
                {`//${String(i + 1).padStart(3, "0")}`}
              </p>
            </div>
          ))}
        </div>

        <div
          data-reveal
          className="mt-20 flex flex-col items-center gap-3 border-t border-line pt-10 text-center"
        >
          <div className="flex gap-1 text-teal" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6L10 1.5Z" />
              </svg>
            ))}
          </div>
          <p className="font-display text-sm text-fg/80">
            5/5, based on client feedback
          </p>
          <p className="font-body text-sm text-muted">
            Trusted by homeowners, commercial spaces &amp; hospitality brands.
          </p>
        </div>
      </div>
    </section>
  );
}

function formatStat(stat: Stat, value: number) {
  const rounded = Math.round(value);
  if (stat.format === "thousands") {
    return rounded.toLocaleString("en-US");
  }
  return String(rounded);
}
