We recomend you create two dbs in your pgadmin configuration:

- aritimetica-test
- aritimetica-dev

you can also create aritimetica-prod, in case you have that open

when setting up these, please notice you will point to other docker containers, so you need to use the correct host name.

e.g.

host: testdb
port: 5432
username: aritimeticau
