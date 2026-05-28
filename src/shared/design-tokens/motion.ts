export const space = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '20px',
  '2xl': '28px',
  full: '9999px',
} as const;

export const shadow = {
  soft: '0 4px 24px -8px rgba(0,0,0,0.4)',
  goldGlow: '0 0 32px -4px rgba(201,168,76,0.25)',
  ember: '0 0 40px -8px rgba(249,115,22,0.35)',
} as const;

export const motion = {
  easing: {
    candle: [0.22, 0.61, 0.36, 1] as const,
    drift: [0.45, 0, 0.55, 1] as const,
    inscribe: [0.65, 0, 0.35, 1] as const,
  },
  duration: {
    instant: 80,
    fast: 180,
    normal: 320,
    slow: 600,
    candle: 900,
    mandala: 1400,
  },
} as const;
