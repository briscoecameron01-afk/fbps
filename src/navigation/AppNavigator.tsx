import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { colors } from '@/theme';
import { useStore } from '@/hooks/useStore';

// Auth Screens
import {
  SplashScreen,
  WelcomeScreen,
  SignUpScreen,
  LoginScreen,
  VerificationScreen,
  OTPScreen,
  ForgotPasswordScreen,
  SetNewPasswordScreen,
  SuccessModal,
  PayScheduleSetupScreen,
  InitialBillSetupScreen,
} from '@/screens/auth';

// Main Screens
import {
  DashboardScreen,
  NotificationsScreen,
  ContributionFailedScreen,
  AllBillsScreen,
  BillsCalendarScreen,
  AddBillScreen,
  FundingPreferenceScreen,
  BillConfirmationScreen,
  BillDetailScreen,
  BillBreakdownScreen,
  DepositHistoryScreen,
  PayBillScreen,
  PaymentReviewScreen,
  PaymentReceiptScreen,
  FundingHubScreen,
  LinkBankScreen,
  BankListScreen,
  BankDetailsScreen,
  LinkedAccountsScreen,
  AutoTransferScheduleScreen,
  ContributionsSummaryScreen,
  ManualContributionScreen,
  TransferHistoryScreen,
  InsightsScreen,
  ExportReportsScreen,
  ProfileHubScreen,
  MyProfileScreen,
  EditProfileScreen,
  RewardsScreen,
  SubscriptionScreen,
  SecurityScreen,
  NotificationSettingsScreen,
  SettingsScreen,
  EmployerProgramScreen,
  PaymentMethodsScreen,
  CheckoutScreen,
  PlansComparisonScreen,
} from '../screens';

// Type Definitions
export type RootStackParamList = {
  // Auth Stack
  Splash: undefined;
  Welcome: undefined;
  SignUp: undefined;
  Login: undefined;
  Verification: undefined;
  OTP: undefined;
  ForgotPassword: undefined;
  SetNewPassword: undefined;
  SuccessModal: undefined;
  PayScheduleSetup: undefined;
  InitialBillSetup: undefined;
  // Main Stack
  Main: undefined;
  Notifications: undefined;
  ContributionFailed: undefined;
  BillsCalendar: undefined;
  AddBill: undefined;
  EditBill: { billId: string };
  FundingPreference: { billId?: string; billAmount?: number };
  BillConfirmation: undefined;
  BillDetail: { billId: string };
  BillBreakdown: { billId: string };
  DepositHistory: { billId: string };
  PayBill: { billId: string };
  PaymentReview: { billId: string; paymentMethod?: string; amount?: number };
  PaymentReceipt: { billId: string; paymentMethod?: string; amount?: number };
  LinkBank: undefined;
  BankList: undefined;
  BankDetails: undefined;
  LinkedAccounts: undefined;
  AutoTransferSchedule: undefined;
  ContributionsSummary: undefined;
  ManualContribution: undefined;
  TransferHistory: undefined;
  ExportReports: undefined;
  MyProfile: undefined;
  EditProfile: undefined;
  Rewards: undefined;
  Subscription: undefined;
  Security: undefined;
  NotificationSettings: undefined;
  Settings: undefined;
  EmployerProgram: undefined;
  Checkout: { type: 'bill_payment' | 'subscription'; billId?: string; amount?: number; planName?: string; priceId?: string };
  PlansComparison: undefined;
  PaymentMethods: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Tab Icon Component
function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Bills: '📄',
    Funding: '💰',
    Insights: '📊',
    Profile: '👤',
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
      <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.6 }}>
        {icons[name] || '●'}
      </Text>
    </View>
  );
}

// Home Stack Navigator
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="ContributionFailed" component={ContributionFailedScreen} />
      <Stack.Screen
        name="AddBill"
        component={AddBillScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="EditBill"
        component={AddBillScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="ManualContribution" component={ManualContributionScreen} />
      <Stack.Screen
        name="LinkBank"
        component={LinkBankScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="BillDetail" component={BillDetailScreen} />
      <Stack.Screen name="BillBreakdown" component={BillBreakdownScreen} />
      <Stack.Screen name="DepositHistory" component={DepositHistoryScreen} />
      <Stack.Screen name="FundingPreference" component={FundingPreferenceScreen} />
      <Stack.Screen name="PayBill" component={PayBillScreen} />
      <Stack.Screen name="PaymentReview" component={PaymentReviewScreen} />
      <Stack.Screen name="PaymentReceipt" component={PaymentReceiptScreen} />
    </Stack.Navigator>
  );
}

// Bills Stack Navigator
function BillsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AllBills" component={AllBillsScreen} />
      <Stack.Screen name="BillsCalendar" component={BillsCalendarScreen} />
      <Stack.Screen
        name="AddBill"
        component={AddBillScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="EditBill"
        component={AddBillScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="FundingPreference" component={FundingPreferenceScreen} />
      <Stack.Screen name="BillConfirmation" component={BillConfirmationScreen} />
      <Stack.Screen name="BillDetail" component={BillDetailScreen} />
      <Stack.Screen name="BillBreakdown" component={BillBreakdownScreen} />
      <Stack.Screen name="DepositHistory" component={DepositHistoryScreen} />
      <Stack.Screen name="PayBill" component={PayBillScreen} />
      <Stack.Screen name="PaymentReview" component={PaymentReviewScreen} />
      <Stack.Screen name="PaymentReceipt" component={PaymentReceiptScreen} />
      <Stack.Screen name="ManualContribution" component={ManualContributionScreen} />
      <Stack.Screen
        name="LinkBank"
        component={LinkBankScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

// Funding Stack Navigator
function FundingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FundingHub" component={FundingHubScreen} />
      <Stack.Screen
        name="LinkBank"
        component={LinkBankScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="BankList" component={BankListScreen} />
      <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
      <Stack.Screen name="LinkedAccounts" component={LinkedAccountsScreen} />
      <Stack.Screen name="AutoTransferSchedule" component={AutoTransferScheduleScreen} />
      <Stack.Screen name="ContributionsSummary" component={ContributionsSummaryScreen} />
      <Stack.Screen name="ManualContribution" component={ManualContributionScreen} />
      <Stack.Screen name="TransferHistory" component={TransferHistoryScreen} />
    </Stack.Navigator>
  );
}

// Insights Stack Navigator
function InsightsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="InsightsScreen" component={InsightsScreen} />
      <Stack.Screen name="ExportReports" component={ExportReportsScreen} />
    </Stack.Navigator>
  );
}

// Profile Stack Navigator
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfileHub" component={ProfileHubScreen} />
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Rewards" component={RewardsScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="PlansComparison" component={PlansComparisonScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="EmployerProgram" component={EmployerProgramScreen} />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.border,
          height: 85,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Bills"
        component={BillsStack}
        options={{ title: 'Bills' }}
      />
      <Tab.Screen
        name="Funding"
        component={FundingStack}
        options={{ title: 'Funding' }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsStack}
        options={{ title: 'Insights' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Root Navigator
export function AppNavigator() {
  const { isAuthenticated, hasCompletedOnboarding } = useStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="SetNewPassword" component={SetNewPasswordScreen} />
            <Stack.Screen name="Verification" component={VerificationScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
          </>
        ) : !hasCompletedOnboarding ? (
          <>
            <Stack.Screen name="PayScheduleSetup" component={PayScheduleSetupScreen} />
            <Stack.Screen name="InitialBillSetup" component={InitialBillSetupScreen} />
            <Stack.Screen name="SuccessModal" component={SuccessModal} />
          </>
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
