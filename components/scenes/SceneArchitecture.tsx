"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 26;
const frameUrl = (i: number) =>
  `/sequences/architecture/frame-${String(i + 1).padStart(3, "0")}.webp`;

export default function SceneArchitecture() {
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

      if (prefersReduced) {
        resize();
        draw(FRAME_COUNT - 1);
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
      }

      resize();

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=260%",
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          draw(self.progress * (FRAME_COUNT - 1));
        },
      });

      window.addEventListener("resize", resize);
      return () => {
        window.removeEventListener("resize", resize);
        st.kill();
      };
    },
    { dependencies: [ready], scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-bg"
    >
      <h2 className="sr-only">Nature Meets Architecture</h2>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/35 via-transparent to-bg/70" />

      <div className="pointer-events-none absolute bottom-10 left-6 z-10 md:bottom-14 md:left-10">
        <span className="font-ui text-[0.62rem] font-medium tracking-[0.3em] text-fg/55 uppercase">
          Nature · Architecture
        </span>
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
