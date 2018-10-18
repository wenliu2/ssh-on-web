const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const UserSchema = new Schema({
    id: ObjectId,
    nt: String,
    passwordHash: String,
    createDt: Date,
    hosts: [{
      uuid: String,
      url: String,
      group: String,
      authType: String
    }]
  },
  {bufferCommands: false}
)

UserSchema.index({nt: 1}, {unique: true})


const UserModel =  mongoose.model("user", UserSchema)
module.exports = UserModel