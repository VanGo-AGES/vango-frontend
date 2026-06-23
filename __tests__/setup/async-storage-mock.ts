// Minimal AsyncStorage mock for Node test environment
// The persist middleware writes to this but we don't need real persistence in tests
const store: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn((key: string, value: string) => {
    store[key] = value;
    return Promise.resolve();
  }),
  getItem: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
  removeItem: jest.fn((key: string) => {
    delete store[key];
    return Promise.resolve();
  }),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    return Promise.resolve();
  }),
}));
