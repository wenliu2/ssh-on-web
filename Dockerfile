#FROM node:8.12.0-jessie
FROM liuwen1976/ssh-on-web:1.0.1

EXPOSE 8080

RUN mkdir -p /ssh-on-web
WORKDIR /ssh-on-web
COPY . /ssh-on-web
RUN npm install && npm run build

ENTRYPOINT ["npm", "start"]

