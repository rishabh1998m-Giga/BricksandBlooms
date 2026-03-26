export type VersionKey = 'main' | 'v1' | 'v2' | 'v3' | 'v4' | 'v5';

export interface VersionTheme {
  key: VersionKey;
  shellGradient: string;
  navGradient: string;
  heroGlow: string;
  sectionOverlay: string;
  fontClass: string;
  navBubbleClass: string;
  navActiveClass: string;
  navInactiveClass: string;
  serviceGradients: string[];
}

const orangeServiceGradients = [
  'from-orange-500 to-orange-700',
  'from-amber-500 to-orange-600',
  'from-orange-400 to-amber-600',
  'from-orange-600 to-red-700',
  'from-amber-400 to-orange-500',
  'from-orange-700 to-amber-700',
];

export const VERSION_THEMES: Record<VersionKey, VersionTheme> = {
  main: {
    key: 'main',
    shellGradient: 'linear-gradient(180deg, #0a0a0a 0%, #0a0a0a 100%)',
    navGradient: 'linear-gradient(135deg, rgba(10, 10, 10, 0.9), rgba(16, 16, 16, 0.88))',
    heroGlow: 'radial-gradient(circle, rgba(108, 130, 255, 0.2), rgba(108, 130, 255, 0))',
    sectionOverlay: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)',
    fontClass: 'font-main',
    navBubbleClass: 'border-white/30 bg-white/15',
    navActiveClass: 'bg-white text-black shadow-[0_6px_20px_rgba(0,0,0,0.2)]',
    navInactiveClass: 'text-white/85 hover:bg-white/20 hover:text-white',
    serviceGradients: orangeServiceGradients,
  },
  v1: {
    key: 'v1',
    shellGradient: 'linear-gradient(160deg, #FF6A00 0%, #FFB347 100%)',
    navGradient: 'linear-gradient(135deg, #FF6A00 0%, #FFB347 100%)',
    heroGlow: 'radial-gradient(circle, rgba(255, 106, 0, 0.38), rgba(255, 179, 71, 0))',
    sectionOverlay: 'linear-gradient(180deg, rgba(32, 12, 0, 0.24), rgba(32, 12, 0, 0.18))',
    fontClass: 'font-v1',
    navBubbleClass: 'border-white/45 bg-white/18',
    navActiveClass: 'bg-white text-[#1b1b1b] shadow-[0_8px_24px_rgba(0,0,0,0.22)]',
    navInactiveClass: 'text-white/95 hover:bg-white/25 hover:text-white',
    serviceGradients: orangeServiceGradients,
  },
  v2: {
    key: 'v2',
    shellGradient: 'linear-gradient(165deg, #E65100 0%, #FF7043 56%, #FFD54F 100%)',
    navGradient: 'linear-gradient(135deg, #E65100 0%, #FF7043 55%, #FFD54F 100%)',
    heroGlow: 'radial-gradient(circle, rgba(255, 112, 67, 0.34), rgba(255, 213, 79, 0))',
    sectionOverlay: 'linear-gradient(180deg, rgba(36, 10, 0, 0.28), rgba(36, 10, 0, 0.2))',
    fontClass: 'font-v2',
    navBubbleClass: 'border-white/35 bg-[#fff2ea]/20',
    navActiveClass: 'bg-gradient-to-r from-[#ffe6da] to-[#ffd4b6] text-[#3b271f] shadow-[0_8px_24px_rgba(0,0,0,0.2)]',
    navInactiveClass: 'text-[#2e2018] hover:bg-white/25 hover:text-[#20150f]',
    serviceGradients: orangeServiceGradients,
  },
  v3: {
    key: 'v3',
    shellGradient: 'linear-gradient(160deg, #FFE0B2 0%, #FFF8F0 100%)',
    navGradient: 'linear-gradient(135deg, #FFE0B2 0%, #FFF8F0 100%)',
    heroGlow: 'radial-gradient(circle, rgba(255, 176, 92, 0.28), rgba(255, 248, 240, 0))',
    sectionOverlay: 'linear-gradient(180deg, rgba(150, 85, 20, 0.08), rgba(150, 85, 20, 0.06))',
    fontClass: 'font-v3',
    navBubbleClass: 'border-[#f1cda0]/80 bg-white/80',
    navActiveClass: 'border border-[#f0a85f] bg-white text-[#634631] shadow-[0_4px_16px_rgba(168,95,32,0.16)]',
    navInactiveClass: 'text-[#7c6047] hover:bg-white hover:text-[#5a422f]',
    serviceGradients: orangeServiceGradients,
  },
  v4: {
    key: 'v4',
    shellGradient: 'linear-gradient(165deg, #A54300 0%, #D8741F 50%, #F1BA73 100%)',
    navGradient: 'linear-gradient(135deg, #FF8A3D 0%, #FFD39C 100%)',
    heroGlow: 'radial-gradient(circle, rgba(255, 138, 61, 0.32), rgba(255, 211, 156, 0))',
    sectionOverlay: 'linear-gradient(180deg, rgba(46, 15, 0, 0.28), rgba(46, 15, 0, 0.18))',
    fontClass: 'font-v4',
    navBubbleClass: 'border-white/30 bg-[#fff0dc]/18',
    navActiveClass: 'bg-[#ffe4c3] text-[#3f2817] shadow-[0_8px_24px_rgba(0,0,0,0.2)]',
    navInactiveClass: 'text-[#2f1f15] hover:bg-white/30 hover:text-[#20120a]',
    serviceGradients: orangeServiceGradients,
  },
  v5: {
    key: 'v5',
    shellGradient: 'linear-gradient(165deg, #7C2F00 0%, #BC5C1F 45%, #E89F4E 75%, #FFD49A 100%)',
    navGradient: 'linear-gradient(135deg, #FF7A1A 0%, #FFC270 100%)',
    heroGlow: 'radial-gradient(circle, rgba(255, 122, 26, 0.32), rgba(255, 194, 112, 0))',
    sectionOverlay: 'linear-gradient(180deg, rgba(32, 9, 0, 0.3), rgba(32, 9, 0, 0.2))',
    fontClass: 'font-v5',
    navBubbleClass: 'border-[#ffe0b7]/40 bg-[#ffedd2]/14',
    navActiveClass: 'bg-[#ffe0ba] text-[#402714] shadow-[0_8px_24px_rgba(0,0,0,0.2)]',
    navInactiveClass: 'text-[#f7e7d7] hover:bg-white/25 hover:text-white',
    serviceGradients: orangeServiceGradients,
  },
};

export const getVersionBasePath = (version: VersionKey) => (version === 'main' ? '' : `/${version}`);

export const withVersionPath = (version: VersionKey, path: string) => {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${getVersionBasePath(version)}${clean}`;
};
