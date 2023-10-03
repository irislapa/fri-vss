FROM mysql:8

ENV MYSQL_DATABASE users
ENV MYSQL_USER django
ENV MYSQL_PASSWORD djangopw
ENV MYSQL_ROOT_PASSWORD adminadmin

COPY ./data.sql /docker-entrypoint-initdb.d/data.sql

