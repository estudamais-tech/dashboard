
# 📡 PORTAS EM USO – VPS EstudaMais (Hostinger)

📅 Atualizado em: 2025-07-15  
👤 Usuário root (`srv613709`)

---

## 🔍 Resultado do comando:
```bash
sudo ss -tuln
```

---

## 🔐 Portas escutando (TCP)

| Porta | Protocolo | Serviço Esperado          | IP de escuta     | Status         |
|-------|-----------|----------------------------|------------------|----------------|
| 22    | TCP       | SSH (acesso VPS)           | 0.0.0.0 / ::     | ✅ ABERTA       |
| 80    | TCP       | HTTP (Nginx)               | 0.0.0.0          | ✅ ABERTA       |
| 443   | TCP       | HTTPS (Nginx + Certbot)    | 0.0.0.0          | ✅ ABERTA       |
| 8000  | TCP       | Serviço desconhecido       | 0.0.0.0 / ::     | ⚠️ EM USO       |
| 8501  | TCP       | Serviço desconhecido       | 0.0.0.0 / ::     | ⚠️ EM USO       |
| 8502  | TCP       | Serviço desconhecido       | 0.0.0.0 / ::     | ⚠️ EM USO       |
| 8503  | TCP       | Serviço desconhecido       | 0.0.0.0 / ::     | ⚠️ EM USO       |
| 8504  | TCP       | Serviço desconhecido       | 0.0.0.0 / ::     | ⚠️ EM USO       |

---

## ✅ Portas livres (seguras para novos serviços)

As seguintes portas estão **provavelmente livres** para containers ou serviços novos:

| Porta sugerida | Proposta de uso         |
|----------------|--------------------------|
| 3001           | Backend EstudaMais       |
| 5173           | Dashboard (dev / Vite)   |
| 3306           | MySQL interno (localhost) |
| 8080           | Alternativa para front   |
| 8888           | Alternativa futura (admin?) |
| 9000+          | Range seguro para staging/proxy |

---

## 📘 Regras para deploy e CI/CD

1. **Não usar portas já em escuta**:
   - Evitar: `8000`, `8501`, `8502`, `8503`, `8504`

2. **Nginx deve expor somente as portas 80 e 443**, redirecionando para os containers internos

3. **Recomendações para os serviços**:
   | Serviço       | Porta interna | Expõe via Nginx? | Observação                   |
   |---------------|----------------|------------------|-------------------------------|
   | Landing Page  | 5173 ou 8080   | ✅ `/`           | Servir build estático         |
   | Dashboard     | 5173           | ✅ `/app`        | SPA, React                    |
   | Backend       | 3001           | ✅ `/api`        | REST com JWT                  |
   | Banco de dados| 3306 (local)   | ❌               | Somente localhost             |

---

## 🌐 Exemplo de configuração futura (proxy reverso Nginx)

```nginx
location /api {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
}

location /app {
    proxy_pass http://localhost:5173;
    proxy_set_header Host $host;
}

location / {
    root /var/www/landing;
    index index.html;
}
```

---

## 🛡️ Segurança

- MySQL está escutando **somente em localhost** ✅
- Usar HTTPS em todos os acessos externos via Nginx
- Cookies de autenticação configurados como `HttpOnly + SameSite`

---

## ✅ Conclusão

Você pode alocar os serviços novos nas portas livres a seguir:

| Serviço       | Porta sugerida | Comentário        |
|---------------|----------------|-------------------|
| Backend       | 3001           | CI/CD pode manter |
| Dashboard     | 5173           | Já está padrão Vite |
| Landing Page  | 8080 ou 5173   | Se build estático |
| Banco         | 3306           | Localhost apenas  |

CI/CD pode usar essas portas **sem conflito** 🎯
