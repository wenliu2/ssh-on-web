FROM node:10.15.3 AS ssh-on-web-build
# FROM victor2333/ssh-on-web:1.0.1

# EXPOSE 8080

RUN mkdir -p /ssh-on-web
WORKDIR /ssh-on-web
COPY ./package.json /ssh-on-web/package.json
COPY ./yarn.lock /ssh-on-web/yarn.lock
RUN yarn
COPY . /ssh-on-web 
RUN yarn build
RUN rm -rf node_modules
RUN yarn install --prod

FROM node:10.15.3-alpine
RUN apk add openssh-client
COPY --from=ssh-on-web-build /ssh-on-web/config/ssh_config /etc/ssh/ssh_config

RUN mkdir -p /ssh-on-web
WORKDIR /ssh-on-web
COPY --from=ssh-on-web-build /ssh-on-web/dist /ssh-on-web/dist
COPY --from=ssh-on-web-build /ssh-on-web/compiled /ssh-on-web/compiled
COPY --from=ssh-on-web-build /ssh-on-web/node_modules /ssh-on-web/node_modules
EXPOSE 8080
ENTRYPOINT [ "node","compiled/server/index.js" ]
