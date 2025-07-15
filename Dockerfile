# Etapa 1: Build da aplicação
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Etapa 2: Servir build estático com Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
