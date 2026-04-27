/**
 * Dark fintech-inspired color palette for Fractional Bill Pay
 */

export const colors = {
  // Background colors
  bg: '#0A1628',
  bgLight: '#0E1F38',
  bgCard: '#111E33',
  bgCardLight: '#162A46',
  bgInput: '#0F1D32',

  // Primary brand colors
  primary: '#00D998',
  primaryDark: '#00C48B',

  // Secondary colors
  secondary: '#00B4D8',

  // Text colors
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Border colors
  border: '#1C2E4A',
  borderLight: '#243B5C',

  // Status colors
  error: '#FF4757',
  warning: '#FFC107',
  success: '#00D998',

  // Accent colors
  gold: '#FFB800',

  // Tab navigation colors
  tabActive: '#00D998',
  tabInactive: '#64748B',
  tabBarBg: '#0A1628',

  // Overlay
  overlay: 'rgba(0,0,0,0.6)',
} as const;

export type ColorKey = keyof typeof colors;
