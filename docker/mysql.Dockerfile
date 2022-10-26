FROM mysql

ENV MYSQL_ROOT_PASSWORD MYSQL_ROOT_PASSWORD
ENV MYSQL_DATABASE mega_shop

ADD mega_shop_updated.sql /docker-entrypoint-initdb.d

EXPOSE 3306
