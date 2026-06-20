import { fireEvent, screen } from '@testing-library/react-native';

import ForgotPasswordScreen from '@/app/(auth)/forgot-password-screen';
import { renderWithProviders } from '@/tests/utils/render-with-providers';

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
    replace: mockReplace,
  }),
}));

jest.mock('@/assets/images/forgot-password.svg', () => 'ForgotPasswordIllustration');

describe('ForgotPasswordScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza os principais elementos da tela', () => {
    renderWithProviders(<ForgotPasswordScreen />);

    expect(screen.getByText('Esqueceu a senha?')).toBeTruthy();
    expect(
      screen.getByText('Sem problemas! Insira seu e-mail para receber as instruções.'),
    ).toBeTruthy();
    expect(screen.getByText('E-mail')).toBeTruthy();
    expect(screen.getByText('Enviar')).toBeTruthy();
    expect(screen.getByText('Não tem uma conta?')).toBeTruthy();
    expect(screen.getByText('Cadastre-se')).toBeTruthy();
  });

  it('exibe erro ao tentar enviar com e-mail vazio', async () => {
    renderWithProviders(<ForgotPasswordScreen />);

    fireEvent.press(screen.getByText('Enviar'));

    expect(await screen.findByText('E-mail não pode ser vazio')).toBeTruthy();
  });

  it('exibe erro ao preencher e-mail inválido', async () => {
    renderWithProviders(<ForgotPasswordScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('nome@gmail.com'), 'email-invalido');
    fireEvent.press(screen.getByText('Enviar'));

    expect(await screen.findByText('E-mail incorreto')).toBeTruthy();
  });

  it('volta ao pressionar o botão de voltar', () => {
    renderWithProviders(<ForgotPasswordScreen />);

    fireEvent.press(screen.getByLabelText('voltar'));

    expect(mockBack).toHaveBeenCalled();
  });

  it('navega para cadastro ao pressionar Cadastre-se', () => {
    renderWithProviders(<ForgotPasswordScreen />);

    fireEvent.press(screen.getByText('Cadastre-se'));

    expect(mockPush).toHaveBeenCalledWith('/register-profile-selection-screen');
  });
});
