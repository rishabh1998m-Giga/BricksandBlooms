"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FlowerBud from "@/components/FlowerBud";

gsap.registerPlugin(ScrollTrigger);

type Step = {
  num: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  accent: string;
};

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M16.5 16.5 13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BulbIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M6.5 10.2 8.7 12.4l4.8-4.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ToolIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M13.5 3.5a3.5 3.5 0 0 0-4.6 4.2L3 13.6l1.4 1.4 5.9-5.9a3.5 3.5 0 0 0 4.2-4.6l-2.1 2.1-1.5-.4-.4-1.5 2.1-2.1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 16c0-8 6-13 12-13 0 6-5 12-13 13Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M5 15c3-3 6-5 10-11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const TEAL = "#4ca48e";
const TERRACOTTA = "#d97a4e";
const BLUSH = "#dd939a";

const STEPS: Step[] = [
  {
    num: "01",
    title: "Consult",
    body: "We listen. We visit your site, understand your requirements, lifestyle, and vision. Every great landscape starts with a conversation.",
    icon: <SearchIcon />,
    accent: TEAL,
  },
  {
    num: "02",
    title: "Design & Propose",
    body: "Our team of landscape architects translates your vision into a bespoke design. We present detailed 3D visuals, material selections, and a transparent estimate proposal — fully customized for you.",
    icon: <BulbIcon />,
    accent: TERRACOTTA,
  },
  {
    num: "03",
    title: "Approve",
    body: "Once you love the design, you sign off on the proposal. No hidden costs, no confusion. Just clarity to begin.",
    icon: <CheckIcon />,
    accent: BLUSH,
  },
  {
    num: "04",
    title: "Execute",
    body: "Our turnkey execution team takes over. From hardscape to softscape, lighting to irrigation — we manage everything end-to-end, on time, with precision.",
    icon: <ToolIcon />,
    accent: TEAL,
  },
  {
    num: "05",
    title: "Maintain",
    body: "We don't just build, we nurture. Our maintenance team ensures your landscape grows more beautiful with time.",
    icon: <LeafIcon />,
    accent: TERRACOTTA,
  },
];

export default function SceneProcess() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardTintRefs = useRef<HTMLDivElement[]>([]);
  const cardContentRefs = useRef<HTMLDivElement[]>([]);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const tickRefs = useRef<HTMLDivElement[]>([]);
  const progressFillRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const panels = panelRefs.current;
      const cardTints = cardTintRefs.current;
      const cardContents = cardContentRefs.current;
      const ticks = tickRefs.current;

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

      gsap.set(panels, { autoAlpha: 0, y: 32 });
      gsap.set(cardTints, { autoAlpha: 0 });
      gsap.set(cardContents, { autoAlpha: 0, scale: 0.92 });
      gsap.set(ticks, { opacity: 0.32 });
      gsap.set(panels[0], { autoAlpha: 1, y: 0 });
      gsap.set(cardTints[0], { autoAlpha: 1 });
      gsap.set(cardContents[0], { autoAlpha: 1, scale: 1 });
      gsap.set(ticks[0], { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "+=400%",
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressFillRef.current) {
              gsap.set(progressFillRef.current, { scaleX: self.progress });
            }
          },
        },
        defaults: { ease: "none" },
      });

      STEPS.forEach((_, i) => {
        if (i === 0) return;
        const pos = i - 0.15;
        tl.to(
          panels[i - 1],
          { autoAlpha: 0, y: -24, duration: 0.35, ease: "power2.in" },
          pos
        )
          .to(
            panels[i],
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
            pos + 0.15
          )
          .to(cardTints[i - 1], { autoAlpha: 0, duration: 0.4 }, pos)
          .to(cardTints[i], { autoAlpha: 1, duration: 0.5 }, pos + 0.1)
          .to(
            cardContents[i - 1],
            { autoAlpha: 0, scale: 0.9, duration: 0.35, ease: "power2.in" },
            pos
          )
          .to(
            cardContents[i],
            { autoAlpha: 1, scale: 1, duration: 0.55, ease: "back.out(1.6)" },
            pos + 0.15
          )
          .to(ticks[i - 1], { opacity: 0.32, duration: 0.3 }, pos)
          .to(ticks[i], { opacity: 1, duration: 0.3 }, pos + 0.1);
      });

      // A trailing hold so the last stop stays put long enough to read
      // before the section releases back into normal scroll.
      tl.to({}, { duration: 0.45 });

      // Cursor-reactive tilt on the card and copy — the same magnetic,
      // quiet-luxury touch as the Vision interlude.
      const stage = stageRef.current;
      if (stage) {
        const handleMove = (e: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(cardRef.current, {
            xPercent: px * 2,
            yPercent: py * 1.5,
            rotate: px * 1.1,
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          });
          gsap.to(panels, {
            xPercent: px * 1.2,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        stage.addEventListener("pointermove", handleMove);
        return () => stage.removeEventListener("pointermove", handleMove);
      }
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
          <h2
            data-reveal
            className="max-w-3xl text-balance font-display text-[2.6rem] font-bold leading-[1.0] tracking-[-0.01em] text-fg sm:text-[3.4rem] md:text-[4.2rem]"
          >
            A seamless journey from vision to reality
          </h2>

          <div
            data-reveal
            className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line font-display text-[0.7rem] tracking-[0.08em] text-fg/80 sm:flex"
            aria-hidden="true"
          >
            B&amp;B
          </div>
        </div>
      </div>

      {/* The journey — pinned, scroll-scrubbed editorial spread: a
          color-blocked waypoint card paired with large kinetic copy,
          instead of text floating alone in an empty frame. */}
      <div
        ref={stageRef}
        className="relative hidden h-[100dvh] w-full overflow-hidden motion-safe:block"
      >
        <div className="mx-auto grid h-full max-w-[1360px] grid-cols-1 items-center gap-10 px-6 py-10 md:grid-cols-[0.85fr_1fr] md:gap-16 md:px-14">
          {/* The waypoint card — a real designed surface, not a void */}
          <div
            ref={cardRef}
            className="relative mx-auto hidden aspect-[4/5] w-full max-w-[420px] shrink-0 overflow-hidden rounded-[2rem] border border-line bg-bg-elevated md:block"
          >
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => {
                  if (el) cardTintRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(120% 90% at 50% 30%, ${step.accent}2e, transparent 70%)`,
                }}
              />
            ))}

            {STEPS.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => {
                  if (el) cardContentRefs.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <p
                  className="select-none font-display text-[8.5rem] font-bold leading-none opacity-[0.16]"
                  style={{ color: step.accent }}
                  aria-hidden="true"
                >
                  {step.num}
                </p>
                <svg
                  width="120"
                  height="120"
                  viewBox="-5 -5 10 10"
                  className="-mt-24"
                  aria-hidden="true"
                >
                  <FlowerBud color={step.accent} />
                </svg>
                <div className="mt-6 flex items-center gap-2">
                  {STEPS.map((dotStep, dotIdx) => (
                    <span
                      key={dotStep.num}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: dotIdx === i ? "1.4rem" : "0.375rem",
                        backgroundColor:
                          dotIdx === i ? step.accent : "var(--color-line)",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* The narrative */}
          <div className="relative min-h-[360px] w-full sm:min-h-[320px] md:min-h-[300px]">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => {
                  if (el) panelRefs.current[i] = el;
                }}
                className="absolute inset-x-0 top-0"
              >
                <p
                  className="font-display text-[0.68rem] tracking-[0.22em] uppercase"
                  style={{ color: step.accent }}
                >
                  Step {step.num} / {STEPS.length}
                </p>
                <div className="mt-5 flex items-center gap-4">
                  <span
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-line"
                    style={{ color: step.accent }}
                  >
                    {step.icon}
                  </span>
                  <h3 className="text-balance font-display text-[2.6rem] font-bold leading-[1.0] tracking-[-0.01em] text-fg sm:text-[3.4rem] md:text-[4.4rem]">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-6 max-w-xl text-balance font-body text-lg leading-relaxed text-fg/80 sm:text-xl">
                  {step.body}
                </p>

                <div className="mt-8 hidden flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 sm:flex">
                  {STEPS.map((otherStep, otherIdx) => (
                    <span
                      key={otherStep.num}
                      className="font-display text-[0.68rem] tracking-[0.1em] uppercase transition-colors duration-300"
                      style={{
                        color:
                          otherIdx === i
                            ? otherStep.accent
                            : "var(--color-muted)",
                        opacity: otherIdx === i ? 1 : 0.6,
                      }}
                    >
                      {otherStep.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* A confident, full-width progress bar replaces a shy trail */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 hidden px-14 md:block">
          <div className="mx-auto flex max-w-[1360px] items-center gap-4">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => {
                  if (el) tickRefs.current[i] = el;
                }}
                className="font-display text-[0.62rem] tracking-[0.14em] text-fg"
              >
                {step.num}
              </div>
            ))}
            <div className="relative h-px flex-1 bg-line">
              <div
                ref={progressFillRef}
                className="absolute inset-y-0 left-0 w-full origin-left bg-teal"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reduced-motion fallback — every step visible at once, no pinning */}
      <div className="mx-auto hidden max-w-6xl px-6 pb-24 motion-reduce:block md:px-10 md:pb-32">
        <div className="grid gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line"
                  style={{ color: step.accent }}
                >
                  {step.icon}
                </span>
                <p
                  className="font-display text-[0.68rem] tracking-[0.22em] uppercase"
                  style={{ color: step.accent }}
                >
                  Step {step.num} / {STEPS.length}
                </p>
              </div>
              <h3 className="font-display text-2xl font-bold tracking-[-0.01em] text-fg sm:text-3xl">
                {step.title}
              </h3>
              <p className="max-w-xl font-body text-base leading-relaxed text-fg/80 sm:text-lg">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
