FROM node:12.13

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .

EXPOSE 8091

CMD ["npm", "start"]