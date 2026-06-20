const TRANSFORM_IGNORE_RN =
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
  ')/)';

module.exports = {
  projects: [
    // ── Service integration tests (pure Node, fetch mocked via setup) ──
    {
      displayName: 'services',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/__tests__/services/**/*.test.ts'],
      transform: {
        '^.+\\.[jt]sx?$': ['babel-jest', { presets: ['babel-preset-expo'] }],
      },
      transformIgnorePatterns: [
        'node_modules/(?!(zustand|@react-native-async-storage|expo|@expo))',
      ],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      setupFilesAfterEnv: [
        '<rootDir>/__tests__/setup/async-storage-mock.ts',
        '<rootDir>/__tests__/setup/msw-server.ts',
      ],
    },

    // ── Component / hook tests (jest-expo full preset) ──
    {
      displayName: 'components',
      preset: 'jest-expo',
      testMatch: [
        '<rootDir>/app/**/*.test.{ts,tsx}',
        '<rootDir>/components/**/*.test.{ts,tsx}',
        '<rootDir>/hooks/**/*.test.{ts,tsx}',
      ],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      transformIgnorePatterns: [TRANSFORM_IGNORE_RN],
    },

    // ── UI / screen integration tests (jest-expo + RNTL) ──
    {
      displayName: 'ui',
      preset: 'jest-expo',
      testMatch: ['<rootDir>/tests/**/*.test.{ts,tsx}'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '\\.svg$': '<rootDir>/__mocks__/svg-mock.js',
      },
      transformIgnorePatterns: [
        TRANSFORM_IGNORE_RN.replace(
          'socket.io-client',
          'socket.io-client|' + 'expo-modules-core|' + 'expo-asset|' + '@expo-google-fonts',
        ),
      ],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.tsx'],
    },
  ],

  collectCoverageFrom: [
    'services/**/*.{ts,tsx}',
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
