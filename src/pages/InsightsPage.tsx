import BlogSection from '../sections/BlogSection';
import CTASection from '../sections/CTASection';
import type { VersionKey } from '../theme/versionThemes';

interface InsightsPageProps {
  version: VersionKey;
}

const InsightsPage = ({ version }: InsightsPageProps) => {
  return (
    <>
      <div className="h-[96px]" />
      <BlogSection />
      <CTASection version={version} />
    </>
  );
};

export default InsightsPage;
