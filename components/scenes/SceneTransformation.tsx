"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function SceneTransformation() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const imgWrap = imgWrapRef.current;
      const tagline = taglineRef.current;
      if (!section || !imgWrap || !tagline) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        gsap.set(imgWrap, { scale: 1, y: 0 });
        gsap.set(tagline, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(imgWrap, { scale: 1.4, y: 40 });
      gsap.set(tagline, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=220%",
          pin: true,
          scrub: 0.6,
        },
      });

      tl.to(imgWrap, { scale: 1, y: 0, ease: "none", duration: 0.65 }).to(
        tagline,
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.35 },
        0.6
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-bg"
    >
      <h2 className="sr-only">The Transformation</h2>

      <div ref={imgWrapRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/sequences/transformation-gate.webp"
          alt="An open garden gate revealing the stone path and courtyard beyond"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-bg/45 via-bg/10 to-bg/70" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <p
          ref={taglineRef}
          className="text-balance text-center font-display text-[2.2rem] font-medium italic leading-[1.05] text-fg sm:text-[3.4rem] md:text-[4.4rem]"
        >
          A new way of living.
        </p>
      </div>
    </section>
  );
}
