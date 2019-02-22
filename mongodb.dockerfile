FROM mongo:4.1.8-xenial
COPY ./config/initMongoDB.js /docker-entrypoint-initdb.d/