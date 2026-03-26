import WorkSection from '../sections/WorkSection';
import CTASection from '../sections/CTASection';
import type { VersionKey } from '../theme/versionThemes';

interface ProjectsPageProps {
  version: VersionKey;
}

const ProjectsPage = ({ version }: ProjectsPageProps) => {
  return (
    <>
      <div className="h-[96px]" />
      <WorkSection />
      <CTASection version={version} />
    </>
  );
};

export default ProjectsPage;
