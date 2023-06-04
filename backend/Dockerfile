FROM node

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmjs.org/

RUN npm set progress=false

RUN npm install --verbose

COPY . .

RUN apt update && apt install -y default-jre && apt install -y default-jdk

EXPOSE 8080

CMD [ "npm", "start" ]