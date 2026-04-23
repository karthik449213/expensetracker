/**
 * Hacker Terminal Theme Colors
 * A futuristic, neon-inspired color palette for the Expense Tracker app
 */

export const HackerTheme = {
  colors: {
    // Core Colors
    background: '#000000',
    surface: '#0a0a0a',
    surfaceLight: '#1a1a1a',
    
    // Primary - Bright cyan green
    primary: '#00FF9C',
    primaryLight: '#00FF9C99',
    primaryDark: '#00AA63',
    
    // Secondary - Cyan blue
    secondary: '#00C3FF',
    secondaryLight: '#00C3FF99',
    secondaryDark: '#0099CC',
    
    // Accent - Cyan for highlights
    accent: '#00FFFF',
    
    // Danger - Red for destructive actions
    danger: '#FF3B3B',
    dangerLight: '#FF6B6B',
    dangerDark: '#CC2D2D',
    
    // Warning - Orange
    warning: '#FFB800',
    warningLight: '#FFD400',
    warningDark: '#CC9200',
    
    // Success - Green
    success: '#00FF9C',
    successLight: '#00FFB3',
    successDark: '#00CC7A',
    
    // Text Colors
    text: '#E0FFE0',
    textSecondary: '#00FF9C',
    textTertiary: '#888888',
    textMuted: '#444444',
    
    // Border
    border: '#00FF9C33',
    borderLight: '#00FF9C1A',
    
    // Glow effects
    glow: '#00FF9C',
    glowSecondary: '#00C3FF',
  },

  // Category colors for expense breakdown
  categoryColors: {
    Food: '#FF6B9D',
    Transportation: '#00C9FF',
    Entertainment: '#9D84B7',
    Shopping: '#FF6B9D',
    Utilities: '#FFB84D',
    Healthcare: '#FF6B6B',
    Education: '#6BCB77',
    Other: '#4D96FF',
  },

  // Opacity levels for layering
  opacity: {
    none: 0,
    minimal: 0.1,
    light: 0.2,
    medium: 0.5,
    semi: 0.7,
    opaque: 1,
  },

  // Shadow effects (glow)
  shadows: {
    small: '0 0 8px rgba(0, 255, 156, 0.3)',
    medium: '0 0 16px rgba(0, 255, 156, 0.5)',
    large: '0 0 24px rgba(0, 255, 156, 0.7)',
    xl: '0 0 32px rgba(0, 255, 156, 0.9)',
    danger: '0 0 16px rgba(255, 59, 59, 0.6)',
    secondary: '0 0 16px rgba(0, 195, 255, 0.5)',
  },

  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
    '7xl': 40,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
    loose: 2,
  },

  // Border radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 999,
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
  },
};

export type ThemeType = typeof HackerTheme;
