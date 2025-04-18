# Use a imagem Node.js oficial como base
FROM node:20-alpine AS base

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar o código fonte
COPY . .

# Construir o aplicativo
RUN npm run build

# Configurações de produção
ENV NODE_ENV production
ENV PORT 9824

# Expor a porta solicitada
EXPOSE 9824

# Iniciar o aplicativo
CMD ["npm", "start"] 