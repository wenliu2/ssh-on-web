
const mongoose = require('mongoose')
// const config = require('../config')
import config from '../config'
const logger = require('../logger')('mongo')

const dbConfig = config.get('db')
const UserModel = require('./user-model')

function connect() {
  mongoose.connect(dbConfig.url, {
    user: dbConfig.user,
    pass: dbConfig.password,
    useNewUrlParser: true,
    bufferMaxEntries: 0,
    bufferCommands: false,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    connectTimeoutMS: 10000
  }, (err) => {
    logger.info(`DB info: ${dbConfig.url}, user: ${dbConfig.user}`)
    if ( err ) {
      logger.error('Connect to mongo failed!')
      setTimeout(connect, 5000)
    } else {
      logger.info('Connect to mongo successfully!')
      /*
      const user01 = new UserModel()
      user01.nt = 'wenliu2'
      user01.createDt = new Date()
      user01.otherOptions = {
        name: 'Wen Liu'
      }
      user01.save()
      */
    }
  })
}


module.exports = {
  connect,
  UserModel
}