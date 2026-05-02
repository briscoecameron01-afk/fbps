/**
 * Theme system for Fractional Bill Pay
 * Centralized export of all theme-related values
 */

export { colors, type ColorKey } from './colors';
export { typography, type TypographyKey } from './typography';
export { spacing, borderRadius, screenPadding, type SpacingKey, type BorderRadiusKey } from './spacing';

// Re-export as unified theme object for convenience
export { colors as themeColors } from './colors';
export { typography as themeTypography } from './typography';
export { spacing as themeSpacing, borderRadius as themeBorderRadius, screenPadding as themeScreenPadding } from './spacing';

// Flat font size exports for convenience
export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 14,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
} as const;

// Flat font weight exports for convenience
export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;
