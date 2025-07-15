# 📦 CI/CD EstudaMais — Planejamento e Execução

## Etapas para Configuração do CI/CD completo

### ✅ Etapa 1: Organização e Documentação
- [x] Criar `PORTAS-EM-USO.md` com as portas atuais da VPS
- [x] Criar `TECH_STACK.md` com o inventário geral das stacks
- [ ] Adicionar `.env.example` nos repositórios (dashboard/backend)

### 📘 TECH_STACK.md


# 🧱 EstudaMais – Arquitetura Técnica Geral

Documento que descreve a stack atual, estrutura de execução local e de produção do ecossistema EstudaMais.

---

## 📦 Componentes do Sistema

| Componente     | Repositório                                              | Linguagem | Framework      | Tipo     | Porta local |
|----------------|----------------------------------------------------------|-----------|----------------|----------|-------------|
| Landing Page   | frontend-estudamais                                     | TypeScript | Vite + Tailwind | Estático | 5173        |
| Dashboard      | dashboard                                                | TypeScript | Vite + ShadCN   | SPA      | 5173        |
| Backend API    | Backend_estudamais                                       | JavaScript | Express         | REST API | 3001        |
| Banco de Dados | —                                                        | SQL        | MySQL           | Local    | 3306        |

---

## 🎨 Frontend (Landing Page + Dashboard)

### 📁 Landing Page
- Build tool: Vite
- UI: Radix UI + TailwindCSS
- Deploy: arquivos estáticos servidos via Nginx

### 📁 Dashboard (Painel logado)
- UI: Radix + ShadCN + lucide-react
- Formulários: react-hook-form + zod
- Estado: Zustand
- API consumption: TanStack Query (React Query)
- Gráficos: recharts
- Build: `npm run build`

---

## ⚙️ Backend API

- Linguagem: Node.js
- Framework: Express
- Banco: MySQL (`mysql2`)
- Auth: OAuth GitHub + JWT (via cookie)
- Porta: 3001

---

## 📡 Infraestrutura de Deploy

- Servidor: VPS Hostinger
- Webserver: Nginx (reverse proxy + HTTPS via Certbot)
- Roteamento:
  - `/api` → backend na porta 3001
  - `/app` → dashboard (porta 5173)
  - `/` → landing page (build estático)

---

## 🔒 Segurança

- Autenticação com JWT em cookie HttpOnly
- CSRF mitigado com SameSite=Lax
- HTTPS obrigatório
- MySQL acessível apenas localmente (127.0.0.1)

---

## 🛠️ Comandos úteis

### Backend
```bash
npm install
node server.js
```

### Dashboard
```bash
npm install
npm run dev
```

### Landing (build)
```bash
npm run build
```


### 🔧 Etapa 2: Preparar Dockerfiles
- [ ] Criar `Dockerfile` para o **dashboard**
- [ ] Criar `Dockerfile` para o **backend**
- [ ] Criar `Dockerfile` para a **landing page** (se ainda não tiver)

### ⚙️ Etapa 3: Configurar GitHub Actions
- [ ] Criar workflows em `.github/workflows/` para:
  - [ ] Dashboard (`dashboard.yml`)
  - [ ] Backend (`backend.yml`)
  - [ ] Landing Page (`landing.yml`)

### 🚀 Etapa 4: Deploy Automatizado (CI/CD)
- [ ] Buildar imagem Docker com tag `:dev` ou `:latest`
- [ ] Push para **GitHub Container Registry (GHCR)**
- [ ] A VPS puxa imagem e reinicia container (via `docker run` ou `pull + restart`)

### 🔐 Etapa 5: Configurar Secrets no GitHub
- [ ] `GHCR_USERNAME`
- [ ] `GHCR_TOKEN`
- [ ] `VPS_HOST`, `VPS_USER`, `VPS_KEY` (para deploy remoto via SSH opcional)

### 🌐 Etapa 6: Nginx
- [ ] Criar arquivos de configuração Nginx para:
  - [ ] `/api` → backend na porta 3001
  - [ ] `/app` → dashboard na porta 5173
  - [ ] `/` → landing page (build estático)
- [ ] Aplicar HTTPS com Certbot (caso ainda não esteja)

### 🧪 Etapa 7: Ambiente de staging (opcional)
- [ ] Criar subdomínio `staging.estudamais.tech`
- [ ] Deploy automático de branch `dev`
- [ ] Uso de portas alternativas (ex: 9001, 9002)

### 📈 Etapa 8: Observabilidade
- [ ] Adicionar logging básico nos containers
- [ ] (Futuro) Prometheus / Grafana ou health checks

### 🧼 Etapa 9: Limpeza e segurança
- [ ] Verificar se containers antigos são removidos
- [ ] Atualizar regras de firewall
- [ ] Backups do banco (mysqldump ou docker volume)

---

Cada etapa pode ser executada e testada separadamente.
Vamos prosseguir etapa por etapa, conferindo e aplicando.
