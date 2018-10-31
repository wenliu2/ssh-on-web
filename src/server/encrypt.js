// const config = require('./config')
import config from './config'
const keySecret = config.get('db.key_secret')
const encryptor = require('simple-encryptor')(keySecret);

module.exports=encryptor

