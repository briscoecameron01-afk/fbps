/**
 * Typography system for Fractional Bill Pay
 * Includes font sizes, weights, and line heights
 */

export const typography = {
  // Heading styles
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: 0,
  },

  // Body styles
  bodyLarge: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: 0.4,
  },

  // Caption style
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },

  // Overline style
  overline: {
    fontSize: 10,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypographyKey = keyof typeof typography;
