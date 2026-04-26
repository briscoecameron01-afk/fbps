import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';

export function OTPScreen({ navigation }: { navigation: any }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      // TODO: Implement OTP verification
      navigation.navigate('Success');
    }
  };

  const handleResend = () => {
    // TODO: Implement resend OTP
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Enter OTP Code</Text>
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          Enter the 6-digit code sent to your email
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
              ]}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace(index);
                }
              }}
              placeholder="-"
              placeholderTextColor={colors.textMuted}
            />
          ))}
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {timer > 0 ? `Expires in ${timer}s` : 'Code expired'}
          </Text>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            otp.join('').length !== 6 && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerify}
          disabled={otp.join('').length !== 6}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>

        {/* Resend Link */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive a code? </Text>
          <TouchableOpacity
            disabled={timer > 0}
            onPress={handleResend}
          >
            <Text
              style={[
                styles.resendLink,
                timer > 0 && styles.resendLinkDisabled,
              ]}
            >
              Resend Code
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  headerContainer: {
    marginBottom: spacing.lg,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  otpInput: {
    flex: 1,
    height: 56,
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.bgCard,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  timerText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
    backgroundColor: colors.textMuted,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.bg,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  resendLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    opacity: 0.5,
    color: colors.textMuted,
  },
});
