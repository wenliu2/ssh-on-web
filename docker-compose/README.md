1. create file "production.json" under /data/ssh-on-web/config/ with below contents: (replace db, user and password with the your value)   
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

2. Run ```docker-compose up``` to create and start docker instances.   

3. "ssh-on-web" will report DB connection error for the first time, you should create db/user in mongodb by following instructions.(replace db/user/password if you changed them in step 1) 
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
ssh-on-web will report connect successfully after you finish the above setup.   
Access http://localhost:18081
