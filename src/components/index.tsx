import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors, borderRadius, fontSizes, spacing } from '../theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'primary',
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.button,
        styles[size],
        styles[variant],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.bg} />
      ) : (
        <Text style={[styles.buttonText, styles[`${variant}Text`], textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

type ProgressBarProps = {
  progress: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({ progress, height = 8, color = colors.primary, style }: ProgressBarProps) {
  const width = `${Math.max(0, Math.min(100, progress))}%`;

  return (
    <View style={[styles.progressTrack, { height, borderRadius: height / 2 }, style]}>
      <View style={[styles.progressFill, { width, backgroundColor: color, borderRadius: height / 2 }]} />
    </View>
  );
}

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = status.replace(/_/g, ' ');
  const badgeColor =
    status === 'completed' || status === 'paid'
      ? colors.success
      : status === 'failed' || status === 'error'
        ? colors.error
        : status === 'warning'
          ? colors.warning
          : colors.secondary;

  return (
    <View style={[styles.badge, { borderColor: badgeColor }]}>
      <Text style={[styles.badgeText, { color: badgeColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
  },
  sm: {
    minHeight: 36,
    paddingHorizontal: spacing.md,
  },
  md: {
    minHeight: 44,
  },
  lg: {
    minHeight: 52,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryText: {
    color: colors.bg,
  },
  secondaryText: {
    color: colors.bg,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  progressTrack: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.border,
  },
  progressFill: {
    height: '100%',
  },
  badge: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});
