import { createContext, useContext } from 'react'

// Theme Configuration
export const themes = {
  dark: {
    background: 'hsl(222.2, 84%, 4.9%)',
    foreground: 'hsl(210, 40%, 98%)',
    primary: 'hsl(217.2, 91.2%, 59.8%)',
    secondary: 'hsl(217.2, 32.6%, 17.5%)',
    accent: 'hsl(217.2, 32.6%, 17.5%)',
    muted: 'hsl(217.2, 32.6%, 17.5%)',
    destructive: 'hsl(0, 62.8%, 30.6%)',
    border: 'hsl(217.2, 32.6%, 17.5%)',
    input: 'hsl(217.2, 32.6%, 17.5%)',
    ring: 'hsl(224.3, 76.3%, 94.1%)',
    card: 'hsl(222.2, 84%, 4.9%)',
    cardForeground: 'hsl(210, 40%, 98%)',
    popover: 'hsl(222.2, 84%, 4.9%)',
    popoverForeground: 'hsl(210, 40%, 98%)',
    mutedForeground: 'hsl(215, 20.2%, 65.1%)',
    accentForeground: 'hsl(210, 40%, 98%)',
    destructiveForeground: 'hsl(210, 40%, 98%)',
    primaryForeground: 'hsl(222.2, 84%, 4.9%)',
    secondaryForeground: 'hsl(210, 40%, 98%)'
  },
  light: {
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(222.2, 84%, 4.9%)',
    primary: 'hsl(221.2, 83.2%, 53.3%)',
    secondary: 'hsl(210, 40%, 96%)',
    accent: 'hsl(210, 40%, 96%)',
    muted: 'hsl(210, 40%, 96%)',
    destructive: 'hsl(0, 84.2%, 60.2%)',
    border: 'hsl(214.3, 31.8%, 91.4%)',
    input: 'hsl(214.3, 31.8%, 91.4%)',
    ring: 'hsl(221.2, 83.2%, 53.3%)',
    card: 'hsl(0, 0%, 100%)',
    cardForeground: 'hsl(222.2, 84%, 4.9%)',
    popover: 'hsl(0, 0%, 100%)',
    popoverForeground: 'hsl(222.2, 84%, 4.9%)',
    mutedForeground: 'hsl(215.4, 16.3%, 46.9%)',
    accentForeground: 'hsl(222.2, 84%, 4.9%)',
    destructiveForeground: 'hsl(210, 40%, 98%)',
    primaryForeground: 'hsl(210, 40%, 98%)',
    secondaryForeground: 'hsl(222.2, 84%, 4.9%)'
  },
  neon: {
    background: 'hsl(240, 10%, 5%)',
    foreground: 'hsl(0, 100%, 85%)',
    primary: 'hsl(280, 100%, 60%)',
    secondary: 'hsl(180, 100%, 50%)',
    accent: 'hsl(320, 100%, 60%)',
    muted: 'hsl(240, 10%, 15%)',
    destructive: 'hsl(0, 100%, 50%)',
    border: 'hsl(280, 100%, 30%)',
    input: 'hsl(240, 10%, 15%)',
    ring: 'hsl(280, 100%, 60%)',
    card: 'hsl(240, 10%, 8%)',
    cardForeground: 'hsl(0, 100%, 85%)',
    popover: 'hsl(240, 10%, 8%)',
    popoverForeground: 'hsl(0, 100%, 85%)',
    mutedForeground: 'hsl(0, 100%, 60%)',
    accentForeground: 'hsl(0, 100%, 90%)',
    destructiveForeground: 'hsl(0, 100%, 90%)',
    primaryForeground: 'hsl(240, 10%, 5%)',
    secondaryForeground: 'hsl(240, 10%, 5%)'
  },
  pastel: {
    background: 'hsl(30, 30%, 98%)',
    foreground: 'hsl(240, 20%, 20%)',
    primary: 'hsl(340, 70%, 70%)',
    secondary: 'hsl(200, 60%, 75%)',
    accent: 'hsl(60, 50%, 75%)',
    muted: 'hsl(30, 20%, 92%)',
    destructive: 'hsl(0, 60%, 65%)',
    border: 'hsl(30, 30%, 85%)',
    input: 'hsl(30, 20%, 92%)',
    ring: 'hsl(340, 70%, 70%)',
    card: 'hsl(30, 30%, 95%)',
    cardForeground: 'hsl(240, 20%, 20%)',
    popover: 'hsl(30, 30%, 95%)',
    popoverForeground: 'hsl(240, 20%, 20%)',
    mutedForeground: 'hsl(240, 10%, 50%)',
    accentForeground: 'hsl(240, 20%, 20%)',
    destructiveForeground: 'hsl(30, 30%, 98%)',
    primaryForeground: 'hsl(30, 30%, 98%)',
    secondaryForeground: 'hsl(240, 20%, 20%)'
  },
  cyberpunk: {
    background: 'hsl(280, 20%, 5%)',
    foreground: 'hsl(120, 100%, 80%)',
    primary: 'hsl(120, 100%, 50%)',
    secondary: 'hsl(280, 100%, 60%)',
    accent: 'hsl(60, 100%, 50%)',
    muted: 'hsl(280, 20%, 10%)',
    destructive: 'hsl(0, 100%, 60%)',
    border: 'hsl(120, 100%, 30%)',
    input: 'hsl(280, 20%, 10%)',
    ring: 'hsl(120, 100%, 50%)',
    card: 'hsl(280, 20%, 8%)',
    cardForeground: 'hsl(120, 100%, 80%)',
    popover: 'hsl(280, 20%, 8%)',
    popoverForeground: 'hsl(120, 100%, 80%)',
    mutedForeground: 'hsl(120, 100%, 40%)',
    accentForeground: 'hsl(280, 20%, 5%)',
    destructiveForeground: 'hsl(280, 20%, 5%)',
    primaryForeground: 'hsl(280, 20%, 5%)',
    secondaryForeground: 'hsl(280, 20%, 5%)'
  }
} as const

export type Theme = keyof typeof themes

// Semantic Colors
export const semanticColors = {
  success: 'hsl(142, 76%, 36%)',
  warning: 'hsl(38, 92%, 50%)',
  error: 'hsl(0, 84%, 60%)',
  info: 'hsl(221, 83%, 53%)'
} as const

// Typography System
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace']
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }]
  },
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
} as const

// Spacing System
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
  // Custom tokens
  sectionGap: '5rem',
  cardPadding: '1.5rem',
  buttonPadding: '0.75rem 1.5rem'
} as const

// Animation Variants
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  },
  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 }
  },
  slideLeft: {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 }
  },
  slideRight: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 }
  },
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 }
  },
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  },
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }
} as const

// Component Variants
export const componentVariants = {
  button: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  },
  card: {
    flat: 'bg-card text-card-foreground',
    elevated: 'bg-card text-card-foreground shadow-lg',
    bordered: 'bg-card text-card-foreground border',
    glass: 'bg-card/80 text-card-foreground backdrop-blur-sm border'
  },
  input: {
    default: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  }
} as const

// Responsive Breakpoints
export const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
} as const

export const containerMaxWidths = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
} as const

// Shadows & Effects
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  glow: '0 0 20px rgb(59 130 246 / 0.5)',
  neon: '0 0 20px rgb(168 85 247 / 0.8), 0 0 40px rgb(168 85 247 / 0.4)'
} as const

export const effects = {
  glassMorphism: 'backdrop-blur-md bg-white/10 border border-white/20',
  gradientText: 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'
} as const

// Accessibility
export const accessibility = {
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  reducedMotion: 'motion-reduce:transition-none motion-reduce:animate-none',
  highContrast: 'contrast-more:border-contrast-more contrast-more:current'
} as const

// Context
export const DesignSystemContext = createContext<{
  theme: Theme
  colors: typeof themes.dark
}>({
  theme: 'dark',
  colors: themes.dark
})

export const useDesignSystem = () => {
  const context = useContext(DesignSystemContext)
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider')
  }
  return context
}

// Utility Functions
export const getThemeColors = (theme: Theme) => themes[theme]

export const getResponsiveValue = <T>(values: Partial<Record<keyof typeof breakpoints, T>>) => {
  return values
}

export const getAnimationDuration = (variant: keyof typeof animationVariants) => {
  const durations = {
    fadeIn: 0.5,
    slideUp: 0.5,
    slideDown: 0.5,
    slideLeft: 0.5,
    slideRight: 0.5,
    scaleIn: 0.3,
    pageTransition: 0.3
  }
  return durations[variant as keyof typeof durations] || 0.3
}
