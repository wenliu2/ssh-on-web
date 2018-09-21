FROM node:8.12.0-jessie

EXPOSE 8080

RUN mkdir -p /ssh-on-web
WORKDIR /ssh-on-web
COPY . /ssh-on-web
RUN npm install && npm run build

ENTRYPOINT ["npm", "start"]

