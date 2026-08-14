"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 31;
const frameUrl = (i: number) =>
  `/sequences/awakens/frame-${String(i + 1).padStart(3, "0")}.webp`;

const LINES = ["We Observe.", "We Design.", "We Transform."];

export default function SceneAwakens() {
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

      const lines = gsap.utils.toArray<HTMLElement>("[data-line]");

      if (prefersReduced) {
        resize();
        draw((FRAME_COUNT - 1) * 0.9);
        gsap.set(lines, { opacity: 1, y: 0, position: "static" });
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
      }

      resize();

      const textTl = gsap.timeline({ paused: true });
      gsap.set(lines, { opacity: 0, y: 16 });
      lines.forEach((el, i) => {
        textTl
          .to(el, { opacity: 1, y: 0, duration: 0.5 }, i * 0.9)
          .to(el, { opacity: 0, y: -16, duration: 0.4 }, i * 0.9 + 0.7);
      });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=300%",
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
      <h2 className="sr-only">
        The Landscape Awakens — We Observe. We Design. We Transform.
      </h2>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-transparent to-bg/65" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="relative h-16 w-full max-w-xl text-center" aria-hidden="true">
          {LINES.map((line, i) => (
            <p
              key={line}
              data-line
              className={`absolute inset-0 font-display text-4xl font-bold sm:text-6xl ${
                i === LINES.length - 1 ? "text-terracotta" : "text-fg"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg">
          <span className="font-display text-[0.68rem] uppercase tracking-[0.18em] text-muted">
            Loading
          </span>
        </div>
      )}
    </section>
  );
}
