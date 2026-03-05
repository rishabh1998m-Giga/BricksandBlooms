import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  value: number;
  suffix: string;
  label: string;
  code: string;
  barWidth: string;
}

const stats: Stat[] = [
  { value: 10000, suffix: '+', label: 'PLANTS INSTALLED', code: '//001', barWidth: '95%' },
  { value: 50, suffix: '+', label: 'TERRACE & BALCONY GARDENS', code: '//002', barWidth: '80%' },
  { value: 4, suffix: '+', label: 'YEARS OF DESIGN & EXECUTION EXPERTISE', code: '//003', barWidth: '70%' },
  { value: 95, suffix: '%', label: 'PROJECT COMPLETION WITHIN TIMELINE', code: '//004', barWidth: '95%' },
];

const clientLogos = [
  'Obliqon', 'Lindholm', 'Vornberg', 'Wendrich',
  'Blackwell', 'Aurelis', 'Madison', 'Morisson',
];

const AnimatedCounter = ({ value, suffix, shouldAnimate }: { value: number; suffix: string; shouldAnimate: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;
    let startTime: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, shouldAnimate]);

  return <span>{count}{suffix}</span>;
};

const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        onEnter: () => setShouldAnimate(true),
      });

      gsap.fromTo(
        section.querySelectorAll('.stat-item'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        }
      );

      // Animate progress bars
      gsap.fromTo(
        section.querySelectorAll('.stat-bar-fill'),
        { width: '0%' },
        {
          width: (i) => stats[i]?.barWidth || '0%',
          duration: 1.5,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0a0a0a] overflow-hidden">
      {/* Header area */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 pt-24">
        {/* PERFORMANCE label */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-coral">
            PERFORMANCE
          </span>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="mb-4 text-[32px] font-medium leading-[1.1] tracking-tight text-white md:text-[44px]">
              The proof behind our landscapes
            </h2>
            <p className="max-w-[460px] text-[14px] leading-relaxed text-white/50">
              From concept to completion, we design and deliver outdoor spaces that stand the test of time.
            </p>
          </div>
          {/* Logo placeholder */}
          <div className="hidden md:block">
            <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="text-[14px] font-bold text-white/40">C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 pb-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item opacity-0">
              {/* Small starting number + large number */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[14px] font-medium text-white/30">
                  {index === 0 ? '10+' : index === 1 ? '10%' : index === 2 ? '10' : '10%'}
                </span>
              </div>
              <div className="mb-3 text-[48px] font-bold leading-none tracking-tight text-coral md:text-[64px]">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} shouldAnimate={shouldAnimate} />
              </div>
              
              {/* Label */}
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
                {stat.label}
              </p>
              
              {/* Progress bar */}
              <div className="mb-2 h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="stat-bar-fill h-full bg-gradient-to-r from-coral to-coral/60 rounded-full"
                  style={{ width: '0%' }}
                />
              </div>
              
              {/* Code */}
              <div className="text-[10px] font-medium tracking-[0.12em] text-white/30">
                {stat.code}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave background overlay */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 80%, rgba(255,107,74,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 50%, rgba(50,50,80,0.3) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Client Logos Section */}
      <div className="relative z-10 border-t border-white/10 py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <p className="mb-10 text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
            Brands who are part of our success story
          </p>

          {/* Logo marquee */}
          <div className="overflow-hidden">
            <div className="flex animate-marquee gap-16 whitespace-nowrap items-center justify-center">
              {[...clientLogos, ...clientLogos].map((logo, i) => (
                <div key={i} className="flex items-center gap-2 shrink-0 opacity-50 hover:opacity-80 transition-opacity">
                  <div className="h-6 w-6 rounded-full border border-white/30 flex items-center justify-center">
                    <span className="text-[9px] text-white font-bold">{logo[0]}</span>
                  </div>
                  <span className="text-[14px] font-semibold text-white tracking-wide">{logo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
