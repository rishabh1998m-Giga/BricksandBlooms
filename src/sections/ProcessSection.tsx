import { useEffect, useRef } from 'react';
import { ArrowRight, Search, Lightbulb, Palette, Rocket } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const processSteps = [
  {
    number: '//01',
    title: 'DISCOVERY',
    description: 'We begin by understanding your space, lifestyle, and vision. Site visits, soil study, sunlight patterns, and functional needs are carefully mapped before design begins.',
    icon: Search,
  },
  {
    number: '//02',
    title: 'PLANNING & DESIGN',
    description: 'With insights in place, we create thoughtful landscape concepts. Layouts, plant selection, zoning, irrigation planning, and 3D visualizations ensure clarity before execution.',
    icon: Lightbulb,
  },
  {
    number: '//03',
    title: 'EXECUTION & BUILD',
    description: 'Design comes to life with precision. From sourcing materials to on-site supervision, we manage every detail to ensure quality and timeline control.',
    icon: Palette,
  },
  {
    number: '//04',
    title: 'GROW & MAINTAIN',
    description: 'Installation is just the beginning. We guide plant care, maintenance schedules, and seasonal upgrades to ensure your landscape thrives long-term.',
    icon: Rocket,
  },
];

const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.process-item'),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24"
      style={{
        background: 'linear-gradient(135deg, #0a0a2e 0%, #1a0a3e 30%, #2a1050 50%, #3a1060 70%, #1a0a2e 100%)',
      }}
    >
      {/* Abstract gradient overlay */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse at 30% 60%, rgba(60,40,120,0.5) 0%, transparent 50%), radial-gradient(ellipse at 70% 40%, rgba(180,50,80,0.2) 0%, transparent 40%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/50">
            HOW WE WORK
          </span>
        </div>

        <div className="flex items-start justify-between mb-12">
          <div>
            <h2 className="mb-4 text-[32px] md:text-[44px] font-medium leading-[1.1] tracking-tight text-white">
              The process behind every landscape
            </h2>
            <p className="max-w-[460px] text-[14px] leading-relaxed text-white/50">
              We work with clarity and care. Every step is designed to transform your space with confidence.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
              <span className="text-[14px] font-bold text-white/40">C</span>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left - Process info + Steps */}
          <div>
            {/* Services card */}
            <div className="process-item mb-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 opacity-0">
              <h3 className="mb-3 text-[20px] font-medium text-white">
                From concept to bloom, follow the journey that brings your outdoor space to life.
              </h3>
              <p className="mb-6 text-[13px] leading-relaxed text-white/50">
                Our process keeps every project clear, structured, and easy to follow — from the first walk-through to the final planting.
              </p>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-coral transition-colors hover:text-coral-hover"
              >
                Chat with our Operations Manager
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Process steps */}
            <div className="space-y-4">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="process-item rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 opacity-0 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <Icon className="h-4 w-4 text-white/70" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-[10px] font-medium text-coral">{step.number}</span>
                          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white">
                            {step.title}
                          </span>
                        </div>
                        <p className="text-[12px] leading-relaxed text-white/50">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right - Featured Project Card */}
          <div className="process-item opacity-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden h-full">
              {/* Project image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/project-blackwell.jpg"
                  alt="Featured Brick & Blooms landscape project"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full border border-white/30 flex items-center justify-center">
                    <span className="text-[7px] font-bold text-white">B</span>
                  </div>
                  <span className="text-[12px] font-semibold text-white">Brick & Blooms</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-6">
                <p className="mb-4 text-[12px] leading-relaxed text-white/60">
                  Follow a real landscape transformation from first site visit to final planting — and see how every step shapes the result.
                </p>

                <div className="mb-4">
                  <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/80">
                    Our process in motion
                  </h4>
                  <p className="text-[12px] leading-relaxed text-white/50">
                    Explore how strategy, design, and execution align seamlessly in every Brick & Blooms project.
                  </p>
                </div>

                <a
                  href="#work"
                  className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-coral transition-colors hover:text-coral-hover"
                >
                  View our projects
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
