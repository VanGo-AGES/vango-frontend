import { fireEvent, screen } from '@testing-library/react-native';

import LoginScreen from '@/app/(auth)/login';
import { renderWithProviders } from '@/tests/utils/render-with-providers';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockDismissAll = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    dismissAll: mockDismissAll,
  }),
}));

jest.mock('@/hooks/use-login', () => ({
  useLogin: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza os principais elementos da tela', () => {
    renderWithProviders(<LoginScreen />);

    expect(screen.getByText('Bem-vindo de volta!')).toBeTruthy();
    expect(screen.getByText('Faça seu login:')).toBeTruthy();
    expect(screen.getByText('E-mail')).toBeTruthy();
    expect(screen.getByText('Senha')).toBeTruthy();
    expect(screen.getByText('Login')).toBeTruthy();
    expect(screen.getByText('Esqueci minha senha')).toBeTruthy();
    expect(screen.getByText('Cadastre-se')).toBeTruthy();
  });

  it('exibe diálogo de campos obrigatórios ao tentar enviar vazio', async () => {
    renderWithProviders(<LoginScreen />);

    fireEvent.press(screen.getByText('Login'));

    expect(await screen.findByText('Campos obrigatórios')).toBeTruthy();
    expect(screen.getByText('Você deve preencher os campos de usuário e senha.')).toBeTruthy();
  });

  it('navega para recuperação de senha', () => {
    renderWithProviders(<LoginScreen />);

    fireEvent.press(screen.getByText('Esqueci minha senha'));

    expect(mockPush).toHaveBeenCalledWith('/forgot-password-screen');
  });

  it('navega para cadastro', () => {
    renderWithProviders(<LoginScreen />);

    fireEvent.press(screen.getByText('Cadastre-se'));

    expect(mockPush).toHaveBeenCalledWith('/register-profile-selection-screen');
  });
});
