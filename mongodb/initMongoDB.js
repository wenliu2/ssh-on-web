db.createUser({
    user: "toolsuser",
    pwd: "12345678",

    roles: [{ role: "readWrite", db: "toolsdb" }]
})