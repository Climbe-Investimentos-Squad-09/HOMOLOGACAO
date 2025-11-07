FROM node:latest

# Define diretório de trabalho para backend
WORKDIR /usr/src

# Copia package.json e package-lock.json antes para aproveitar cache
COPY package*.json ./

# Instala dependências (modo silencioso e limpo)
RUN npm install --quiet --no-optional --no-fund --loglevel=error

# Copia o restante dos arquivos (código e configs)
COPY . .

# Copia o arquivo de variáveis de ambiente de produção
COPY ./.env.production ./.env

# Expõe a porta que sua API escuta (exemplo 3000)
EXPOSE 3000

# Comando padrão para iniciar o backend
CMD ["npm", "start"]