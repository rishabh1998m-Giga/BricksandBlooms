import ServicesSection from '../sections/ServicesSection';
import ProcessSection from '../sections/ProcessSection';
import CTASection from '../sections/CTASection';
import type { VersionKey } from '../theme/versionThemes';

interface ServicesPageProps {
  version: VersionKey;
}

const ServicesPage = ({ version }: ServicesPageProps) => {
  return (
    <>
      <div className="h-[96px]" />
      <ServicesSection version={version} />
      <ProcessSection version={version} />
      <CTASection version={version} />
    </>
  );
};

export default ServicesPage;
