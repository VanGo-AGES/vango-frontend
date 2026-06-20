jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@expo/vector-icons/MaterialIcons', () => {
  const { Text } = require('react-native');
  return function MockMaterialIcons() {
    return <Text>Icon</Text>;
  };
});

jest.mock('react-native-keyboard-controller', () => {
  const { ScrollView } = require('react-native');
  return {
    KeyboardProvider: ({ children }: { children: React.ReactNode }) => children,
    KeyboardAwareScrollView: ScrollView,
  };
});
