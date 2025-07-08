<<<<<<< HEAD
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
=======
# EstudaMais Frontend

**Interface de usuário para a plataforma EstudaMais, focada em guiar estudantes através do GitHub Student Pack e planejamento de carreira com a ajuda da Luiza, nossa IA assistente.**

[![Deploy to VPS](https://github.com/92username/frontend-estudamais/actions/workflows/deploy.yml/badge.svg)](https://github.com/92username/frontend-estudamais/actions/workflows/deploy.yml) [![CI EstudaMais Frontend](https://github.com/92username/frontend-estudamais/actions/workflows/ci.yml/badge.svg)](https://github.com/92username/frontend-estudamais/actions/workflows/ci.yml)

![Docker stats](https://img.shields.io/badge/Docker%20/%20stats-blue?logo=docker) ![Docker Image Size](https://img.shields.io/docker/image-size/user92/frontend-estudamais/latest)
![Docker Pulls](https://img.shields.io/docker/pulls/user92/frontend-estudamais)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white) 

## 🚀 Sobre o Projeto

O `frontend-estudamais` é a cara da plataforma EstudaMais.tech. Ele oferece uma experiência de usuário moderna e interativa, permitindo que estudantes explorem os benefícios do GitHub Student Developer Pack e recebam orientação de carreira personalizada através da Luiza, nossa assistente virtual baseada em Inteligência Artificial.

## ✨ Funcionalidades

- **Interface Intuitiva:** Navegação fácil e design atraente para apresentar os recursos da plataforma.
- **Chat com Luiza:** Integração com a IA Luiza para tirar dúvidas, sugerir usos de créditos e auxiliar no planejamento de carreira.
- **Responsividade:** Adaptado para uma ótima experiência em desktops, tablets e smartphones.
- **Informações Detalhadas:** Conteúdo claro sobre o GitHub Student Pack e como aproveitá-lo ao máximo.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando tecnologias modernas para garantir performance, escalabilidade e uma ótima experiência de desenvolvimento.

### Frontend

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

- **JavaScript:** Linguagem principal para a lógica do frontend.
- **React:** Biblioteca para construção de interfaces de usuário componentizadas.
- **Tailwind CSS:** Framework CSS utility-first para estilização rápida e customizável.
- **Vite:** Ferramenta de build moderna e rápida para desenvolvimento frontend.

### Backend & Infraestrutura

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)

- **Node.js:** Utilizado no ambiente de desenvolvimento e build com Vite.
- **Docker:** Para containerização da aplicação, facilitando o deploy e a consistência entre ambientes.
- **Nginx:** Servidor web para servir a aplicação estática gerada pelo Vite em produção.
- **Streamlit:** Framework utilizado para o desenvolvimento do chatbot Luiza (serviço externo).

## 🔗 Links Úteis

- **Chatbot Luiza:** [Acesse o chat aqui](https://estudamais.tamanduas.dev)
- **Docker Hub:** [Imagem Docker do Projeto](https://hub.docker.com/r/92user/frontend-estudamais)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes (se aplicável, ou adicione um arquivo LICENSE.md com o texto da licença MIT).

![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

*Desenvolvido com ❤️ pela Comunidade EstudaMais.tech*
>>>>>>> frontend-estudamais/main
