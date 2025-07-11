💻 EstudaMais.Tech – Setup e Arquitetura Inicial
🎯 Objetivo
Dashboard para estudantes com métricas reais de benefícios de tecnologia, usando dados da API do GitHub.
Integração completa: autenticação OAuth, consumo de dados reais e exibição via React.

⚙️ Decisões Técnicas
Frontend: React + TypeScript (/frontend).
Comunicação: Front consome API REST do backend externo.
Proxy: Configurado no frontend para facilitar dev local (/api → backend local).
Dependências isoladas: Frontend com seu próprio package.json.
🛠️ Setup Local (Desenvolvimento)
Clone o projeto
git clone https://github.com/estudamais-tech/Frontend_estudamais.git
cd Frontend_estudamais # Ajuste para o nome correto do repositório frontend


Instale as dependências

npm install

💻 Configuração do Frontend
Crie um arquivo .env.local na raiz da pasta /frontend com o seguinte conteúdo:


VITE_REACT_APP_GITHUB_CLIENT_ID=seu_client_id_do_github_frontend  
VITE_REACT_APP_GITHUB_REDIRECT_URI=http://localhost:8080/dashboard  
VITE_REACT_APP_BACKEND_API_URL=http://localhost:3001/api

💡 Importante para o Frontend
VITE_REACT_APP_GITHUB_CLIENT_ID: ID do seu aplicativo OAuth configurado no GitHub,  o mesmo usado para o backend

VITE_REACT_APP_GITHUB_REDIRECT_URI=http://localhost:8080/dashboard - Deve ser exatamente igual à URL configurada no GitHub (em "Authorization callback URL"). o mesmo usado para o backend

VITE_REACT_APP_BACKEND_API_URL=http://localhost:3001/api - URL base da API do backend. Confirme que corresponde ao endereço onde o backend está rodando (externo ou local). 

🔑 Como obter GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET

Acesse GitHub Developer Settings → OAuth Apps.

Clique em New OAuth App.

Preencha:

Application name: EstudaMais (ou outro nome descritivo)

Homepage URL: http://localhost:8080

Authorization callback URL: http://localhost:8080/dashboard

Após criar, copie o Client ID e gere um Client Secret.

Atualize o arquivo .env.local do frontend com essas informações.

▶️ Rodando o projeto

npm run dev
⚡ Scripts Úteis
npm run dev — Sobe somente o frontend.

🔄 Fluxo de Autenticação e Dados
Usuário acessa frontend React.

Clica para logar com GitHub → frontend inicia redirecionamento para o GitHub (usando VITE_REACT_APP_GITHUB_CLIENT_ID e VITE_REACT_APP_GITHUB_REDIRECT_URI).

Após autenticação, GitHub redireciona para VITE_REACT_APP_GITHUB_REDIRECT_URI, enviando um code.

Frontend envia o code para backend externo (URL definida em VITE_REACT_APP_BACKEND_API_URL).

Backend processa OAuth, troca code por token, gera JWT e define cookie HttpOnly.

Backend fornece endpoints REST consumidos pelo frontend para montar o dashboard com dados reais.

✅ Convenções
Código organizado por feature/pasta.

Commits claros e descritivos.

Sempre rodar localmente antes de abrir PR.

🤝 Contribuições
Pull requests são bem-vindos! 💜

Para contribuir, crie uma branch com seu nome, seguindo o formato:
feat/seu-nome

Exemplo: feat/maria-silva, feat/joao-dev.

🛡️ Licença
Licença ISC — Em breve adicionada ao repositório.

📣 Contato
Dúvidas ou sugestões? Abra uma Issue ou envie um Pull Request.

🌟 Projeto oficial do EstudaMais Tech (https://github.com/estudamais-tech)
