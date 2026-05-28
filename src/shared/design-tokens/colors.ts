export const colors = {
  bg: {
    base: '#0B0F1A',
    surface: '#111827',
    elevated: '#1A2236',
    overlay: '#0B0F1ACC',
  },
  gold: {
    900: '#7A6428',
    700: '#A88838',
    500: '#C9A84C',
    300: '#E8D183',
    100: '#FBF3D6',
  },
  saffron: {
    700: '#C2520B',
    500: '#F97316',
    300: '#FCA864',
  },
  text: {
    primary: '#F5F0E8',
    secondary: '#D9D2C5',
    muted: '#A89F91',
    disabled: '#6B6358',
    sanskrit: '#E8D183',
  },
  success: '#7FB069',
  warning: '#E8A33D',
  danger: '#D96C56',
  info: '#7DA9CC',
  mood: {
    anxious: '#6B89B5',
    grateful: '#D4A24C',
    confused: '#A88FB8',
    motivated: '#E89A4D',
    grieving: '#7B7B8C',
    angry: '#C4623E',
    peaceful: '#8FB89E',
    lost: '#9B8270',
  },
} as const;

export type MoodKey = keyof typeof colors.mood;
