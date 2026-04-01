# VanGo — Frontend

App mobile para rastreamento de vans escolares em tempo real, desenvolvido para motoristas e responsáveis.

---

## Stack de Tecnologias

| Camada             | Tecnologia                                                    |
| ------------------ | ------------------------------------------------------------- |
| Framework          | React Native + Expo SDK 54 + TypeScript                       |
| Roteamento         | Expo Router (file-based)                                      |
| Interface          | React Native Paper                                            |
| Mapas e GPS        | MapBox (`@rnmapbox/maps`) + Expo Location + Expo Task Manager |
| Estado Global      | Zustand + AsyncStorage                                        |
| Estado de Servidor | TanStack Query                                                |
| Formulários        | React Hook Form + Zod                                         |
| Tempo Real         | Socket.io Client                                              |
| Notificações       | Expo Notifications                                            |
| Testes             | Jest + React Native Testing Library                           |
| Qualidade          | ESLint + Prettier + Husky + lint-staged + Commitlint          |

---

## Como Rodar o Projeto Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) LTS
- [Git](https://git-scm.com/)
- Emulador Android/iOS configurado **ou** o app [Expo Go](https://expo.dev/go) no celular

### Passo a Passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/VanGo-AGES/vango-frontend.git
   cd vango-frontend
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente** (ver seção abaixo)

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   npx expo start
   ```

   Pressione `a` para Android, `i` para iOS, ou escaneie o QR Code com o Expo Go.

---

## Variáveis de Ambiente

O projeto usa o sistema nativo do Expo para variáveis de ambiente. Todas as variáveis expostas ao app **devem** ter o prefixo `EXPO_PUBLIC_`.

1. Crie um arquivo `.env` na raiz do projeto (o `.env` está no `.gitignore` — nunca suba suas chaves reais):

   ```bash
   cp .env.example .env
   ```

2. Preencha as variáveis:

   ```env
   EXPO_PUBLIC_API_URL=https://sua-api.com
   EXPO_PUBLIC_MAPBOX_KEY=pk.seu_token_publico_do_mapbox
   ```

3. Para usar no código:

   ```ts
   const apiUrl = process.env.EXPO_PUBLIC_API_URL;
   const mapboxKey = process.env.EXPO_PUBLIC_MAPBOX_KEY;
   ```

> **MapBox:** são necessários dois tokens distintos.
>
> - **Token público** (`pk.*`): vai no `.env` como `EXPO_PUBLIC_MAPBOX_KEY`. Usado em runtime para renderizar o mapa.
> - **Token secreto** (`sk.*`): usado apenas no build nativo para baixar o SDK. Configure via variável de ambiente `RNMAPBOX_MAPS_DOWNLOAD_TOKEN` na máquina de build (CI/CD ou local antes do `expo prebuild`). Nunca commite o token secreto.

---

## Estrutura de Diretórios

```
/
├── app/          # Telas e navegação (Expo Router — cada arquivo vira uma rota)
├── assets/       # Imagens, ícones e fontes estáticas
├── components/   # Componentes visuais reutilizáveis
├── hooks/        # Custom hooks com lógica de negócio
├── lib/          # Clientes e integrações externas (API, Socket.io)
├── schemas/      # Schemas Zod de validação de formulários
├── store/        # Stores Zustand de estado global
└── styles/       # Design Tokens do Figma (colors.ts, typography.ts)
```

---

## Design System

Nunca use cores em HEX diretamente nas telas. Importe sempre os tokens:

```tsx
import { theme } from '@/styles';

// Uso: color={theme.colors.primary}
```

---

## Testes

```bash
# Rodar todos os testes
npm test

# Rodar em modo watch (re-executa ao salvar)
npm test -- --watch

# Gerar relatório de coverage
npm test -- --coverage
```

O coverage é coletado dos diretórios: `app/`, `components/`, `hooks/`, `store/`, `lib/` e `schemas/`.

---

## Padrões de Qualidade de Código

O projeto bloqueia commits e nomes de branches que não seguem os padrões abaixo. **Você não conseguirá fazer um commit nem fazer um push se quebrar essas regras.**

### Nome de Branches

Formato obrigatório: `USXX/TKYY/nome-da-branch`

- `XX` — número da User Story
- `YY` — número da Task
- `nome-da-branch` — descrição curta em kebab-case

Exemplos válidos:

```
US01/TK03/adiciona-tela-de-login
US05/TK02/componente-route-type
```

> O `git push` é bloqueado automaticamente se o nome da branch estiver fora do padrão. Push direto em `main` e `dev` também é bloqueado — sempre via PR.

### Commits (Commitlint)

Formato obrigatório: `<tipo>: <mensagem em letras minúsculas>`

| Tipo       | Quando usar                               |
| ---------- | ----------------------------------------- |
| `feat`     | Nova funcionalidade                       |
| `fix`      | Correção de bug                           |
| `chore`    | Manutenção, dependências, configurações   |
| `docs`     | Alterações na documentação                |
| `style`    | Formatação de código (sem alterar lógica) |
| `refactor` | Refatoração sem mudança de comportamento  |
| `test`     | Adição ou correção de testes              |

Exemplos válidos:

```
feat: adiciona mapa de rastreamento em tempo real
fix: corrige cálculo de rota quando GPS está desativado
chore: atualiza dependência do expo-location
```

### Lint e Formatação (ESLint + Prettier)

- **Prettier** formata o código automaticamente ao salvar no VS Code
- **Husky + lint-staged** executam o lint e o Prettier apenas nos arquivos modificados antes de cada commit
- Variáveis não utilizadas são **erro** (bloqueia commit)
- `console.log` é **aviso** (não bloqueia, mas aparece no editor)
- Prefixar com `_` para ignorar propositalmente: `const _ignorada = ...`
