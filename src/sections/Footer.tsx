import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

const Footer = () => {
  const circleRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (circleRef.current) {
      gsap.to(circleRef.current, {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: 'none',
      });
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'HOME', href: '#' },
    { label: 'PROJECTS', href: '#work' },
    { label: 'SERVICES', href: '#studio' },
    { label: 'INSIGHTS', href: '#whispers' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const legalLinks = [
    { label: 'TERMS OF SERVICE', href: '#' },
    { label: 'PRIVACY POLICY', href: '#' },
    { label: 'DISCLAIMER', href: '#' },
    { label: '404', href: '#' },
    { label: 'MORE TEMPLATES', href: '#' },
  ];

  const socialLinks = [
    { label: 'X', href: 'https://x.com' },
    { label: 'Li', href: 'https://linkedin.com' },
    { label: 'IG', href: 'https://instagram.com' },
    { label: 'FB', href: 'https://facebook.com' },
    { label: 'WA', href: 'https://whatsapp.com' },
  ];

  return (
    <footer className="relative w-full bg-white">
      {/* Newsletter Section */}
      <div className="border-t border-black/10 py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-[24px] md:text-[32px] font-medium tracking-tight text-black mb-2">
                Keep you in the loop.
              </h3>
              <p className="text-[13px] text-black/50">
                Get the latest news, insights directly to your inbox. *
              </p>
            </div>
            <div>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-lg border border-black/15 bg-transparent px-4 py-3 text-[13px] text-black placeholder:text-black/30 outline-none focus:border-coral transition-colors"
                />
                <button
                  type="submit"
                  className="group flex items-center gap-2 rounded-lg bg-coral px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-coral-hover shrink-0"
                >
                  JOIN OUR NEWSLETTER
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
              <p className="mt-3 text-[10px] text-black/30">
                By submitting, you agree to our Terms & Service.
              </p>
              <p className="text-[10px] text-black/30">
                * No spam, just awesome updates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation + Links */}
      <div className="border-t border-black/10 py-12">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Navigate */}
            <div>
              <h4 className="mb-4 text-[11px] font-semibold text-black/40">Navigate</h4>
              <div className="space-y-2.5">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-black/70 transition-colors hover:text-coral"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="mb-4 text-[11px] font-semibold text-black/40">Links</h4>
              <div className="space-y-2.5">
                {legalLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-black/70 transition-colors hover:text-coral"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Follow */}
            <div>
              <h4 className="mb-4 text-[11px] font-semibold text-black/40">Follow us on socials</h4>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-semibold text-coral transition-colors hover:text-coral-hover"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Tagline */}
            <div>
              <p className="text-[12px] leading-relaxed text-black/40">
                Landscape design, terrace gardens, and outdoor transformations that bring nature closer to you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="border-t border-black/10 py-16">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-10 md:flex-row">
            {/* Left: Dotted Circle Animation */}
            <div className="relative flex h-[140px] w-[140px] items-center justify-center md:h-[180px] md:w-[180px]">
              <div
                ref={circleRef}
                className="absolute inset-0"
                style={{
                  background: `repeating-conic-gradient(from 0deg, #FF6B4A 0deg 2deg, transparent 2deg 8deg)`,
                  borderRadius: '50%',
                  maskImage: 'radial-gradient(circle, transparent 55%, black 56%)',
                  WebkitMaskImage: 'radial-gradient(circle, transparent 55%, black 56%)',
                }}
              />
              <button
                onClick={scrollToTop}
                className="group relative flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#0a0a0a] transition-transform duration-300 hover:scale-105 md:h-[120px] md:w-[120px]"
                aria-label="Back to top"
              >
                <ArrowUp className="h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-y-1" />
              </button>
            </div>

            {/* Center: Large Logo */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <span className="text-[32px] md:text-[44px] lg:text-[56px] font-bold tracking-tight text-coral">
                  Brick &amp; Blooms
                </span>
              </div>
              <p className="mt-2 text-[12px] text-black/40">
                A landscape design studio for terraces, balconies, and outdoor spaces that grow with you.
              </p>
            </div>

            {/* Right: Phone & Socials */}
            <div className="flex flex-col items-center gap-4 md:items-end">
              <a
                href="tel:+911234567890"
                className="text-[18px] font-semibold text-black/70 transition-colors hover:text-coral"
              >
                +91 12345 67890
              </a>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-semibold text-coral transition-colors hover:text-coral-hover"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/10 py-6">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-black/30">© 2026 Brick &amp; Blooms — All gardens, all rights.</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <span className="text-[11px] text-black/30">Brick &amp; Blooms — Landscape Design Studio</span>
            </div>

            <div className="text-[10px] text-black/25">
              <p><strong>Brick &amp; Blooms</strong></p>
              <p>Terrace &amp; Landscape Studio</p>
              <p>Based in India</p>
            </div>

            <div className="text-[10px] text-black/25">
              <p>hello@brickandblooms.in</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
