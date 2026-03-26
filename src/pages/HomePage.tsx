import { useRef } from 'react';
import { useScroll } from 'framer-motion';

import HeroSection from '../sections/HeroSection';
import WeCreateSection from '../sections/WeCreateSection';
import WorkSection from '../sections/WorkSection';
import StatsSection from '../sections/StatsSection';
import ServicesSection from '../sections/ServicesSection';
import ProcessSection from '../sections/ProcessSection';
import SatisfactionSection from '../sections/SatisfactionSection';
import PricingSection from '../sections/PricingSection';
import TeamSection from '../sections/TeamSection';
import FAQSection from '../sections/FAQSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import BlogSection from '../sections/BlogSection';
import CTASection from '../sections/CTASection';
import type { VersionKey } from '../theme/versionThemes';

interface HomePageProps {
  version: VersionKey;
}

const HomePage = ({ version }: HomePageProps) => {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  return (
    <>
      <HeroSection heroRef={heroRef} scrollYProgress={scrollYProgress} version={version} />
      <WeCreateSection />
      <WorkSection />
      <StatsSection />
      <ServicesSection version={version} />
      <ProcessSection version={version} />
      <SatisfactionSection />
      <PricingSection />
      <TeamSection />
      <FAQSection />
      <TestimonialsSection />
      <BlogSection />
      <CTASection version={version} />
    </>
  );
};

export default HomePage;
