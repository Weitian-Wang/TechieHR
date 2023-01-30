FROM node

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmjs.org/

RUN npm install --verbose

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]