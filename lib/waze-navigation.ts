import { Linking, Platform } from 'react-native';

type WazeNavigationTarget = {
  latitude?: number;
  longitude?: number;
  address?: string;
};

function buildWazeUrls({ latitude, longitude, address }: WazeNavigationTarget): string[] {
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    const coordinates = `${latitude},${longitude}`;

    return [
      `waze://?ll=${coordinates}&navigate=yes`,
      `https://waze.com/ul?ll=${coordinates}&navigate=yes&zoom=17`,
    ];
  }

  if (address) {
    const encodedAddress = encodeURIComponent(address);

    return [
      `waze://?q=${encodedAddress}&navigate=yes`,
      `https://waze.com/ul?q=${encodedAddress}&navigate=yes&zoom=17`,
    ];
  }

  return [];
}

export async function openWazeNavigation(target: WazeNavigationTarget): Promise<boolean> {
  const urls = buildWazeUrls(target);

  // Prefer native scheme attempts first on mobile, then fallback to web URLs.
  const nativeUrls = urls.filter((u) => u.startsWith('waze://'));
  const webUrls = urls.filter((u) => u.startsWith('https://'));

  // On web only attempt web urls.
  if (Platform.OS === 'web') {
    for (const url of webUrls) {
      try {
        await Linking.openURL(url);
        return true;
      } catch {
        continue;
      }
    }

    return false;
  }

  // Try native urls directly (some environments have unreliable canOpenURL).
  for (const url of nativeUrls) {
    try {
      await Linking.openURL(url);
      return true;
    } catch (err) {
      // try next
      continue;
    }
  }

  // Fallback to https links (open in browser)
  for (const url of webUrls) {
    try {
      await Linking.openURL(url);
      return true;
    } catch (err) {
      continue;
    }
  }

  return false;
}

export function getWazeUrls(target: WazeNavigationTarget): string[] {
  return buildWazeUrls(target);
}
