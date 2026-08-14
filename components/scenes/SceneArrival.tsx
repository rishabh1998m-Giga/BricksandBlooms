"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 26;
const frameUrl = (i: number) =>
  `/sequences/architecture/frame-${String(i + 1).padStart(3, "0")}.webp`;

export default function SceneArrival() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = frameUrl(i);
      img.onload = () => {
        loaded++;
        if (loaded === FRAME_COUNT && !cancelled) setReady(true);
      };
      images.push(img);
    }
    imagesRef.current = images;
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    () => {
      if (!ready) return;
      const canvas = canvasRef.current;
      const section = sectionRef.current;
      if (!canvas || !section) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const progressRef = { current: 0 };

      const draw = (index: number) => {
        const img =
          imagesRef.current[
            Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(index)))
          ];
        if (!img || !img.complete || !img.naturalWidth) return;
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        let sx = 0,
          sy = 0,
          sw = img.naturalWidth,
          sh = img.naturalHeight;
        if (imgRatio > canvasRatio) {
          sw = img.naturalHeight * canvasRatio;
          sx = (img.naturalWidth - sw) / 2;
        } else {
          sh = img.naturalWidth / canvasRatio;
          sy = (img.naturalHeight - sh) / 2;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        draw(progressRef.current * (FRAME_COUNT - 1));
      };

      const brand = gsap.utils.toArray<HTMLElement>("[data-brand]");
      const thesis = gsap.utils.toArray<HTMLElement>("[data-thesis]");
      const settle = gsap.utils.toArray<HTMLElement>("[data-settle]");

      const settleBrand = gsap.utils.toArray<HTMLElement>(
        "[data-settle-brand]"
      );

      if (prefersReduced) {
        resize();
        draw(FRAME_COUNT - 1);
        gsap.set(brand, { opacity: 0, display: "none" });
        gsap.set(thesis, { opacity: 0, display: "none" });
        gsap.set(settleBrand, { opacity: 1, display: "block" });
        gsap.set(settle, { opacity: 1, y: 0 });
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
      }

      gsap.set(settleBrand, { display: "none" });

      resize();

      gsap.set(brand, { opacity: 0, scale: 0.75, filter: "blur(18px)" });
      gsap.set(thesis, { opacity: 0, scale: 0.85, filter: "blur(18px)" });
      gsap.set(settle, { opacity: 0, y: 22 });

      const textTl = gsap.timeline({ paused: true });
      textTl
        .to(brand, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.1, ease: "power2.out" }, 0.02)
        .to(brand, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.12 }, 0.12)
        .to(brand, { opacity: 0, scale: 1.35, filter: "blur(22px)", duration: 0.1, ease: "power1.in" }, 0.24)
        .to(thesis, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.11, ease: "power2.out" }, 0.36)
        .to(thesis, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.14 }, 0.47)
        .to(thesis, { opacity: 0, scale: 1.3, filter: "blur(20px)", duration: 0.1, ease: "power1.in" }, 0.6)
        .to(settle, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out", stagger: 0.05 }, 0.72);

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=320%",
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          draw(self.progress * (FRAME_COUNT - 1));
          textTl.progress(self.progress);
        },
      });

      window.addEventListener("resize", resize);
      return () => {
        window.removeEventListener("resize", resize);
        st.kill();
        textTl.kill();
      };
    },
    { dependencies: [ready], scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-bg"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/35 via-bg/10 to-bg/55" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center [perspective:1200px]">
        <div
          data-brand
          className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center px-6"
        >
          <h1 className="text-balance font-display text-[3rem] font-black leading-[0.9] tracking-[-0.02em] text-fg sm:text-[5.5rem] md:text-[7.5rem]">
            Bricks <span className="text-terracotta">&amp;</span>
            <br />
            Bloom
          </h1>
        </div>

        <div
          data-thesis
          className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center px-6"
        >
          <h2 className="text-balance max-w-4xl font-display text-[2.4rem] font-black uppercase leading-[0.95] tracking-[-0.01em] text-fg sm:text-[4.2rem] md:text-[5.6rem]">
            Landscape
            <br />
            <span className="italic text-terracotta">as Experience.</span>
          </h2>
        </div>

        <div className="flex flex-col items-center">
          <p
            data-settle-brand
            className="mb-4 font-display text-2xl font-black leading-none text-fg sm:text-3xl"
          >
            Bricks <span className="text-terracotta">&amp;</span> Bloom
          </p>

          <p
            data-settle
            className="font-ui text-[0.7rem] font-semibold tracking-[0.32em] text-teal uppercase"
          >
            Architects · Interiors · Landscape
          </p>

          <p
            data-settle
            className="mt-6 max-w-xl text-balance font-body text-xl text-fg/80 sm:text-2xl"
          >
            Transforming outdoor spaces with thoughtful landscape design &amp;
            execution.
          </p>
        </div>
      </div>

      <div
        data-settle
        className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-ui text-[0.62rem] font-medium tracking-[0.28em] text-fg/60 uppercase">
          Scroll
        </span>
        <span className="h-10 w-px animate-pulse bg-fg/30" />
      </div>

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg">
          <span className="font-ui text-[0.68rem] font-medium uppercase tracking-[0.2em] text-muted">
            Loading
          </span>
        </div>
      )}
    </section>
  );
}
