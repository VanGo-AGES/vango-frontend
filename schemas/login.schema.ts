import { z } from 'zod';

// Ao usar com React Hook Form, importar o resolver da versão correta do Zod:
// import { zodResolver } from '@hookform/resolvers/zod-v4';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
