"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TEAL = "#2b8870";
const TERRACOTTA = "#c05f38";
const BLUSH = "#c97079";

type IconComponent = (props: { className?: string }) => React.ReactElement;

const IconConsult: IconComponent = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <circle cx="13" cy="13" r="8" stroke="currentColor" strokeWidth="1.6" />
    <path d="M19 19 27 27" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IconDesign: IconComponent = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path
      d="M16 4a9 9 0 0 0-5 16.5c.8.55 1.3 1.4 1.3 2.4v.6h7.4v-.6c0-1 .5-1.85 1.3-2.4A9 9 0 0 0 16 4Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M13 27h6M13.8 29h4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const IconApprove: IconComponent = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M10.5 16.3 14 19.8l7.5-7.6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconExecute: IconComponent = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path
      d="M21.5 5.5a5.5 5.5 0 0 0-7.3 6.6L5 21.3l2.3 2.3 9.2-9.2a5.5 5.5 0 0 0 6.6-7.3l-3.3 3.3-2.4-.6-.6-2.4 3.3-3.3Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

const IconMaintain: IconComponent = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <path
      d="M6 25c0-12.8 9.6-20.6 19-20.6-0.9 9.6-8.1 19.4-20.8 20.9Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M8 24c4.8-4.8 9.6-8 16-17.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

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

const STEPS: {
  num: string;
  title: string;
  line: string;
  bullets: string[];
  icon: IconComponent;
  accent: string;
}[] = [
  {
    num: "01",
    title: "Consult",
    line: "We start with a conversation, not a pitch — a site visit, a walk through the space, and real questions about how you actually want to live in it.",
    bullets: ["Site visit & measurements", "Lifestyle & usage conversation", "Budget expectations, set early"],
    icon: IconConsult,
    accent: TEAL,
  },
  {
    num: "02",
    title: "Design & Propose",
    line: "Your brief becomes a design — materials, layout, and planting worked out in detail, with 3D visuals so you can see it before anything is built.",
    bullets: ["Concept design & 3D visuals", "Material & planting palette", "Itemized, transparent estimate"],
    icon: IconDesign,
    accent: TERRACOTTA,
  },
  {
    num: "03",
    title: "Approve",
    line: "Once the design feels right, you sign off. Scope, materials, and cost are locked in writing before any ground is broken.",
    bullets: ["Written scope of work", "Fixed costing, no hidden lines", "A confirmed start date"],
    icon: IconApprove,
    accent: BLUSH,
  },
  {
    num: "04",
    title: "Execute",
    line: "Our turnkey team takes it from paper to ground — structure, planting, water, and lighting, managed end-to-end under one roof.",
    bullets: ["Single point of contact", "Hardscape through to lighting", "Regular on-site progress updates"],
    icon: IconExecute,
    accent: TEAL,
  },
  {
    num: "05",
    title: "Maintain",
    line: "Handover isn't the finish line. Monthly visits and seasonal resets keep the landscape growing the way it was designed to.",
    bullets: ["Scheduled maintenance visits", "Seasonal planting resets", "Ongoing support, not a one-off"],
    icon: IconMaintain,
    accent: TERRACOTTA,
  },
];

export default function WorkExperience() {
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

  return (
    <div ref={rootRef}>
      {/* ENTRY */}
      <section className="border-t border-line bg-bg px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Eyebrow>How We Work</Eyebrow>
          <h1
            data-reveal
            className="mt-4 max-w-2xl text-balance font-display text-[2.4rem] font-medium leading-[1.02] tracking-[-0.01em] text-fg sm:text-[3.2rem] md:text-[3.8rem]"
          >
            Five steps. One studio. No surprises.
          </h1>
          <p
            data-reveal
            className="mt-5 max-w-md text-balance font-body text-base text-muted sm:text-lg"
          >
            From the first conversation to the landscape that keeps
            growing after we leave — here&rsquo;s exactly how a project
            with us runs.
          </p>

          <div data-reveal className="mt-10 flex items-center gap-2">
            {STEPS.map((step) => (
              <span
                key={step.num}
                className="h-1.5 w-8 rounded-full"
                style={{ backgroundColor: step.accent, opacity: 0.55 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* THE STEPS */}
      <section className="border-t border-line bg-bg px-6 md:px-10">
        <div className="mx-auto max-w-6xl">
          {STEPS.map((step) => (
            <div
              key={step.num}
              data-reveal
              className="grid gap-6 border-t border-line py-10 first:border-t-0 md:grid-cols-[10rem_1fr_16rem] md:items-start md:gap-10 md:py-14"
            >
              <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-5">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line"
                  style={{ color: step.accent }}
                >
                  <step.icon className="h-6 w-6" />
                </span>
                <span className="font-display text-[0.65rem] tracking-[0.18em] text-muted uppercase">
                  Step {step.num} / {String(STEPS.length).padStart(2, "0")}
                </span>
              </div>

              <div>
                <h2
                  className="text-balance font-display text-[1.8rem] font-medium leading-[1.05] tracking-[-0.01em] sm:text-[2.2rem]"
                  style={{ color: step.accent }}
                >
                  {step.title}
                </h2>
                <p className="mt-3 max-w-xl text-balance font-body text-base leading-relaxed text-fg/80 sm:text-lg">
                  {step.line}
                </p>
              </div>

              <ul className="flex flex-col gap-2 md:items-end md:text-right">
                {step.bullets.map((bullet) => (
                  <li key={bullet} className="font-body text-sm text-muted">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
              Ready for step one?
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
