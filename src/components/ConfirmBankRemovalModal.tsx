import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { LinkedAccount } from '../services/plaid';

type ConfirmBankRemovalModalProps = {
  visible: boolean;
  account: LinkedAccount | null;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function getAccountLabel(account: LinkedAccount | null) {
  if (!account) return 'this bank account';

  const accountName = account.account_name || 'Bank Account';
  const bankName = account.institution_name || 'Connected bank';
  const mask = account.account_mask ? ` ending in ${account.account_mask}` : '';

  return `${bankName} ${accountName}${mask}`;
}

export function ConfirmBankRemovalModal({
  visible,
  account,
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmBankRemovalModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={loading ? undefined : onCancel}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          disabled={loading}
          onPress={onCancel}
        />

        <View style={styles.dialog}>
          <Text style={styles.title}>Remove Bank Account?</Text>
          <Text style={styles.message}>
            {`This will remove ${getAccountLabel(account)} from your connected banks. You can reconnect it later through Plaid.`}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              disabled={loading}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.removeButton, loading && styles.disabled]}
              disabled={loading}
              onPress={onConfirm}
            >
              {loading ? (
                <ActivityIndicator color={colors.textPrimary} />
              ) : (
                <Text style={styles.removeButtonText}>Remove</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
    padding: spacing.lg,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundCard,
    padding: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    minHeight: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundCardLight,
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  removeButton: {
    backgroundColor: colors.error,
  },
  removeButtonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  disabled: {
    opacity: 0.7,
  },
});
