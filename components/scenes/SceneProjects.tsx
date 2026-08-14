"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SceneProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const imgs = gsap.utils.toArray<HTMLElement>("[data-reveal-img]");

      if (prefersReduced) {
        gsap.set(reveals, { opacity: 1, y: 0 });
        gsap.set(imgs, { scale: 1 });
        return;
      }

      reveals.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      imgs.forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.12 },
          {
            scale: 1,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-bg px-6 py-28 md:py-40"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          data-reveal
          className="font-ui text-[0.7rem] font-medium tracking-[0.32em] text-teal uppercase"
        >
          Selected Projects
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:items-end md:gap-14">
          <div
            data-reveal
            className="relative aspect-[4/5] overflow-hidden"
          >
            <div data-reveal-img className="absolute inset-0">
              <Image
                src="/sequences/awakens/frame-001.webp"
                alt="Prakrti Nilaya — a carved stone garden urn framed by an arched brick niche"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div data-reveal>
            <h3 className="text-balance font-display text-[2.8rem] font-medium italic leading-[0.96] text-fg sm:text-[3.8rem]">
              Prakrti Nilaya
            </h3>
            <p className="mt-5 font-ui text-[0.68rem] font-medium tracking-[0.22em] text-muted uppercase">
              Landscape Design
            </p>
          </div>
        </div>

        <div
          data-reveal
          className="mt-20 grid gap-4 border-t border-line pt-10 sm:grid-cols-2"
        >
          <div className="border border-dashed border-line px-6 py-12 text-center">
            <p className="font-ui text-[0.64rem] font-medium tracking-[0.22em] text-muted uppercase">
              Selected Work — Reserved
            </p>
          </div>
          <div className="border border-dashed border-line px-6 py-12 text-center">
            <p className="font-ui text-[0.64rem] font-medium tracking-[0.22em] text-muted uppercase">
              Selected Work — Reserved
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
