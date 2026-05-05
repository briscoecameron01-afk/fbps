const isWeb =
  process.env.EXPO_OS === 'web' ||
  process.argv.includes('--web') ||
  process.argv.includes('web') ||
  (process.argv.includes('--platform') && process.argv[process.argv.indexOf('--platform') + 1] === 'web');
const includeNativeConfigPlugins =
  !isWeb &&
  (
    process.env.EAS_BUILD === 'true' ||
    process.env.EXPO_PUBLIC_ENABLE_NATIVE_CONFIG_PLUGINS === 'true'
  );

const nativePlugins = [
  [
    'react-native-plaid-link-sdk',
    {
      ios: true,
      android: true,
    },
  ],
  [
    '@stripe/stripe-react-native',
    {
      merchantIdentifier: 'merchant.com.fractionalbillpay',
      enableGooglePay: true,
    },
  ],
];

module.exports = {
  expo: {
    name: 'Fractional Bill Pay',
    slug: 'fractional-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    web: {
      favicon: './assets/favicon.png',
    },
    userInterfaceStyle: 'light',
    scheme: 'fractional',
    splash: {
      backgroundColor: '#0B2545',
      resizeMode: 'contain',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.fractionalbillpay.app',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#0B2545',
      },
      package: 'com.fractionalbillpay.app',
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      ...(includeNativeConfigPlugins ? nativePlugins : []),
    ],
  },
};
