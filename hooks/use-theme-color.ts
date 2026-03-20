import { colors } from '@/styles/colors';

export function useThemeColor(colorName: keyof typeof colors): string {
  return colors[colorName];
}
