import { Outlet } from 'react-router-dom';

import CustomCursor from './CustomCursor';
import Navigation from './Navigation';
import Footer from '../sections/Footer';
import { VERSION_THEMES, type VersionKey } from '../theme/versionThemes';

interface SiteLayoutProps {
  version: VersionKey;
}

const SiteLayout = ({ version }: SiteLayoutProps) => {
  const theme = VERSION_THEMES[version];
  const isMain = version === 'main';

  return (
    <main
      className={`relative min-h-screen w-full overflow-x-hidden ${theme.fontClass} ${isMain ? '' : 'version-shell'}`}
      data-version={version}
      style={{ background: theme.shellGradient }}
    >
      {!isMain && (
        <div
          className="pointer-events-none fixed inset-0 z-0"
          aria-hidden
          style={{ background: theme.sectionOverlay }}
        />
      )}
      <CustomCursor />
      <Navigation version={version} />
      <div className="relative z-[1]">
        <Outlet />
      </div>
      <Footer version={version} />
    </main>
  );
};

export default SiteLayout;
