1. "ssh-on-web" will report DB connection error for the first time, you should create user in mongodb firstly.   
Running below command to create db and user (replace the user and pwd with different values):   
```
docker-compose exec mongodb /bin/bash
mongo

use toolsdb
db.createUser(
   {
     user: "toolsuser",
     pwd: "password12345",
     roles: [ "dbOwner" ]
   }
)

```

2. create file "production.json" under /data/ssh-on-web/config/ with below contents: (replace user and password with the one you created in step 1)   
```
{
  "port":"8080",
  "db":{
    "url":"mongodb://mongodb/toolsdb",
    "user":"toolsuser",
    "password":"password12345"
  }
}
```
