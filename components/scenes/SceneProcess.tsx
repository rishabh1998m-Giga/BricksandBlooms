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

const STEPS: Step[] = [
  {
    num: "01",
    title: "Consult",
    body: "We listen. We visit your site, understand your requirements, lifestyle, and vision. Every great landscape starts with a conversation.",
    icon: <SearchIcon />,
  },
  {
    num: "02",
    title: "Design & Propose",
    body: "Our team of landscape architects translates your vision into a bespoke design. We present detailed 3D visuals, material selections, and a transparent estimate proposal — fully customized for you.",
    icon: <BulbIcon />,
  },
  {
    num: "03",
    title: "Approve",
    body: "Once you love the design, you sign off on the proposal. No hidden costs, no confusion. Just clarity to begin.",
    icon: <CheckIcon />,
  },
  {
    num: "04",
    title: "Execute",
    body: "Our turnkey execution team takes over. From hardscape to softscape, lighting to irrigation — we manage everything end-to-end, on time, with precision.",
    icon: <ToolIcon />,
  },
  {
    num: "05",
    title: "Maintain",
    body: "We don't just build, we nurture. Our maintenance team ensures your landscape grows more beautiful with time.",
    icon: <LeafIcon />,
  },
];

// A tall, gently meandering trail — the "journey" the section's own title
// promises — drawn top to bottom with five waypoints, not a straight
// progress bar.
const PATH_D =
  "M 50,8 C 18,70 82,140 42,210 C 10,272 88,336 48,400 C 16,460 84,522 50,592";
const BUD_FRACTIONS = [0.02, 0.27, 0.5, 0.73, 0.98];
const BUD_COLORS = ["#4ca48e", "#d97a4e", "#dd939a", "#4ca48e", "#d97a4e"];

export default function SceneProcess() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const budPositionRefs = useRef<SVGGElement[]>([]);
  const budBloomRefs = useRef<SVGGElement[]>([]);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const numberRefs = useRef<HTMLParagraphElement[]>([]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const path = pathRef.current;
      const panels = panelRefs.current;
      const buds = budBloomRefs.current;
      const numbers = numberRefs.current;

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

      // Position every waypoint along the trail — a one-time layout pass,
      // kept separate from the scroll-scrubbed bloom tween below so the
      // two transforms never fight (same technique as the Vision vine).
      if (path) {
        const length = path.getTotalLength();
        const svgRect = svgRef.current?.getBoundingClientRect();
        const scaleX = (svgRect?.width ?? 100) / 100;
        const scaleY = (svgRect?.height ?? 600) / 600;
        const correction = scaleX > 0 ? scaleY / scaleX : 1;

        BUD_FRACTIONS.forEach((frac, i) => {
          const pt = path.getPointAtLength(length * frac);
          budPositionRefs.current[i]?.setAttribute(
            "transform",
            `translate(${pt.x} ${pt.y}) scale(${correction} 1)`
          );
        });

        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      }

      gsap.set(buds, { scale: 0, transformOrigin: "center" });
      gsap.set(numbers, { opacity: 0.3 });
      gsap.set(panels, { autoAlpha: 0, y: 32 });
      gsap.set(panels[0], { autoAlpha: 1, y: 0 });
      gsap.set(buds[0], { scale: 1 });
      gsap.set(numbers[0], { opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top",
          end: "+=400%",
          scrub: 1.1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      if (path) {
        tl.to(path, { strokeDashoffset: 0, duration: STEPS.length - 1 }, 0);
      }

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
          .to(
            buds[i],
            { scale: 1, duration: 0.5, ease: "back.out(2.2)" },
            pos + 0.1
          )
          .to(numbers[i - 1], { opacity: 0.3, duration: 0.3 }, pos)
          .to(numbers[i], { opacity: 1, duration: 0.3 }, pos + 0.1);
      });

      // A trailing hold so the last stop stays put long enough to read
      // before the section releases back into normal scroll.
      tl.to({}, { duration: 0.45 });

      // Cursor-reactive tilt on the active panel — the same magnetic,
      // quiet-luxury touch as the Vision interlude, distinct in axis from
      // the timeline's own opacity/y so the two never collide.
      const stage = stageRef.current;
      if (stage) {
        const handleMove = (e: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(panels, {
            xPercent: px * 2.5,
            yPercent: py * 1.5,
            rotate: px * 0.8,
            duration: 1,
            ease: "power2.out",
            overwrite: "auto",
          });
          gsap.to(svgRef.current, {
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

      {/* The journey — pinned, scroll-scrubbed, no photography: the trail
          and the typography carry the whole moment. */}
      <div
        ref={stageRef}
        className="relative hidden h-[100dvh] w-full overflow-hidden motion-safe:block"
      >
        <div className="mx-auto flex h-full max-w-6xl items-center gap-6 px-6 md:gap-16 md:px-10">
          <div className="relative hidden h-[70%] w-[120px] shrink-0 md:block">
            <svg
              ref={svgRef}
              className="pointer-events-none absolute inset-0 h-full w-full text-line"
              viewBox="0 0 100 600"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                ref={pathRef}
                d={PATH_D}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              {BUD_FRACTIONS.map((_, i) => (
                <g
                  key={i}
                  ref={(el) => {
                    if (el) budPositionRefs.current[i] = el;
                  }}
                >
                  <g
                    ref={(el) => {
                      if (el) budBloomRefs.current[i] = el;
                    }}
                    transform="scale(2.6)"
                  >
                    <FlowerBud color={BUD_COLORS[i]} />
                  </g>
                </g>
              ))}
            </svg>
          </div>

          <div className="relative min-h-[340px] w-full max-w-2xl sm:min-h-[300px] md:min-h-[280px]">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                ref={(el) => {
                  if (el) panelRefs.current[i] = el;
                }}
                className="absolute inset-x-0 top-0"
              >
                <p
                  ref={(el) => {
                    if (el) numberRefs.current[i] = el;
                  }}
                  className="font-display text-[0.68rem] tracking-[0.22em] text-teal uppercase"
                >
                  Step {step.num} / {STEPS.length}
                </p>
                <div className="mt-5 flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-line text-teal">
                    {step.icon}
                  </span>
                  <h3 className="text-balance font-display text-[2.4rem] font-bold leading-[1.0] tracking-[-0.01em] text-fg sm:text-[3rem] md:text-[3.6rem]">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-6 max-w-xl text-balance font-body text-lg leading-relaxed text-fg/80 sm:text-xl">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reduced-motion fallback — every step visible at once, no pinning */}
      <div className="mx-auto hidden max-w-6xl px-6 pb-24 motion-reduce:block md:px-10 md:pb-32">
        <div className="grid gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line text-teal">
                  {step.icon}
                </span>
                <p className="font-display text-[0.68rem] tracking-[0.22em] text-teal uppercase">
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
