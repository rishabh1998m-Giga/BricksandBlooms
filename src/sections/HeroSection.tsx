import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Trophy } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const clientLogos = [
  'Obliqon', 'Lindholm', 'Vornberg', 'Wendrich',
  'Blackwell', 'Aurelis', 'Madison', 'Morisson',
];

const HeroSection = () => {
  const [time, setTime] = useState('--:--');
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const laTime = new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setTime(laTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const ctx = gsap.context(() => {
      // Master timeline for hero load sequence
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // 1. Image scales in
      tl.fromTo(
        imageRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5 },
        0.3
      );

      // 2. Section labels fade in
      tl.fromTo(
        '.hero-label',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.15 },
        0.5
      );

      // 3. Headline word-by-word
      const words = headlineRef.current?.querySelectorAll('.word');
      if (words) {
        tl.fromTo(
          words,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 },
          0.6
        );
      }

      // 4. Logo slides up
      tl.fromTo(
        logoRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        0.9
      );

      // 5. Stats area
      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        1.0
      );

      // 6. Counter animation for 120+
      const counterObj = { val: 0 };
      tl.to(
        counterObj,
        {
          val: 120,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = Math.round(counterObj.val) + '+';
            }
          },
        },
        1.0
      );

      // 7. Bottom section
      tl.fromTo(
        '.hero-bottom-item',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
        1.2
      );

      // Scroll parallax on image
      gsap.to(imageRef.current, {
        y: '-8%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  const headlineWords = ['Nature’s', 'Beauty', 'Delivered'];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] pt-[64px]"
    >
      {/* Hero Image */}
      <div
        ref={imageRef}
        className="absolute left-1/2 top-0 z-0 w-[120%] max-w-[1200px] -translate-x-1/2 opacity-0"
      >
        <div className="relative aspect-[3/4] w-full">
          <img
            src="/hero-woman-flowers.jpg"
            alt="Woman with blue flowers"
            className="h-full w-full object-cover object-top"
          />
          {/* Hero overlay text */}
          <div className="absolute inset-0 flex items-start justify-center pt-[10%]">
            <h1 className="text-[60px] sm:text-[80px] md:text-[100px] font-extrabold text-white/10 tracking-tight select-none pointer-events-none">
              let's create
            </h1>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[75%] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-[25%] bg-gradient-to-r from-[#0a0a0a] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-[25%] bg-gradient-to-l from-[#0a0a0a] to-transparent" />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-[1400px] flex-col px-6 lg:px-12">

        {/* Row 1: Section label + Headline + Stats */}
        <div className="flex flex-1 flex-col">
          {/* // 00.01° label */}
          <div className="hero-label flex items-center gap-3 pt-6 opacity-0">
            <div className="h-px w-12 bg-white/30" />
            <span className="text-[10px] font-medium tracking-[0.12em] text-white/50 font-mono">
              // 00.01°
            </span>
          </div>

          {/* Headline + Stats row */}
          <div className="mt-8 flex items-start justify-between">
            {/* Center - Headline */}
            <div className="flex-1 max-w-[700px] mx-auto text-center">
              <h5
                ref={headlineRef}
                className="text-[24px] sm:text-[30px] md:text-[38px] lg:text-[42px] font-medium leading-[1.25] tracking-tight text-white"
              >
                {headlineWords.map((word, index) => (
                  <span key={index} className="word inline-block mr-[0.3em] opacity-0">
                    {word}
                    {index === headlineWords.length - 1 && (
                      <span className="text-coral">.</span>
                    )}
                  </span>
                ))}
              </h5>
            </div>

            {/* Right - 120+ Stats */}
            <div ref={statsRef} className="hidden lg:block text-right opacity-0 shrink-0 ml-8">
              <div className="text-[56px] md:text-[72px] font-bold leading-none tracking-tight text-coral">
                <span ref={counterRef}>0+</span>
              </div>
              <p className="mt-2 max-w-[160px] text-right text-[10px] font-semibold uppercase leading-relaxed tracking-[0.1em] text-white/50">
                Quietly making noise for brands worldwide
              </p>
              {/* Brand logo placeholder */}
              <div className="mt-3 flex items-center justify-end gap-2">
                <div className="h-4 w-4 rounded-full border border-white/30 flex items-center justify-center">
                  <span className="text-[6px] text-white/60 font-bold">Q</span>
                </div>
                <span className="text-[11px] font-semibold text-white/60 tracking-wide">Wendrich</span>
              </div>
            </div>
          </div>

          {/* Brick & Blooms Logo */}
          <div
            ref={logoRef}
            className="mt-4 flex items-center justify-center opacity-0"
          >
            <span className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[130px] xl:text-[150px] font-extrabold leading-none tracking-tighter text-coral">
              Brick
            </span>
            <span className="text-[60px] sm:text-[80px] md:text-[100px] lg:text-[130px] xl:text-[150px] font-extrabold leading-none tracking-tighter text-white">
              &amp; Blooms
            </span>
          </div>

          {/* // 00.02° label */}
          <div className="hero-label flex items-center gap-3 mt-4 opacity-0">
            <div className="h-px w-12 bg-white/30" />
            <span className="text-[10px] font-medium tracking-[0.12em] text-white/50 font-mono">
              // 00.02°
            </span>
          </div>

          {/* Client logos marquee */}
          <div className="mt-6 overflow-hidden">
            <div className="flex animate-marquee gap-12 whitespace-nowrap">
              {[...clientLogos, ...clientLogos].map((logo, i) => (
                <div key={i} className="flex items-center gap-2 shrink-0 opacity-40">
                  <div className="h-5 w-5 rounded-full border border-white/30 flex items-center justify-center">
                    <span className="text-[7px] text-white font-bold">{logo[0]}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-white tracking-wide">{logo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Bottom - Description + CTAs + Showreel */}
        <div ref={bottomRef} className="grid grid-cols-1 gap-8 pb-8 mt-auto lg:grid-cols-12">
          {/* Left - Description and CTAs */}
          <div className="lg:col-span-7">
            {/* // 00.03° label */}
            <div className="hero-bottom-item flex items-center gap-3 mb-4 opacity-0">
              <div className="h-px w-12 bg-white/30" />
              <span className="text-[10px] font-medium tracking-[0.12em] text-white/50 font-mono">
                // 00.03°
              </span>
            </div>

            <div className="hero-bottom-item opacity-0">
              <p className="mb-1 max-w-[420px] text-[11px] font-semibold uppercase leading-[1.8] tracking-[0.06em] text-white/70">
                TRANSFORMING OUTDOOR SPACES WITH THOUGHTFUL LANDSCAPE DESIGN & EXECUTION.
              </p>
              <p className="mb-4 max-w-[420px] text-[11px] font-semibold uppercase leading-[1.8] tracking-[0.06em] text-white/70">
                DESIGN • CONSULTATION • EXECUTION • PROJECT MANAGEMENT.
              </p>
            </div>

            <div className="hero-bottom-item mb-5 opacity-0">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                    OUR TIME
                  </p>
                  <p className="text-[13px] font-medium tracking-tight text-white/80 tabular-nums">
                    {time}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                  UTC−8 LOS ANGELES
                </p>
              </div>
            </div>

            {/* // 00.04° label */}
            <div className="hero-bottom-item flex items-center gap-3 mb-4 opacity-0">
              <div className="h-px w-12 bg-white/30" />
              <span className="text-[10px] font-medium tracking-[0.12em] text-white/50 font-mono">
                // 00.04°
              </span>
            </div>

            <div className="hero-bottom-item flex flex-wrap gap-3 opacity-0">
              <a
                href="#work"
                className="group flex items-center gap-2 rounded-lg bg-coral px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-250 hover:bg-coral-hover"
              >
                SEE WORK
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-250 group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="group flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-250 hover:border-white/40 hover:bg-white/[0.03]"
              >
                LET'S CHAT
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-250 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right - Showreel Card */}
          <div className="hero-bottom-item lg:col-span-5 opacity-0">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
                SHOWREEL
              </span>
              <div className="flex items-center gap-2">
                <div className="h-px w-14 bg-white/20" />
                <span className="text-[10px] font-medium tracking-[0.06em] text-white/40">
                  \\2025
                </span>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl">
              <img
                src="/showreel-abstract.jpg"
                alt="Showreel 2025"
                className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-lg">
                  <div className="ml-1 h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-black" />
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Trophy className="h-3 w-3 text-white/40" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-white/40">
                Best Digital Campaign, Wobbly Awards
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
