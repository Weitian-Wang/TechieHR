FROM node

WORKDIR /index

COPY package.json .

RUN npm config set registry https://registry.npmjs.org/

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]