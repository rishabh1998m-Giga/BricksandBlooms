import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import gsap from 'gsap';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      const links = mobileLinksRef.current?.querySelectorAll('.mobile-link');
      if (links) {
        gsap.fromTo(
          links,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
        );
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0a0a0a]/90 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[64px] max-w-[1400px] items-center justify-between px-6 lg:px-12">
          {/* Left side - Logo */}
          <div
            className={`flex items-center transition-all duration-500 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <a href="#" className="flex items-center" onClick={(e) => handleNavClick(e, '#')}>
              <span className="text-[22px] font-bold tracking-tight text-coral">Brick &amp; Blooms</span>
            </a>
          </div>

          {/* Center - Nav Links (Desktop) */}
          <div
            className={`hidden items-center gap-8 md:flex transition-all duration-500 delay-100 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <a
              href="#work"
              onClick={(e) => handleNavClick(e, '#work')}
              className="group relative flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-white/80 transition-all duration-200 hover:text-white"
            >
              Projects
              <span className="flex h-4 min-w-[14px] items-center justify-center rounded-[3px] bg-white px-1 text-[9px] font-bold text-black animate-pulse-badge">
                5
              </span>
            </a>
            <a
              href="#studio"
              onClick={(e) => handleNavClick(e, '#studio')}
              className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/80 transition-all duration-200 hover:text-white"
            >
              Services
            </a>
            <a
              href="#whispers"
              onClick={(e) => handleNavClick(e, '#whispers')}
              className="group relative flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-white/80 transition-all duration-200 hover:text-white"
            >
              Insights
              <span className="flex h-4 min-w-[14px] items-center justify-center rounded-[3px] bg-white px-1 text-[9px] font-bold text-black animate-pulse-badge">
                7
              </span>
            </a>
          </div>

          {/* Right side - Contact + Mobile Toggle */}
          <div
            className={`flex items-center gap-4 transition-all duration-500 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="group hidden md:flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-white/80 transition-all duration-200 hover:text-white"
            >
              Let’s talk
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 text-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={mobileMenuRef}
        className={`fixed inset-0 z-40 bg-[#0a0a0a] transition-all duration-500 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          ref={mobileLinksRef}
          className="flex flex-col items-center justify-center h-full gap-8 pt-16"
        >
          {[
            { label: 'Projects', href: '#work', badge: '5' },
            { label: 'Services', href: '#studio' },
            { label: 'Insights', href: '#whispers', badge: '7' },
            { label: 'Let’s talk', href: '#contact' },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="mobile-link flex items-center gap-3 text-[32px] font-bold uppercase tracking-tight text-white opacity-0"
            >
              {link.label}
              {link.badge && (
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded bg-white px-2 text-[12px] font-bold text-black">
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
