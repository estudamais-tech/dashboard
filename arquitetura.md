# 🧱 EstudaMais – Arquitetura Técnica Geral

Este documento descreve a stack atual, estrutura de execução local e de produção do ecossistema **EstudaMais**, incluindo landing page, dashboard, backend e banco de dados.

---

## 📦 Componentes do Sistema

| Componente     | Repositório                                              | Linguagem | Framework      | Tipo     | Porta local |
|----------------|----------------------------------------------------------|-----------|----------------|----------|-------------|
| Landing Page   | [frontend-estudamais](https://github.com/estudamais-tech/frontend-estudamais) | TypeScript | Vite + Tailwind | Estático | 5173        |
| Dashboard      | [dashboard](https://github.com/estudamais-tech/dashboard) | TypeScript | Vite + ShadCN   | SPA/Painel | 5173        |
| Backend API    | [Backend_estudamais](https://github.com/estudamais-tech/Backend_estudamais) | JavaScript | Express         | REST API | 3001        |
| Banco de Dados | —                                                        | SQL       | MySQL           | Relacional | 3306 (default) |

---

## 🎨 Frontend (Landing Page + Dashboard)

### 📁 Landing Page
- **Build tool**: Vite
- **UI**: Radix UI + TailwindCSS
- **Build:** `npm run build`
- **Deploy:** arquivos estáticos (HTML, CSS, JS) servidos via Nginx

### 📁 Dashboard (Painel logado)
- **UI/UX**: Radix + ShadCN + `lucide-react`
- **Formulários**: `react-hook-form` + `zod`
- **Gerenciamento de estado**: Zustand
- **API consumption**: TanStack Query (React Query)
- **Gráficos**: `recharts`
- **Roteamento**: `react-router-dom`
- **Build:** `npm run build` (gera arquivos estáticos)

---

## ⚙️ Backend API

- **Linguagem**: Node.js
- **Framework**: Express
- **Banco**: MySQL (`mysql2`)
- **Auth**: OAuth GitHub + JWT (via cookie)
- **Variáveis de ambiente (`.env`)**:
  ```env
  PORT=3001
  GITHUB_CLIENT_ID=...
  GITHUB_CLIENT_SECRET=...
  GITHUB_REDIRECT_URI=http://localhost:8080/dashboard
  JWT_SECRET=...
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=...
  DB_NAME=estudamais_db
  ```


**Rotas**:

  * `/api/auth/...` → login, logout, callback, check-auth
  * `/api/users/...` → onboarding, contagens, dashboard
  * `/api/user/...` → trilhas, progressão

---

## 🛠️ Scripts úteis

### Dashboard

```bash
npm run dev         # Inicia ambiente local (Vite)
npm run build       # Gera build para produção
```

### Backend

```bash
node server.js      # Inicia o servidor (porta 3001)
```

---

## 📡 Infraestrutura de Deploy

* **Servidor VPS Hostinger**
* **Servidor web**: Nginx (reverse proxy + HTTPS)
* **Roteamento**:

  | Caminho | Componente   | Observações              |
  | ------- | ------------ | ------------------------ |
  | `/`     | Landing Page | Conteúdo estático        |
  | `/app`  | Dashboard    | SPA com rotas internas   |
  | `/api`  | Backend API  | Proxyado para porta 3001 |
* **SSL**: Let's Encrypt (via Certbot)
* **CI/CD (futuro)**: GitHub Actions → Docker → Deploy automático

---

## 🔒 Segurança

* Autenticação com JWT armazenado em cookies HttpOnly
* CSRF mitigado com `sameSite=Lax`
* Uso obrigatório de HTTPS em produção
* Tokens e segredos externos via `.env`

---

## 🧪 Testes e Ambiente de Desenvolvimento

* Projeto pode ser clonado e rodado localmente com:

  ```bash
  git clone ...
  npm install
  npm run dev
  ```
* É recomendável rodar backend e dashboard simultaneamente
* Proxy local do frontend aponta para `/api → localhost:3001`

---

## 🧭 Roadmap de Integração CI/CD (próximas etapas)

* [ ] Criar Dockerfiles para backend e dashboard
* [ ] Servir build da dashboard via Nginx
* [ ] Configurar pipelines GitHub Actions para build/test/deploy
* [ ] Definir ambiente de staging (`staging.estudamais.tech`)

---

## ✍️ Contribuição

* Crie uma branch: `feat/seu-nome`
* Faça PRs pequenos e testados localmente
* Preferência por commits descritivos e limpos

---

## 🌍 Contato

Esse projeto é mantido pela comunidade do [EstudaMais Tech](https://github.com/estudamais-tech).
