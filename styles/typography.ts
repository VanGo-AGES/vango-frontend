import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';

export const fonts = {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_700Bold,
};

export const typography = {
  header1: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 64,
    letterSpacing: -1.28, // -2% de 64px
  },
  header2: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 40,
    letterSpacing: -0.8, // -2% de 40px
  },
  header3: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 24,
    letterSpacing: -0.48, // -2% de 24px
  },
  subtitle: {
    fontFamily: 'WorkSans_500Medium',
    fontSize: 24,
  },
  body: {
    fontFamily: 'WorkSans_500Medium',
    fontSize: 16,
    lineHeight: 22.4, // 140% de 16px
  },
  bodyBold: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 16,
    lineHeight: 22.4,
  },
  small: {
    fontFamily: 'WorkSans_500Medium',
    fontSize: 14,
  },
  smallBold: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 14,
  },
  caption: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 14,
  },
  preTitle: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 10,
    letterSpacing: 0.3, // 3% de 10px
    textTransform: 'uppercase' as const, // Adicionado pois visualmente no Figma está em maiúsculo
  },
  buttonText: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 10,
    letterSpacing: 0.3, // 3% de 10px
    textTransform: 'uppercase' as const,
  },
  link: {
    fontFamily: 'WorkSans_700Bold',
    fontSize: 16,
    textDecorationLine: 'underline' as const,
  },
};
