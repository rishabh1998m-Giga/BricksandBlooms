import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  number: string;
  category: string;
  title: string;
  description: string;
  features: string[];
  imageColor: string;
}

const services: Service[] = [
  {
    number: '/01',
    category: 'LANDSCAPE',
    title: 'Landscape Design',
    description: 'The foundation of every great outdoor space — where vision meets thoughtful planning.',
    features: [
      'Site analysis & space assessment',
      'Conceptual landscape planning',
      '2D & 3D design visualization',
      'Plant selection & zoning',
      'Sustainable design solutions',
    ],
    imageColor: 'from-orange-600 to-red-800',
  },
  {
    number: '/02',
    category: 'TERRACE & BALCONY',
    title: 'Terrace & Balcony Gardens',
    description: 'Turning compact spaces into lush, livable environments.',
    features: [
      'Terrace garden design',
      'Balcony garden styling',
      'Lightweight soil systems',
      'Irrigation planning',
      'Space-optimized plant layouts',
    ],
    imageColor: 'from-teal-600 to-blue-800',
  },
  {
    number: '/03',
    category: 'EXECUTION',
    title: 'Execution & Project Management',
    description: 'From blueprint to bloom — we handle everything.',
    features: [
      'End-to-end execution',
      'Material sourcing & coordination',
      'On-site supervision',
      'Timeline & quality control',
      'Vendor management',
    ],
    imageColor: 'from-gray-600 to-gray-900',
  },
  {
    number: '/04',
    category: 'TRANSFORMATIONS',
    title: 'Outdoor Transformations',
    description: 'Enhancing residential and commercial outdoor environments.',
    features: [
      'Backyard landscaping',
      'Lawn development',
      'Hardscape & pathway design',
      'Water features & focal elements',
      'Lighting integration',
    ],
    imageColor: 'from-purple-600 to-indigo-800',
  },
  {
    number: '/05',
    category: 'CARE',
    title: 'Maintenance & Plant Care',
    description: 'Keeping your landscape thriving long after installation.',
    features: [
      'Routine garden maintenance',
      'Plant health monitoring',
      'Seasonal replanting',
      'Soil & irrigation management',
      'Landscape upgrades',
    ],
    imageColor: 'from-blue-600 to-cyan-800',
  },
  {
    number: '/06',
    category: 'CONSULTATION',
    title: 'Consultation & Custom Solutions',
    description: 'Tailored solutions for unique spaces and visions.',
    features: [
      'Landscape consultation',
      'Space optimization planning',
      'Commercial landscaping strategy',
      'Sustainable planting guidance',
      'Custom garden concepts',
    ],
    imageColor: 'from-gray-700 to-black',
  },
];

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.service-item'),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="studio" className="w-full bg-white py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-black/40">
          What we do best, and what your next project needs most.
        </div>
        <h2 className="mb-16 text-[48px] md:text-[72px] font-medium leading-none tracking-tight text-black/10">
          services
        </h2>

        {/* Services List */}
        <div className="divide-y divide-black/10">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-item group grid grid-cols-1 gap-6 py-10 opacity-0 transition-colors duration-300 hover:bg-black/[0.02] lg:grid-cols-12 lg:gap-8"
            >
              {/* Image placeholder */}
              <div className="lg:col-span-3">
                <div className={`aspect-[4/3] w-full rounded-xl bg-gradient-to-br ${service.imageColor} overflow-hidden`}>
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-white/20 text-[40px] font-bold">{service.number}</span>
                  </div>
                </div>
              </div>

              {/* Category + Title + Description */}
              <div className="lg:col-span-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/40">
                    {service.category}
                  </span>
                  <span className="text-[10px] font-medium text-black/30">
                    {service.number.replace('/', '/0')}
                  </span>
                </div>
                <h3 className="mb-3 text-[28px] md:text-[36px] font-medium leading-tight tracking-tight text-black">
                  {service.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-black/50">
                  {service.description}
                </p>
              </div>

              {/* Features */}
              <div className="lg:col-span-4">
                <div className="space-y-2.5">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-[12px] font-medium text-coral">+</span>
                      <span className="text-[13px] leading-relaxed text-black/60">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
