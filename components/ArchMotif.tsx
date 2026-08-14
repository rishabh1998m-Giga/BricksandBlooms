type ArchMotifProps = {
  className?: string;
  animate?: boolean;
  strands?: number;
};

/**
 * The nested-arch line reused across the site — traced from the arch in the
 * Brick & Blooms mark, which also appears as cut ironwork in the client's
 * real project photography.
 */
export default function ArchMotif({
  className,
  animate = false,
  strands = 3,
}: ArchMotifProps) {
  const paths = Array.from({ length: strands }, (_, i) => {
    const inset = 14 + i * 26;
    const riseInset = 70 + i * 8;
    const radius = 86 - i * 26;
    return `M${inset} 168 V${riseInset} A${radius} ${radius} 0 0 1 ${200 - inset} ${riseInset} V168`;
  });

  return (
    <svg
      viewBox="0 0 200 170"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth="1.4"
          className={animate ? "arch-draw" : undefined}
          style={animate ? { animationDelay: `${0.15 + i * 0.2}s` } : undefined}
        />
      ))}
    </svg>
  );
}
