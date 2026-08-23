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

function ServiceSlide({
  service,
  titleRef,
}: {
  service: ServiceItem;
  titleRef?: (el: HTMLHeadingElement | null) => void;
}) {
  return (
    <div className="relative h-[70dvh] w-full shrink-0 overflow-hidden rounded-2xl border border-line md:motion-safe:h-full md:motion-safe:w-screen md:motion-safe:rounded-none md:motion-safe:border-0">
      <div className="absolute inset-0 [animation:kenburns_16s_ease-in-out_infinite]">
        <Image
          src={service.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/45 to-bg/5" />

      <span
        className="pointer-events-none absolute bottom-4 right-5 font-display text-7xl font-extrabold text-fg/10 md:bottom-8 md:right-10 md:text-[9rem]"
        aria-hidden="true"
      >
        {service.index}
      </span>

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-8 md:mx-auto md:max-w-6xl md:px-10 md:pb-16">
        <div className="flex items-center gap-4">
          <span className="font-display text-xs tracking-[0.1em] text-muted">
            {service.index}
          </span>
          <span className="h-px flex-1 max-w-24 bg-line" />
          <span className="whitespace-nowrap rounded-full border border-line bg-fg/5 px-3 py-1 font-display text-[0.6rem] tracking-[0.14em] text-muted uppercase">
            {service.category}
          </span>
        </div>

        <h3
          ref={titleRef}
          className="mt-4 max-w-xl text-balance font-display text-[1.9rem] font-bold leading-[1.03] tracking-[-0.01em] text-fg [transform-origin:left_center] sm:text-[2.4rem] md:text-[3rem]"
        >
          {service.title}
        </h3>

        <p className="mt-3 max-w-md text-balance font-body text-base text-muted sm:text-lg">
          {service.description}
        </p>

        <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2 md:mt-6">
          {service.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-2.5 font-body text-[0.9rem] text-fg/80"
            >
              <span className="text-muted">
                <BulletIcon />
              </span>
              {bullet}
            </li>
          ))}
        </ul>

        <a
          href="#"
          className="group mt-6 inline-flex w-fit items-center gap-3 font-display text-[0.68rem] tracking-[0.14em] text-fg uppercase"
        >
          <span className="border-b border-fg/40 pb-0.5 transition-colors group-hover:border-teal">
            Discuss this service
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:translate-x-1 group-hover:border-teal/50 group-hover:text-teal">
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
  const trackRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const slideWrapRefs = useRef<HTMLDivElement[]>([]);
  const titleRefs = useRef<HTMLHeadingElement[]>([]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      const intro = introRef.current;
      const slides = slideWrapRefs.current;
      const track = trackRef.current;

      if (prefersReduced || !isDesktop || !track) {
        const allBlocks = [intro, ...slides].filter(Boolean) as HTMLElement[];

        if (prefersReduced) {
          gsap.set(allBlocks, { opacity: 1, y: 0 });
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
        return;
      }

      // Desktop, motion-enabled: horizontal scroll-jacking carousel.
      // Vertical scroll pans the whole track sideways, like paging
      // through a lookbook, instead of crossfading in place.
      let velocity = 0;
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => "+=" + (track.scrollWidth - window.innerWidth),
          pin: stageRef.current,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            velocity = self.getVelocity();
          },
        },
      });

      // The titles skew in the direction of scroll, like the type has
      // physical weight and drags slightly behind the pan, then snaps
      // upright as scrolling settles — tied to the same scroll signal
      // driving the horizontal carousel, not a separate hover gimmick.
      const setSkew = gsap.quickTo(titleRefs.current, "skewX", {
        duration: 0.5,
        ease: "power3",
      });
      const decay = () => {
        const target = gsap.utils.clamp(-14, 14, velocity / 140);
        setSkew(target);
        velocity *= 0.85;
      };
      gsap.ticker.add(decay);

      return () => {
        gsap.ticker.remove(decay);
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-line bg-bg"
      style={{
        backgroundImage:
          "radial-gradient(1100px 560px at 10% -10%, var(--color-teal-dim), transparent 60%)",
      }}
    >
      <div
        ref={stageRef}
        className="relative flex w-full flex-col overflow-hidden py-24 md:motion-safe:h-[100dvh] md:motion-safe:py-0"
      >
        <div
          ref={trackRef}
          className="flex flex-col gap-10 px-6 md:motion-safe:h-full md:motion-safe:flex-row md:motion-safe:flex-nowrap md:motion-safe:gap-0 md:motion-safe:px-0"
        >
          <div
            ref={introRef}
            className="flex flex-col justify-center md:motion-safe:h-full md:motion-safe:w-screen md:motion-safe:shrink-0 md:motion-safe:items-center md:motion-safe:px-10 md:motion-safe:text-center"
          >
            <div className="flex items-center gap-3 md:motion-safe:justify-center">
              <span className="h-px w-8 bg-line" />
              <p className="font-display text-[0.68rem] tracking-[0.18em] text-teal uppercase">
                Our Expertise
              </p>
            </div>
            <h2
              ref={(el) => {
                if (el) titleRefs.current[0] = el;
              }}
              className="mt-5 max-w-2xl text-balance font-display text-[2.6rem] font-bold leading-[1.0] tracking-[-0.01em] text-fg [transform-origin:center] sm:text-[3.6rem] md:text-[4.4rem]"
            >
              Every service is a chapter in your landscape story.
            </h2>
            <p className="mt-5 font-display text-[0.62rem] tracking-[0.18em] text-muted uppercase md:motion-safe:hidden">
              Scroll to explore
            </p>
          </div>

          {SERVICES.map((service, i) => (
            <div
              key={service.index}
              ref={(el) => {
                if (el) slideWrapRefs.current[i] = el;
              }}
              className="md:motion-safe:h-full md:motion-safe:shrink-0"
            >
              <ServiceSlide
                service={service}
                titleRef={(el) => {
                  if (el) titleRefs.current[i + 1] = el;
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
