import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WeCreateSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const lines = linesRef.current?.querySelectorAll('.line');
    if (!section || !lines) return;

    const ctx = gsap.context(() => {
      lines.forEach((line) => {
        gsap.fromTo(
          line,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: line,
              start: 'top 85%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Parallax the background droplets
      gsap.to('.droplet-bg', {
        y: '-15%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  // Generate realistic water droplets
  const droplets = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 8,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 30 + 6,
    duration: Math.random() * 4 + 4,
    opacity: Math.random() * 0.5 + 0.2,
    blur: Math.random() * 3,
  }));

  const textLines = [
    { text: 'we observe', color: 'text-black' },
    { text: 'we design', color: 'text-black' },
    { text: 'we transform', color: 'text-coral' },
    { text: 'outdoor spaces', color: 'text-black/70' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white py-32"
    >
      {/* Water droplet background */}
      <div className="droplet-bg absolute inset-0 overflow-hidden pointer-events-none">
        {droplets.map((d) => (
          <div
            key={d.id}
            className="absolute rounded-full"
            style={{
              left: d.left,
              width: d.size,
              height: d.size * 1.2,
              background: `radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.9) 0%, rgba(180,190,200,${d.opacity}) 40%, rgba(120,130,140,${d.opacity * 0.5}) 70%, transparent 100%)`,
              borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
              boxShadow: `
                inset -2px -3px 6px rgba(0,0,0,0.15),
                inset 3px 3px 6px rgba(255,255,255,0.5),
                0 2px 8px rgba(0,0,0,0.1)
              `,
              filter: `blur(${d.blur}px)`,
              animation: `dropFall ${d.duration}s ease-in ${d.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes dropFall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          88% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(5deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Text content */}
      <div ref={linesRef} className="relative z-10 flex flex-col items-center text-center px-6">
        {textLines.map((line, index) => (
          <div
            key={index}
            className={`line text-[56px] sm:text-[72px] md:text-[100px] lg:text-[130px] xl:text-[150px] font-extrabold leading-[0.95] tracking-tight ${line.color} opacity-0`}
          >
            {line.text}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeCreateSection;
