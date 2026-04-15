import { z } from 'zod';

import { isValidCpf } from '@/lib/formatters';

// Mesma regex usada em register-basic-info-screen
const PHONE_REGEX = /^\+55\s\d{2}\s\d{5}-\d{4}$/;

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
