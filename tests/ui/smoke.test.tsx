import { Text } from 'react-native';
import { screen } from '@testing-library/react-native';

import { renderWithProviders } from '@/tests/utils/render-with-providers';

describe('estrutura de testes de UI', () => {
  it('renderiza um componente simples com providers', () => {
    renderWithProviders(<Text>VanGO</Text>);

    expect(screen.getByText('VanGO')).toBeTruthy();
  });
});
