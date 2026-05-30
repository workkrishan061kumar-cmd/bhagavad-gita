type Props = {
  days: number;
  size?: number;
  className?: string;
};

/**
 * Diya / candle-flame SVG that intensifies with milestone streaks.
 *  - days 0  → dim outline only
 *  - days 1–2 → small steady flame
 *  - days 3–6 → fuller saffron flame
 *  - days 7+  → tall flame with gold core
 *  - days 18+ → double-glow (mahabharata 18-day arc)
 */
export function StreakFlame({ days, size = 28, className }: Props) {
  const lit = days > 0;
  const big = days >= 7;
  const epic = days >= 18;
  const flameHeight = days === 0 ? 0 : Math.min(14, 6 + Math.floor(days / 3));
  const outerOpacity = epic ? 0.9 : big ? 0.7 : lit ? 0.5 : 0.2;

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true">
      <title>{`${days}-day streak`}</title>
      {/* Diya base */}
      <path d="M8 24 Q16 28 24 24 L22 22 Q16 24 10 22 Z" fill="currentColor" opacity="0.6" />
      {/* Outer flame */}
      {lit ? (
        <path
          d={`M16 22 Q22 ${22 - flameHeight} 16 ${22 - flameHeight - 4} Q10 ${22 - flameHeight} 16 22 Z`}
          fill="#F5853F"
          opacity={outerOpacity}
        />
      ) : null}
      {/* Inner flame (gold core, appears at 3+ days) */}
      {days >= 3 ? (
        <path
          d={`M16 22 Q19 ${22 - Math.floor(flameHeight * 0.7)} 16 ${22 - flameHeight - 1} Q13 ${22 - Math.floor(flameHeight * 0.7)} 16 22 Z`}
          fill="#D4A24C"
        />
      ) : null}
      {/* Bright core spark (7+ days) */}
      {big ? (
        <circle cx="16" cy={22 - Math.floor(flameHeight * 0.55)} r="1.5" fill="#F9F1E0" />
      ) : null}
    </svg>
  );
}
