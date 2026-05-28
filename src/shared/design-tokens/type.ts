export const type = {
  family: {
    sanskrit: '"Tiro Devanagari Sanskrit", "Tiro Devanagari Hindi", serif',
    display: '"Playfair Display", Georgia, serif',
    body: '"Inter", -apple-system, system-ui, sans-serif',
    mono: '"JetBrains Mono", Consolas, monospace',
  },
  size: {
    sanskrit: { sm: '22px', lg: '32px', xl: '44px' },
    display: {
      h1: { sm: '32px', lg: '48px' },
      h2: { sm: '26px', lg: '36px' },
      h3: { sm: '20px', lg: '24px' },
    },
    body: { xs: '12px', sm: '14px', md: '16px', lg: '18px' },
  },
  leading: {
    sanskrit: 1.7,
    display: 1.2,
    body: 1.65,
  },
  tracking: {
    sanskrit: '0.01em',
    display: '-0.02em',
    body: '0em',
    label: '0.06em',
  },
} as const;
