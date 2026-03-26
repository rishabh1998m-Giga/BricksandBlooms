import TeamSection from '../sections/TeamSection';
import CTASection from '../sections/CTASection';
import type { VersionKey } from '../theme/versionThemes';

interface TeamPageProps {
  version: VersionKey;
}

const TeamPage = ({ version }: TeamPageProps) => {
  return (
    <>
      <div className="h-[96px]" />
      <TeamSection />
      <CTASection version={version} />
    </>
  );
};

export default TeamPage;
