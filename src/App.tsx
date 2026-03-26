import { useEffect, useRef } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SiteLayout from './components/SiteLayout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';
import InsightsPage from './pages/InsightsPage';
import TeamPage from './pages/TeamPage';
import type { VersionKey } from './theme/versionThemes';

import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    });

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<SiteLayout version="main" />}>
        <Route index element={<HomePage version="main" />} />
        <Route path="projects" element={<ProjectsPage version="main" />} />
        <Route path="services" element={<ServicesPage version="main" />} />
        <Route path="insights" element={<InsightsPage version="main" />} />
        <Route path="team" element={<TeamPage version="main" />} />
      </Route>

      {(['v1', 'v2', 'v3', 'v4', 'v5'] as VersionKey[]).map((version) => (
        <Route key={version} path={`/${version}`} element={<SiteLayout version={version} />}>
          <Route index element={<HomePage version={version} />} />
          <Route path="projects" element={<ProjectsPage version={version} />} />
          <Route path="services" element={<ServicesPage version={version} />} />
          <Route path="insights" element={<InsightsPage version={version} />} />
          <Route path="team" element={<TeamPage version={version} />} />
        </Route>
      ))}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
