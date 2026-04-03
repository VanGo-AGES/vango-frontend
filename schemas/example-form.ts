import { z } from 'zod';

// 1. Defina o schema Zod com as regras de validação.
//    O schema é a fonte única da verdade — ele valida E gera o tipo TypeScript.
export const exampleFormSchema = z.object({
  email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

// 2. Derive o tipo TypeScript diretamente do schema.
//    Nunca declare uma interface separada para dados de formulário — use z.infer<>.
export type ExampleFormData = z.infer<typeof exampleFormSchema>;
