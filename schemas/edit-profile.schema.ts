import { z } from 'zod';

// Mesma regex usada em register-basic-info-screen para garantir consistência
const PHONE_REGEX = /^\+55\s\d{2}\s\d{5}-\d{4}$/;

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function isValidCpf(value: string) {
  const cpf = onlyDigits(value);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split('').map(Number);

  const calculateCheckDigit = (length: number) => {
    const sum = digits.slice(0, length).reduce((acc, digit, index) => {
      return acc + digit * (length + 1 - index);
    }, 0);

    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstCheckDigit = calculateCheckDigit(9);
  const secondCheckDigit = calculateCheckDigit(10);

  return digits[9] === firstCheckDigit && digits[10] === secondCheckDigit;
}

export const editProfileSchema = z.object({
  name: z.string().trim().min(1, 'Nome obrigatório').min(2, 'Nome inválido'),
  cpf: z.string().trim().min(1, 'CPF obrigatório').refine(isValidCpf, 'CPF inválido'),
  phone: z
    .string()
    .trim()
    .min(1, 'Telefone obrigatório')
    .refine((value) => PHONE_REGEX.test(value), 'Telefone inválido'),
  password: z
    .string()
    .refine((val) => val === '' || val.length >= 6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
