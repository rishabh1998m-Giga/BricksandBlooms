/**
 * The small 5-petal line-art blossom reused across scroll moments as the
 * brand's "growth" motif — first introduced on the Vision interlude's
 * growing vine, reused wherever something should feel like it bloomed
 * into place rather than just appeared.
 */
export default function FlowerBud({
  color,
  scale = 1,
}: {
  color: string;
  scale?: number;
}) {
  return (
    <g style={{ color }} transform={scale !== 1 ? `scale(${scale})` : undefined}>
      {Array.from({ length: 5 }).map((_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-2.4}
          rx="1.5"
          ry="2.4"
          transform={`rotate(${i * 72})`}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
        />
      ))}
      <circle r="0.9" fill="currentColor" />
    </g>
  );
}
