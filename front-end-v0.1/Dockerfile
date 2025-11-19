# ----------------------------
# Build da aplicação Vite
# ----------------------------
FROM node:20-alpine as build

#WORKDIR /usr/src
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências, forçando a resolução de dependências com `--legacy-peer-deps`
RUN npm install --quiet --no-optional --no-fund --loglevel=error

# Copia o restante dos arquivos do projeto
COPY . .


# Builda os arquivos estáticos usando Vite
RUN npm run build

# Expondo a porta 5173
EXPOSE 5173

# Comando para iniciar o servidor
CMD ["npm", "run", "dev", "--", "--host"]

