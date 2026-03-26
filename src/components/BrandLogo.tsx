import logo from '../../LOGO.png';

interface BrandLogoProps {
  className?: string;
  alt?: string;
}

const BrandLogo = ({ className = '', alt = 'Brick and Blooms logo' }: BrandLogoProps) => {
  return (
    <img
      src={logo}
      alt={alt}
      className={`h-auto w-auto max-w-full object-contain bg-transparent ${className}`.trim()}
      loading="eager"
      decoding="async"
    />
  );
};

export default BrandLogo;
