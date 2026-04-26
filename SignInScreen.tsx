import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { colors, typography, spacing } from '@/theme';

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, isLoading } = useAuthStore();

  const handleSignIn = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await signIn(email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          paddingHorizontal: spacing.lg,
          justifyContent: 'center',
        }}
      >
        <Text style={{ ...typography.h1, color: colors.primary, marginBottom: spacing['3xl'] }}>
          Welcome Back
        </Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={!isLoading}
          style={{
            backgroundColor: colors.bgInput,
            color: colors.text,
            padding: spacing.md,
            borderRadius: 8,
            marginBottom: spacing.lg,
            fontSize: 16,
          }}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
          style={{
            backgroundColor: colors.bgInput,
            color: colors.text,
            padding: spacing.md,
            borderRadius: 8,
            marginBottom: spacing.lg,
            fontSize: 16,
          }}
        />

        {error ? (
          <Text style={{ color: colors.error, marginBottom: spacing.md, ...typography.body }}>
            {error}
          </Text>
        ) : null}

        <TouchableOpacity
          onPress={handleSignIn}
          disabled={isLoading}
          style={{
            backgroundColor: colors.primary,
            padding: spacing.md,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: spacing.lg,
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <Text style={{ ...typography.bodyLarge, color: colors.bg, fontWeight: '600' }}>
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          disabled={isLoading}
        >
          <Text style={{ ...typography.body, color: colors.secondary, textAlign: 'center' }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <View style={{ marginTop: spacing['3xl'], flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ ...typography.body, color: colors.textSecondary }}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={isLoading}>
            <Text style={{ ...typography.body, color: colors.primary, fontWeight: '600' }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
