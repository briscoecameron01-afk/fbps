import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import { Button } from '../components';
import { useStore } from '../hooks/useStore';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    emoji: '💰',
    title: 'Break bills into\nbite-sized payments',
    subtitle: 'Turn overwhelming monthly bills into small daily, weekly, or biweekly micro-contributions.',
    color: colors.teal,
  },
  {
    emoji: '🎯',
    title: 'Choose your\nown rhythm',
    subtitle: 'Align contributions with your pay schedule. Daily, weekly, or biweekly — whatever works for you.',
    color: colors.gold,
  },
  {
    emoji: '✨',
    title: 'Never miss\na payment',
    subtitle: 'When bills come due, the money is already there. No overdrafts, no late fees, no stress.',
    color: colors.coral,
  },
];

export function OnboardingScreen() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { completeOnboarding } = useStore();

  const slide = SLIDES[activeSlide];
  const isLast = activeSlide === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
    } else {
      setActiveSlide(activeSlide + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top section */}
      <View style={styles.top}>
        <View style={[styles.emojiCircle, { backgroundColor: slide.color + '20' }]}>
          <Text style={styles.emoji}>{slide.emoji}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeSlide ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={isLast ? 'Get Started' : 'Next'}
          onPress={handleNext}
          size="lg"
          style={{ width: '100%' }}
        />
        {!isLast && (
          <TouchableOpacity onPress={completeOnboarding} style={styles.skipBtn}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
    paddingHorizontal: spacing['2xl'],
    paddingTop: 80,
    paddingBottom: 40,
  },
  top: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
  },
  emojiCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 56,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
    marginBottom: spacing.lg,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    color: colors.light,
    lineHeight: 26,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing['3xl'],
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 32,
    backgroundColor: colors.teal,
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  actions: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  skipBtn: {
    padding: spacing.sm,
  },
  skipText: {
    color: colors.light,
    fontSize: fontSizes.md,
  },
});
