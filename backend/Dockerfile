FROM node

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmjs.org/

RUN npm set progress=false

RUN npm install --verbose

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]