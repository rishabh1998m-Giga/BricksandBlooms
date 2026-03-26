import { useState, useEffect, useRef, type RefObject } from 'react';
import { ArrowRight, Trophy } from 'lucide-react';
import { motion, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VERSION_THEMES, type VersionKey, withVersionPath } from '../theme/versionThemes';

gsap.registerPlugin(ScrollTrigger);

const HERO_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface HeroSectionProps {
  heroRef: RefObject<HTMLElement | null>;
  scrollYProgress: MotionValue<number>;
  version: VersionKey;
}

const HeroSection = ({ heroRef, scrollYProgress, version }: HeroSectionProps) => {
  const [time, setTime] = useState('--:--');
  const [counterDisplay, setCounterDisplay] = useState('0');
  const [counterDone, setCounterDone] = useState(false);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLHeadingElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();
  const theme = VERSION_THEMES[version];

  const heroForegroundOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.85]);
  const heroForegroundY = useTransform(scrollYProgress, [0, 1], [0, -44]);
  const heroForegroundScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  const heroBgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroBgY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroGlowY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  useEffect(() => {
    const updateTime = () => {
      const blrTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTime(blrTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        imageRef.current,
        { scale: 1.28, y: 44, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
        0.1
      );

      tl.fromTo(
        createRef.current,
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        0.2
      );

      tl.fromTo(
        '.hero-label',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.12 },
        0.35
      );

      tl.fromTo(
        logoRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        0.5
      );

      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.65 },
        0.62
      );

      const counterObj = { val: 0 };
      tl.to(
        counterObj,
        {
          val: 120,
          duration: 1.4,
          ease: 'power2.out',
          onStart: () => setCounterDone(false),
          onUpdate: () => setCounterDisplay(String(Math.round(counterObj.val))),
          onComplete: () => setCounterDone(true),
        },
        0.62
      );

      tl.fromTo(
        '.hero-bottom-item',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
        0.72
      );
      if (reduceMotion) {
        tl.progress(1);
      }
    }, stickyRef);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!heroImageLoaded) return;
    ScrollTrigger.refresh();
  }, [heroImageLoaded]);

  return (
    <section
      ref={heroRef}
      className="hero-wrapper relative h-screen w-full"
    >
      <div
        ref={stickyRef}
        className="hero-sticky sticky top-0 h-screen w-full overflow-hidden bg-[#0a0a0a] pt-[64px]"
      >
        <motion.div
          className="pointer-events-none absolute right-[-10rem] top-[10%] z-[7] h-[38rem] w-[38rem] rounded-full blur-[6px]"
          style={{
            y: prefersReducedMotion ? 0 : heroGlowY,
            background: theme.heroGlow,
          }}
        />

        {/* Hero Image */}
        <div
          ref={imageRef}
          className="absolute inset-x-0 top-0 z-0 w-full opacity-0"
          style={{ perspective: '1200px' }}
        >
          <motion.div
            className="relative w-full will-change-transform"
            style={{
              scale: prefersReducedMotion ? 1 : heroBgScale,
              y: prefersReducedMotion ? 0 : heroBgY,
              transformOrigin: 'center center',
            }}
          >
            <div className="relative h-screen w-full">
              <video
                src="/hero-prakrti-nilaya.webm"
                muted
                loop
                autoPlay
                playsInline
                preload="auto"
                poster="/hero-woman-flowers.jpg"
                className="h-full w-full object-cover object-center"
                onLoadedData={() => setHeroImageLoaded(true)}
              />
              <div
                className="pointer-events-none absolute inset-0 z-[11] opacity-[0.2]"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at center, rgba(255,255,255,0.12) 1px, transparent 1px)',
                  backgroundSize: '6px 6px',
                }}
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 z-[15] bg-gradient-to-b from-black/20 via-transparent to-black/70" />
              <div className="absolute bottom-0 left-0 right-0 z-[16] h-[78%] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/75 to-transparent" />
              <div className="absolute inset-y-0 left-0 z-[16] w-[22%] bg-gradient-to-r from-[#0a0a0a] to-transparent" />
              <div className="absolute inset-y-0 right-0 z-[16] w-[22%] bg-gradient-to-l from-[#0a0a0a] to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-[8] mix-blend-overlay opacity-[0.04]"
          aria-hidden
          style={{ backgroundImage: HERO_GRAIN }}
        />

        {/* Content Overlay */}
        <motion.div
          ref={foregroundRef}
          className="relative z-10 flex h-[calc(100vh-64px)] w-full flex-col px-6 lg:px-12 will-change-transform"
          style={
            prefersReducedMotion
              ? undefined
              : {
                  opacity: heroForegroundOpacity,
                  y: heroForegroundY,
                  scale: heroForegroundScale,
                }
          }
        >
          {/* Row 1: Section label + Stats */}
          <div className="flex flex-1 flex-col">
            <div className="hero-label flex items-center gap-3 pt-6 opacity-0">
              <div className="h-px w-12 bg-white/30" />
              <span className="text-[10px] font-medium tracking-[0.12em] text-white/50 font-mono">
                // 00.01°
              </span>
            </div>

            <div className="mt-4 flex items-start justify-end lg:mt-8">
              <div ref={statsRef} className="hidden shrink-0 text-right opacity-0 lg:block">
                <div className="text-coral text-[56px] font-bold leading-none tracking-tight md:text-[72px]">
                  <span className="will-change-[contents]">
                    {counterDisplay}
                    {counterDone ? '+' : ''}
                  </span>
                </div>
                <p className="mt-2 max-w-[160px] text-right text-[10px] font-semibold uppercase leading-relaxed tracking-[0.1em] text-white/50">
                  Quietly making noise for brands worldwide
                </p>
                <div className="mt-3 flex items-center justify-end gap-2">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full border border-white/30">
                    <span className="text-[6px] font-bold text-white/60">Q</span>
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide text-white/60">Wendrich</span>
                </div>
              </div>
            </div>

            {/* Brick & Blooms Logo */}
            <div
              ref={logoRef}
              className="mt-4 flex items-center justify-center opacity-0"
            >
              <span className="text-coral text-[60px] font-extrabold leading-none tracking-tighter sm:text-[80px] md:text-[100px] lg:text-[130px] xl:text-[150px]">
                Brick
              </span>
              <span className="text-[60px] font-extrabold leading-none tracking-tighter text-white sm:text-[80px] md:text-[100px] lg:text-[130px] xl:text-[150px]">
                &amp; Blooms
              </span>
            </div>

            <div className="hero-label mt-4 flex items-center gap-3 opacity-0">
              <div className="h-px w-12 bg-white/30" />
              <span className="text-[10px] font-medium tracking-[0.12em] text-white/50 font-mono">
                // 00.02°
              </span>
            </div>
          </div>

          {/* Row 2: Bottom - Description + CTAs + Showreel */}
          <div ref={bottomRef} className="mt-auto grid grid-cols-1 gap-8 pb-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="hero-bottom-item mb-4 flex items-center gap-3 opacity-0">
                <div className="h-px w-12 bg-white/30" />
                <span className="text-[10px] font-medium tracking-[0.12em] text-white/50 font-mono">
                  // 00.03°
                </span>
              </div>

              <div className="hero-bottom-item opacity-0">
                <p className="mb-1 max-w-[420px] text-[11px] font-semibold uppercase leading-[1.8] tracking-[0.06em] text-white/70">
                  TRANSFORMING OUTDOOR SPACES WITH THOUGHTFUL LANDSCAPE DESIGN &amp; EXECUTION.
                </p>
                <p className="mb-4 max-w-[420px] text-[11px] font-semibold uppercase leading-[1.8] tracking-[0.06em] text-white/70">
                  DESIGN • CONSULTATION • EXECUTION • PROJECT MANAGEMENT.
                </p>
              </div>

              <div className="hero-bottom-item mb-5 opacity-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/60 sm:text-[11px]">
                  OUR TIME <span className="tabular-nums text-white/80">{time}</span> IST BENGALURU
                </p>
              </div>

              <div className="hero-bottom-item mb-4 flex items-center gap-3 opacity-0">
                <div className="h-px w-12 bg-white/30" />
                <span className="text-[10px] font-medium tracking-[0.12em] text-white/50 font-mono">
                  // 00.04°
                </span>
              </div>

              <div className="hero-bottom-item flex flex-wrap gap-3 opacity-0">
                <Link
                  to={withVersionPath(version, '/projects')}
                  className="group relative inline-flex min-h-12 items-center gap-2 overflow-hidden rounded-lg bg-coral px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02]"
                >
                  <span className="absolute left-3 top-1/2 -translate-x-6 -translate-y-1/2 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="transition-transform duration-300 group-hover:translate-x-3">SEE WORK</span>
                </Link>
                <Link
                  to={withVersionPath(version, '/services')}
                  className="group inline-flex min-h-12 items-center gap-2 rounded-lg border border-white/30 bg-transparent px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:text-[#111111]"
                >
                  LET&apos;S CHAT
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right - Showreel Card */}
            <div className="hero-bottom-item opacity-0 lg:col-span-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  SHOWREEL
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-px w-14 bg-white/20" />
                  <span className="text-[10px] font-medium tracking-[0.06em] text-white/40">
                    2026
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowreelOpen(true)}
                className="group relative w-full overflow-hidden rounded-xl border border-white/15 bg-white/5 p-3 text-left"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <video
                    src="/lbc-glimpse.webm"
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover opacity-35 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="relative flex items-center gap-3">
                  <video
                    src="/lbc-glimpse.webm"
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="h-16 w-24 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50">
                      Launch Film
                    </p>
                    <p className="text-[18px] font-semibold tracking-tight text-white">Showreel 2026</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/30 transition-all duration-300 group-hover:bg-white group-hover:text-black">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </button>

              <div className="mt-2 flex items-center gap-2">
                <Trophy className="h-3 w-3 text-white/40" />
                <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-white/40">
                  Best Digital Campaign, Wobbly Awards
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showreelOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setShowreelOpen(false)}
        >
          <div
            className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/25 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white"
              onClick={() => setShowreelOpen(false)}
            >
              Close
            </button>
            <video
              src="/lbc-glimpse.webm"
              controls
              autoPlay
              playsInline
              className="h-auto w-full"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
