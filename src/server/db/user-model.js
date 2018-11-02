// const mongoose = require('mongoose')
import mongoose from 'mongoose'

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
      authType: String,
      keyHash: String
    }],
    keys: [
      {
        hash: String,
        name: String,
        description: String,
        privatekey: String
      }
    ]
  },
  {bufferCommands: false}
)

UserSchema.index({nt: 1}, {unique: true})
UserSchema.index({nt: 1, "keys.hash": 1}, {unique: true})
UserSchema.index({nt: 1, "hosts.uuid": 1}, {unique: true})

const UserModel =  mongoose.model("user", UserSchema)
module.exports = UserModel