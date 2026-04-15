import { z } from 'zod';

import { isValidCpf, PHONE_REGEX } from '@/lib/formatters';

export function createEditProfileSchema(isDriver: boolean) {
  return z.object({
    name: z.string().trim().min(1, 'Nome obrigatório').min(2, 'Nome inválido'),
    cpf: isDriver
      ? z.string().trim().min(1, 'CPF obrigatório').refine(isValidCpf, 'CPF inválido')
      : z.string().trim().optional(),
    phone: z
      .string()
      .trim()
      .min(1, 'Telefone obrigatório')
      .refine((value) => PHONE_REGEX.test(value), 'Telefone inválido'),
    password: z
      .string()
      .refine((val) => val === '' || val.length >= 6, 'A senha deve ter pelo menos 6 caracteres'),
  });
}

export type EditProfileFormData = z.infer<ReturnType<typeof createEditProfileSchema>>;
