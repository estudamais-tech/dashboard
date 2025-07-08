# 📘 Documentação da Dashboard — Estudamais.tech

## 🎯 Visão Geral

Dashboard educacional voltada para estudantes de tecnologia, com login exclusivo via GitHub e recomendações de ferramentas e benefícios baseadas no curso e área de interesse. O objetivo é maximizar os incentivos que o estudante pode obter ao longo da graduação.

---

## 👥 Tipos de Usuário

- **Admin (você)**
  - Acesso total ao sistema
  - Visualização de todos os usuários e dados agregados
  - Gerenciamento de produtos e benefícios

- **Estudantes**
  - Acesso à própria dashboard
  - Cadastro de curso, semestre e área de interesse
  - Visualização de recomendações e economia acumulada

---

## 🔐 Fluxo de Login

- Login via GitHub OAuth
  - Coletar: nome, e-mail, avatar, GitHub ID
  - Após login, redirecionar para o formulário de onboarding

---

## 🧾 Onboarding do Estudante

1. **Curso**
   - Campo: texto livre ou lista suspensa

2. **Semestre**
   - Perguntar: Em qual semestre está?
   - Perguntar: Quantos semestres o curso possui?
   - Resultado: calcular **quantos faltam** e **meses restantes**

3. **Área de Interesse**
   - DevOps, Backend, Frontend, Full Stack (checklist ou botão de seleção)

---

## 🎁 Recomendações de Produtos

- Cards personalizados por área
  - Exemplo para Backend:
    - GitHub Copilot
    - Travis CI
    - MongoDB Atlas
    - Railway
  - Cada produto mostra:
    - Nome e logo
    - Descrição resumida
    - Valor estimado mensal (USD)
    - Link de uso ou resgate
    - Status (resgatado ou não)

---

## 💵 Economia e Benefícios

- Cálculo automático por produto:
  - `meses_restantes * valor_mensal`
  - Armazenar total economizado
- Exibir total possível de benefícios por área (ex: Backend = $14.000)
- Armazenar total desbloqueado pelo estudante

---

## 📊 Gauge Meter (Indicador de Progresso)

- Mostrar quanto o estudante já desbloqueou
- Exemplo visual:

## Você já desbloqueou: $300 de $14.000 disponíveis


---

## 📋 Requisitos Funcionais (RF)

- **RF01**: O sistema deve permitir login exclusivamente via GitHub
- **RF02**: O estudante deve preencher curso, semestre e área de interesse no primeiro acesso
- **RF03**: O sistema deve calcular automaticamente os meses restantes
- **RF04**: O sistema deve exibir produtos recomendados com base na área selecionada
- **RF05**: Cada produto deve mostrar seu valor mensal e total estimado de economia
- **RF06**: O sistema deve armazenar o valor economizado por estudante
- **RF07**: A dashboard deve exibir o progresso total com um gauge meter
- **RF08**: O admin deve poder visualizar e gerenciar todos os dados

---

## 📋 Requisitos Não Funcionais (RNF)

- **RNF01**: O sistema deve ter autenticação segura via OAuth do GitHub
- **RNF02**: A aplicação deve ser responsiva (desktop e mobile)
- **RNF03**: Os dados do usuário devem ser armazenados de forma segura
- **RNF04**: A interface deve ter tempo de resposta inferior a 1s por ação
- **RNF05**: O sistema deve estar preparado para crescimento (escalável)
- **RNF06**: O visual deve seguir a identidade Estudamais.tech (cores, fontes, estilo)

---

## 🚀 Funcionalidades Futuras (opcional)

- Histórico de ferramentas resgatadas
- Avaliação dos produtos por parte dos estudantes
- Explorar benefícios fora da área principal
- Comparativo entre áreas
- Estatísticas e ranking por benefícios desbloqueados

