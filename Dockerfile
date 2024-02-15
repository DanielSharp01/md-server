FROM node:20.6.1
WORKDIR /root/app

COPY package*.json ./
RUN npm install

COPY *.js .

EXPOSE 8080
ENTRYPOINT ["node", "index.js"]