docker run /
    --name postgres /
    -e POSTGRES_USER=nicksoares /
    -e POSTGRES_PASSWORD=minhasenha /
    -e POSTGRES_DB=heroes /
    -p 5432:5432 /
    -d /
    postgres