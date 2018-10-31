// const config = require('./config')
import config  from './config'
const express = require('express');
const logger = require('./logger')('main')

require('./passport-config')
const passport = require('passport')

const api = require('./api/api')

const app = express();
const expressWs = require('express-ws')(app)
const ws = require('./websocket')

const auth = require('./auth')
const bodyParser = require('body-parser')

const db = require('./db/')

//---------------------
//serve static contents
//---------------------
app.use(express.static('dist'));
//body parser
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.urlencoded({extended: true}))
app.disable('x-powered-by');

//---------------------
//api part
//--------------------
app.use('/api', passport.authenticate('jwt', {session: false}), api)
// auth
app.use('/auth', auth)

// register websocket
app.use('/ws', passport.authenticate('jwt', {session: false}), ws)

// start server
const port = config.get('port');
app.listen(port, () => {
  logger.debug(`Listening on port ${port}!`)
  db.connect()
});