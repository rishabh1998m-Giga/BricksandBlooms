import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import gsap from 'gsap';
import { VERSION_THEMES, type VersionKey, withVersionPath } from '../theme/versionThemes';
import BrandLogo from './BrandLogo';

interface NavigationProps {
  version: VersionKey;
}

const Navigation = ({ version }: NavigationProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileLinksRef = useRef<HTMLDivElement>(null);
  const theme = VERSION_THEMES[version];

  const tabs = [
    { label: 'Projects', path: '/projects', badge: '5' },
    { label: 'Services', path: '/services' },
    { label: 'Insights', path: '/insights', badge: '7' },
    { label: 'Team', path: '/team' },
  ];

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

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'backdrop-blur-xl'
            : 'bg-transparent backdrop-blur-sm'
        }`}
        style={scrolled ? { background: theme.navGradient } : undefined}
      >
        <div className="mx-auto flex h-[64px] max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <div
            className={`flex items-center transition-all duration-500 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <Link to={withVersionPath(version, '/')} className="flex items-center" onClick={handleNavClick}>
              <BrandLogo className="h-10 w-auto md:h-12 mix-blend-screen" />
            </Link>
          </div>

          <div
            className={`hidden items-center gap-2 rounded-full border p-1.5 backdrop-blur-xl md:flex transition-all duration-500 delay-100 ${theme.navBubbleClass} ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            {tabs.map((tab) => (
              <NavLink
                key={tab.label}
                to={withVersionPath(version, tab.path)}
                className={({ isActive }) =>
                  `group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 ${
                    isActive
                      ? theme.navActiveClass
                      : theme.navInactiveClass
                  }`
                }
              >
                {tab.label}
                {tab.badge && (
                  <span className="flex h-4 min-w-[14px] items-center justify-center rounded-[3px] bg-black px-1 text-[9px] font-bold text-white animate-pulse-badge">
                    {tab.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div
            className={`flex items-center gap-4 transition-all duration-500 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <Link
              to={withVersionPath(version, '/services')}
              className="group hidden md:flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-white/90 transition-all duration-200 hover:text-white"
            >
              Let’s talk
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

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
        className={`fixed inset-0 z-40 bg-[#0a0a0a] transition-all duration-500 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={mobileOpen ? { background: theme.navGradient } : undefined}
      >
        <div
          ref={mobileLinksRef}
          className="flex flex-col items-center justify-center h-full gap-8 pt-16"
        >
          {[...tabs, { label: 'Let’s talk', path: '/services' }].map((link) => (
            <Link
              key={link.label}
              to={withVersionPath(version, link.path)}
              onClick={handleNavClick}
              className="mobile-link flex items-center gap-3 text-[32px] font-bold uppercase tracking-tight text-white opacity-0"
            >
              {link.label}
              {link.badge && (
                <span className="flex h-6 min-w-[24px] items-center justify-center rounded bg-white px-2 text-[12px] font-bold text-black">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
