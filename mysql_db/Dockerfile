# Pulling image from original MySQL repositorty.
FROM mysql:5.6.26

# Using script which Docker will execute on DB init.
ADD createdbs.sql /docker-entrypoint-initdb.d/
