module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/react-native/extend-expect'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      'react-native|' +
      '@react-native|' +
      'expo|' +
      '@expo|' +
      'expo-router|' +
      'expo-location|' +
      'expo-task-manager|' +
      'expo-notifications|' +
      'expo-constants|' +
      'expo-font|' +
      'expo-splash-screen|' +
      'expo-status-bar|' +
      'expo-system-ui|' +
      'expo-haptics|' +
      'expo-image|' +
      'expo-linking|' +
      'react-native-paper|' +
      'react-native-safe-area-context|' +
      'react-native-screens|' +
      'react-native-gesture-handler|' +
      'react-native-reanimated|' +
      '@react-navigation|' +
      '@tanstack/react-query|' +
      'zustand|' +
      'socket.io-client' +
      ')/)',
  ],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'store/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'schemas/**/*.{ts,tsx}',
    '!**/__tests__/**',
    '!**/*.test.{ts,tsx}',
    '!**/*.spec.{ts,tsx}',
  ],
};
