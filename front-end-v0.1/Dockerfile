# Etapa 1: Build da aplicação Vite
FROM node:latest AS build

WORKDIR /usr/src

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências, forçando a resolução de dependências com `--legacy-peer-deps`
RUN npm install --quiet --no-fund --loglevel=error --legacy-peer-deps

# Copia o restante dos arquivos do projeto
COPY . ./

# Builda os arquivos estáticos usando Vite
#RUN npm run build:frontend

# Etapa 2: Servidor Node.js para servir os arquivos estáticos
FROM node:latest

WORKDIR /usr/src

# Copia os arquivos de dependência
COPY package*.json ./

# Instala apenas as dependências necessárias para o servidor
RUN npm install express --quiet --no-fund --loglevel=error --legacy-peer-deps

# Aplica o fix no node_modules depois da instalação
COPY ./fixes/index.js /usr/src/front/node_modules/path-to-regexp/dist/index.js

# Verifica se o fix foi aplicado corretamente
#RUN ls /usr/src/front/node_modules/path-to-regexp/dist/ && \
 #   cat /usr/src/front/node_modules/path-to-regexp/dist/index.js | grep "Missing parameter name"

# Copia os arquivos estáticos gerados na etapa anterior
#COPY --from=build /usr/src/front/dist/frontend ./dist/frontend

# Copia o servidor Express (server.js)
#COPY server.js ./

# Expondo a porta 5173
EXPOSE 5173

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]