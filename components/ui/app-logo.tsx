import type { ComponentProps, ReactElement } from 'react';

import LogoDark from '@/assets/images/logo-dark.svg';
import LogoLight from '@/assets/images/logo-light.svg';

type LogoVariant = 'light' | 'dark';

type LogoProps = ComponentProps<typeof LogoLight>;

export type AppLogoProps = LogoProps & {
  variant?: LogoVariant;
};

export function AppLogo({ variant = 'light', ...props }: AppLogoProps): ReactElement {
  const Logo = variant === 'dark' ? LogoDark : LogoLight;

  return <Logo {...props} />;
}
