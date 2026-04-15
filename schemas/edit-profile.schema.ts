import { z } from 'zod';

import { isValidCpf, PHONE_REGEX } from '@/lib/formatters';

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
