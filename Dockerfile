# Use uma versão mais recente do Node.js
FROM node:18-alpine AS build

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de configuração do npm
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie todos os arquivos do projeto
COPY . .

# Execute o comando de build
RUN npm run build

# Use a imagem do Nginx para servir os arquivos estáticos
FROM nginx:alpine

# Copie os arquivos do build para o diretório do Nginx
COPY --from=build /app/dist/gerenciamento-processos /usr/share/nginx/html

# Exponha a porta 80
EXPOSE 80

# Comando padrão para o Nginx
CMD ["nginx", "-g", "daemon off;"]
