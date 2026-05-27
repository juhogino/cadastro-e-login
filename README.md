# app-marketplace

Aplicativo mobile de marketplace de serviços. Permite que usuários encontrem e contratem prestadores de serviço, e que prestadores cadastrem e gerenciem seus serviços.

## Tecnologias

- **React Native** + **TypeScript**
- **Expo** (com Expo Router — roteamento baseado em arquivos)
- **Axios** — consumo da API REST
- **Ionicons** — ícones

## Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go instalado no celular, ou emulador Android/iOS configurado

## Instalação

```bash
npm install
```

## Rodando o app

```bash
npx expo start
```

Escaneie o QR code com o Expo Go (Android) ou a câmera (iOS), ou pressione `a` para abrir no emulador Android e `i` para o simulador iOS.

## Configuração da API

A URL base da API está em `src/config/api.ts`:

```ts
export const API_URL = "https://api-marketplace-eta.vercel.app";
```

Para apontar para uma instância local da API, substitua pelo IP da sua máquina na rede local (ex: `http://192.168.1.10:3000`). Não use `localhost` em dispositivos físicos.

## Fluxo de telas

```
Splash (index)
└── Login          ← usuário existente
└── Cadastro       ← novo usuário (tipo: usuário ou prestador)

Após login:
Home
├── Ver Serviços → Lista de serviços
│   └── Detalhe do serviço
│       ├── Perfil do prestador
│       └── Contratar serviço (apenas tipo "usuário")
│
└── Cadastrar Serviço (apenas tipo "prestador")
```

## Estrutura

```
app/
├── (auth)/
│   ├── login.tsx
│   └── register.tsx
├── (app)/
│   ├── home.tsx
│   ├── services.tsx
│   ├── create-service.tsx
│   ├── service/[id].tsx          # detalhe do serviço
│   ├── provider/[email].tsx      # perfil do prestador
│   └── contract/[serviceId].tsx  # confirmação de contratação
└── index.tsx                     # redirect inicial

src/
├── config/
│   └── api.ts          # URL base da API
├── context/
│   └── AuthContext.tsx # estado global do usuário logado
├── lib/
│   └── axios.ts        # instância configurada do Axios
├── storage/
│   ├── authStorage.ts     # chamadas de cadastro e login
│   └── serviceStorage.ts  # chamadas CRUD de serviços
└── types/
    ├── User.ts
    └── Service.ts
```

## Tipos de usuário

| Tipo | Pode fazer |
|------|-----------|
| `usuario` | Buscar serviços, ver detalhes, ver perfil de prestadores, contratar |
| `prestador` | Cadastrar serviços, ver lista de serviços |

## API

Este app consome a [api-marketplace](../api-marketplace/README.md). Todos os dados (usuários e serviços) são persistidos remotamente via API REST.
