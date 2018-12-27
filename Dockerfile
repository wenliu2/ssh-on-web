FROM node:8.12.0-onbuild AS ssh-on-web-build
# FROM victor2333/ssh-on-web:1.0.1

# EXPOSE 8080

RUN mkdir -p /ssh-on-web
WORKDIR /ssh-on-web
COPY . /ssh-on-web
RUN npm install && npm run build

FROM node:8.12.0-alpine
RUN mkdir -p /ssh-on-web
WORKDIR /ssh-on-web
COPY --from=ssh-on-web-build /ssh-on-web/dist /ssh-on-web/dist
COPY --from=ssh-on-web-build /ssh-on-web/compiled /ssh-on-web/compiled
COPY --from=ssh-on-web-build /ssh-on-web/node_modules /ssh-on-web/node_modules
RUN ls -la /ssh-on-web
EXPOSE 8080
ENTRYPOINT [ "node","compiled/server/index.js" ]
