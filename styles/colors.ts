export const colors = {
  primary: '#FFEE8C', // Yellow - CTAs / Focused states
  secondary: '#8c9dff', // Iris - Links
  tertiary: '#EA88CC', // Peach - Accenting Illustrations
  dark: '#0E0E2C', // Onyx - Overlays / Shadows / Headings
  success: '#5ED8B1', // Evergreen - Valid fields / Success messages
  text: '#4A4A68', // Slate - Body text
  subtleText: '#8C8CA1', // Light Slate - Helper / Deemphasized text
  accent: '#ECF1F4', // Dorian - Accent color / Hairlines
  light: '#FAFCFE', // Cloud - Light mode backgrounds / Dialogs
  white: '#FFFFFF', // White - Pure white for backgrounds and elements
  destructive: '#F06163', //  Red - Destructive actions such as deleting
};

/**
 * Aplica opacidade a uma cor em hex (#RRGGBB), retornando hex de 8 dígitos (#RRGGBBAA).
 * React Native suporta hex de 8 dígitos nativamente.
 *
 * @example
 *   withAlpha(colors.destructive, 0.12) // '#F0616320'
 */
export function withAlpha(hex: string, alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  const a = Math.round(clamped * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
  return `${hex}${a}`;
}
