[![CI Dashboard](https://github.com/estudamais-tech/dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/estudamais-tech/dashboard/actions/workflows/ci.yml)


# EstudaMais.tech – Setup e Arquitetura Inicial

## Objetivo

Dashboard para estudantes com métricas reais de benefícios de tecnologia, usando dados da API do GitHub. Integração completa: autenticação OAuth, consumo de dados reais e exibição via React.

---

## Decisões Técnicas

- **Monorepo**: Frontend e backend no mesmo repositório para facilitar integração e desenvolvimento (ideal para equipe pequena).
- **Frontend**: React + TypeScript (pasta `/frontend`).
- **Backend**: Node.js + Express (pasta `/backend`).
- **Autenticação**: OAuth do GitHub via backend (tokens seguros, lógica de login do lado do servidor).
- **Comunicação**: Front consome API REST local (`/api`) do backend.
- **Proxy**: Configurado no frontend para facilitar dev local (`/api` → `localhost:3333`).
- **Dependências isoladas**: Cada app com seu próprio `package.json`, mas scripts facilitadores na raiz para rodar tudo junto.

---

## Estrutura do Repositório
```
estudamais/
├── backend/
│ ├── package.json
│ └── src/
├── frontend/
│ ├── package.json
│ └── src/
├── package.json # scripts utilitários para dev
└── README.md
```

---

## Setup Local (Desenvolvimento)

1. **Clone o projeto**
    ```bash
    git clone https://github.com/<sua-org>/estudamais.git
    cd estudamais
    ```

2. **Instale dependências de todos os apps**
    ```bash
    npm install
    ```

3. **Configuração do backend**
    - Crie `.env` em `/backend` com:
        ```
        GITHUB_CLIENT_ID=...
        GITHUB_CLIENT_SECRET=...
        GITHUB_CALLBACK_URL=http://localhost:3333/api/auth/github/callback
        ```

4. **Rode tudo em paralelo**
    ```bash
    npm run dev
    ```

---

## Scripts Úteis

- **`npm run dev`** — Sobe backend e frontend juntos
- **`npm run dev:back`** — Sobe só o backend
- **`npm run dev:front`** — Sobe só o frontend

---

## Fluxo de Autenticação e Dados

1. Usuário acessa frontend React.
2. Clica para logar com GitHub → redireciona para `/api/auth/github` (backend).
3. OAuth processado pelo backend (Express + Passport).
4. Backend recebe token, pode buscar dados reais do usuário na API do GitHub.
5. Backend fornece endpoints REST, que o frontend consome para montar o dashboard (números reais, sem mock).

---

## Convenções

- Código organizado por feature/pasta.
- Commits claros e diretos.
- Sempre rodar localmente antes de PR.
