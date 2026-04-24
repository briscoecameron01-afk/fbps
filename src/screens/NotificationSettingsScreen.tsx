import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

export function NotificationSettingsScreen({ navigation }: any) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotification, setSmsNotification] = useState(true);
  const [paymentFail, setPaymentFail] = useState(true);
  const [vibrate, setVibrate] = useState(true);
  const [sound, setSound] = useState(true);
  const [appUpdate, setAppUpdate] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Email notifications</Text>
            <Text style={styles.settingDescription}>Receive updates via email</Text>
          </View>
          <Switch value={emailNotifications} onValueChange={setEmailNotifications} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={emailNotifications ? colors.primary : colors.backgroundInput} />
        </View>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>SMS Notification</Text>
            <Text style={styles.settingDescription}>Receive updates via text message</Text>
          </View>
          <Switch value={smsNotification} onValueChange={setSmsNotification} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={smsNotification ? colors.primary : colors.backgroundInput} />
        </View>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Payment Fail</Text>
            <Text style={styles.settingDescription}>Alert when payment fails</Text>
          </View>
          <Switch value={paymentFail} onValueChange={setPaymentFail} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={paymentFail ? colors.primary : colors.backgroundInput} />
        </View>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Vibrate</Text>
            <Text style={styles.settingDescription}>Vibrate on notifications</Text>
          </View>
          <Switch value={vibrate} onValueChange={setVibrate} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={vibrate ? colors.primary : colors.backgroundInput} />
        </View>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Sound</Text>
            <Text style={styles.settingDescription}>Play sound on notifications</Text>
          </View>
          <Switch value={sound} onValueChange={setSound} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={sound ? colors.primary : colors.backgroundInput} />
        </View>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>App Update</Text>
            <Text style={styles.settingDescription}>Notify about app updates</Text>
          </View>
          <Switch value={appUpdate} onValueChange={setAppUpdate} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={appUpdate ? colors.primary : colors.backgroundInput} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textSecondary },
  headerTitle: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.textPrimary },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  settingItem: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.xs },
  settingDescription: { fontSize: fontSizes.sm, color: colors.textSecondary },
});
