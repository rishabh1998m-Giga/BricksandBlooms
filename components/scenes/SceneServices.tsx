"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ServiceItem = {
  index: string;
  category: string;
  title: string;
  description: string;
  bullets: string[];
  image: string;
};

const SERVICES: ServiceItem[] = [
  {
    index: "/01",
    category: "Landscape",
    title: "Landscape Design",
    description:
      "The foundation of every great outdoor space — where vision meets thoughtful planning.",
    bullets: [
      "Site analysis & space assessment",
      "Conceptual landscape planning",
      "2D & 3D design visualization",
      "Plant selection & zoning",
      "Sustainable design solutions",
    ],
    image: "/assets/services/landscape-design.webp",
  },
  {
    index: "/02",
    category: "Terrace & Balcony",
    title: "Terrace & Balcony Gardens",
    description: "Turning compact spaces into lush, livable environments.",
    bullets: [
      "Terrace garden design",
      "Balcony garden styling",
      "Lightweight soil systems",
      "Irrigation planning",
      "Space-optimized plant layouts",
    ],
    image: "/assets/services/terrace-balcony.webp",
  },
  {
    index: "/03",
    category: "Execution",
    title: "Execution & Project Management",
    description: "From blueprint to bloom — we handle everything.",
    bullets: [
      "End-to-end execution",
      "Material sourcing & coordination",
      "On-site supervision",
      "Timeline & quality control",
      "Vendor management",
    ],
    image: "/assets/services/execution.webp",
  },
  {
    index: "/04",
    category: "Transformations",
    title: "Outdoor Transformations",
    description: "Enhancing residential and commercial outdoor environments.",
    bullets: [
      "Backyard landscaping",
      "Lawn development",
      "Hardscape & pathway design",
      "Water features & focal elements",
      "Lighting integration",
    ],
    image: "/assets/services/transformations.webp",
  },
  {
    index: "/05",
    category: "Maintenance",
    title: "Maintenance & Plant Care",
    description: "Keeping your landscape thriving long after installation.",
    bullets: [
      "Routine garden maintenance",
      "Plant health monitoring",
      "Seasonal replanting",
      "Soil & irrigation management",
      "Landscape upgrades",
    ],
    image: "/assets/services/maintenance.webp",
  },
  {
    index: "/06",
    category: "Consultation",
    title: "Consultation & Custom Solutions",
    description: "Tailored solutions for unique spaces and visions.",
    bullets: [
      "Landscape consultation",
      "Space optimization planning",
      "Commercial landscaping strategy",
      "Sustainable planting guidance",
      "Custom garden concepts",
    ],
    image: "/assets/services/consultation.webp",
  },
];

function BulletIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="mt-[3px] shrink-0"
    >
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="7" cy="7" r="2" fill="currentColor" />
    </svg>
  );
}

function ServiceCard({
  service,
  panelClassName,
  lineRef,
}: {
  service: ServiceItem;
  panelClassName?: string;
  lineRef?: (el: HTMLSpanElement | null) => void;
}) {
  return (
    <div
      className={
        panelClassName ??
        "grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:gap-16"
      }
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_20px_60px_-20px_rgba(20,19,16,0.35)]">
        <Image
          src={service.image}
          alt=""
          fill
          sizes="(min-width: 768px) 42vw, 100vw"
          className="object-cover"
        />
        <span className="absolute bottom-4 left-5 font-display text-6xl font-bold text-white/60 md:text-7xl">
          {service.index}
        </span>
      </div>

      <div>
        <div className="flex items-center gap-4">
          <span className="font-display text-xs tracking-[0.1em] text-[#8a8676]">
            {service.index}
          </span>
          <span className="relative h-px flex-1 bg-[#141310]/10">
            <span
              ref={lineRef}
              className="absolute inset-y-0 left-0 block h-px w-full origin-left scale-x-0 bg-[#141310]/45"
            />
          </span>
          <span className="whitespace-nowrap rounded-full border border-[#141310]/10 bg-white/70 px-3 py-1 font-display text-[0.6rem] tracking-[0.14em] text-[#6b675e] uppercase">
            {service.category}
          </span>
        </div>

        <h3 className="mt-5 text-balance font-display text-[2rem] font-bold leading-[1.05] text-[#141310] sm:text-[2.4rem]">
          {service.title}
        </h3>

        <p className="mt-4 max-w-md text-balance font-body text-base text-[#6b675e] sm:text-lg">
          {service.description}
        </p>

        <ul className="mt-6 space-y-2.5">
          {service.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2.5 font-body text-[0.95rem] text-[#3f3d36]"
            >
              <span className="text-[#8a8676]">
                <BulletIcon />
              </span>
              {bullet}
            </li>
          ))}
        </ul>

        <a
          href="#"
          className="group mt-8 inline-flex items-center gap-3 font-display text-[0.68rem] tracking-[0.14em] text-[#141310] uppercase"
        >
          <span className="border-b border-[#141310]/40 pb-0.5 transition-colors group-hover:border-[#141310]">
            Discuss this service
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#141310]/25 transition-transform duration-300 group-hover:translate-x-1">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2 8h11M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}

export default function SceneServices() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLDivElement[]>([]);
  const lineRefs = useRef<HTMLSpanElement[]>([]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      const intro = introRef.current;
      const panels = panelRefs.current;
      const lines = lineRefs.current;

      if (prefersReduced || !isDesktop) {
        const allBlocks = [intro, ...panels].filter(Boolean) as HTMLElement[];

        if (prefersReduced) {
          gsap.set(allBlocks, { opacity: 1, y: 0 });
          gsap.set(lines, { scaleX: 1 });
          return;
        }

        gsap.set(allBlocks, { opacity: 0, y: 28 });
        ScrollTrigger.batch(allBlocks, {
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
        lines.forEach((line) => {
          ScrollTrigger.create({
            trigger: line,
            start: "top 90%",
            once: true,
            onEnter: () =>
              gsap.to(line, { scaleX: 1, duration: 1, ease: "power3.out" }),
          });
        });
        return;
      }

      // Desktop, motion-enabled: pinned crossfade sequence.
      gsap.set(panels, { opacity: 0, y: 30 });
      gsap.set(intro, { opacity: 1, y: 0 });
      gsap.set(lines, { scaleX: 0 });

      const beats = 1 + SERVICES.length;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: `+=${beats * 100}%`,
          scrub: 1.1,
          pin: stageRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      tl.to(intro, { opacity: 0, y: -24, duration: 0.6 }, 0.15);

      SERVICES.forEach((_, i) => {
        const start = 0.7 + i;
        const panel = panels[i];
        const line = lines[i];
        if (!panel) return;

        tl.to(
          panel,
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          start
        );
        if (line) {
          tl.to(line, { scaleX: 1, duration: 0.7, ease: "power2.out" }, start);
        }
        if (i < SERVICES.length - 1) {
          tl.to(
            panel,
            { opacity: 0, y: -24, duration: 0.4, ease: "power2.in" },
            start + 0.85
          );
        }
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative bg-[#f4f1ea]"
    >
      <div
        ref={stageRef}
        className="relative mx-auto flex w-full max-w-6xl flex-col justify-center overflow-hidden px-6 py-24 md:px-10 md:motion-safe:min-h-[100dvh] md:motion-safe:overflow-visible"
      >
        <div ref={introRef} className="relative md:motion-safe:absolute md:motion-safe:inset-x-6 md:motion-safe:top-1/2 md:motion-safe:-translate-y-1/2 lg:motion-safe:inset-x-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#141310]/40" />
            <p className="font-display text-[0.68rem] tracking-[0.18em] text-[#6b675e] uppercase">
              Our Expertise
            </p>
          </div>
          <h2 className="mt-5 max-w-2xl text-balance font-display text-[2.4rem] font-bold leading-[1.03] text-[#141310] sm:text-[3.2rem] md:text-[3.6rem]">
            Every service is a chapter in your landscape story.
          </h2>
        </div>

        {SERVICES.map((service, i) => (
          <div
            key={service.index}
            ref={(el) => {
              if (el) panelRefs.current[i] = el;
            }}
            className="relative mt-24 md:mt-24 md:motion-safe:absolute md:motion-safe:inset-x-6 md:motion-safe:top-1/2 md:motion-safe:mt-0 md:motion-safe:-translate-y-1/2 lg:motion-safe:inset-x-10"
          >
            <ServiceCard
              service={service}
              lineRef={(el) => {
                if (el) lineRefs.current[i] = el;
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
