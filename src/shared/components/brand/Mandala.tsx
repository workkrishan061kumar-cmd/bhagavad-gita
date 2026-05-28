import type React from 'react';

function mulberry32(seed: number) {
  return () => {
    // biome-ignore lint/suspicious/noAssignInExpressions: mulberry32 algorithm requires this
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type MandalaProps = {
  seed: number;
  size?: number;
  stroke?: string;
  className?: string;
  ariaHidden?: boolean;
};

export function Mandala({
  seed,
  size = 320,
  stroke = 'currentColor',
  className,
  ariaHidden = true,
}: MandalaProps) {
  const rng = mulberry32(seed * 9973 + 7);

  const petals = 6 + Math.floor(rng() * 7);
  const rings = 3 + Math.floor(rng() * 3);
  const rotation = Math.floor(rng() * 360);
  const innerStyle = Math.floor(rng() * 3);
  const accentEvery = 2 + Math.floor(rng() * 3);

  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.48;

  const petalRing = (radius: number, count: number, phase: number): string => {
    const out: string[] = [];
    const step = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const a = step * i + phase;
      const x1 = cx + Math.cos(a) * radius;
      const y1 = cy + Math.sin(a) * radius;
      const am = a + step / 2;
      const cpx = cx + Math.cos(am) * radius * 1.3;
      const cpy = cy + Math.sin(am) * radius * 1.3;
      const a3 = a + step;
      const x2 = cx + Math.cos(a3) * radius;
      const y2 = cy + Math.sin(a3) * radius;
      out.push(
        `M${x1.toFixed(2)},${y1.toFixed(2)} Q${cpx.toFixed(2)},${cpy.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`,
      );
    }
    return out.join(' ');
  };

  const centerMotif = (): string => {
    if (innerStyle === 0) return petalRing(size * 0.08, 8, 0);
    if (innerStyle === 1) {
      const points = 6;
      const r1 = size * 0.05;
      const r2 = size * 0.1;
      const parts: string[] = [];
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? r2 : r1;
        const a = (Math.PI / points) * i;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
      }
      return `${parts.join(' ')} Z`;
    }
    const parts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      const x = cx + Math.cos(a) * size * 0.08;
      const y = cy + Math.sin(a) * size * 0.08;
      parts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return `${parts.join(' ')} Z`;
  };

  const ringElements: React.ReactElement[] = [];
  for (let r = 1; r <= rings; r++) {
    const ringR = (maxR / rings) * r;
    const ringPetals = petals + (r - 1) * 2;
    const phase = ((Math.PI * 2) / ringPetals) * (r % 2 === 0 ? 0.5 : 0);
    ringElements.push(
      <path
        key={`p-${r}`}
        d={petalRing(ringR, ringPetals, phase)}
        fill="none"
        stroke={stroke}
        strokeWidth={1}
        strokeOpacity={0.45 + (rings - r) * 0.1}
      />,
      <circle
        key={`c-${r}`}
        cx={cx}
        cy={cy}
        r={ringR}
        fill="none"
        stroke={stroke}
        strokeWidth={0.5}
        strokeOpacity={0.2}
      />,
    );
  }

  const accents: React.ReactElement[] = [];
  for (let i = 0; i < petals; i += accentEvery) {
    const a = ((Math.PI * 2) / petals) * i;
    const x = cx + Math.cos(a) * maxR * 0.92;
    const y = cy + Math.sin(a) * maxR * 0.92;
    accents.push(<circle key={`acc-${i}`} cx={x} cy={y} r={1.5} fill={stroke} opacity={0.7} />);
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      role={ariaHidden ? undefined : 'img'}
      aria-hidden={ariaHidden}
      className={className}
      style={{ color: stroke }}
    >
      <g transform={`rotate(${rotation} ${cx} ${cy})`}>
        {ringElements}
        <path
          d={centerMotif()}
          fill="none"
          stroke={stroke}
          strokeWidth={1.2}
          strokeOpacity={0.85}
        />
        <circle cx={cx} cy={cy} r={size * 0.012} fill={stroke} opacity={0.9} />
        {accents}
      </g>
    </svg>
  );
}
