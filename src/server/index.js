// const config = require('./config')
import config from './config'
const express = require('express');
// const logger = require('./logger')('main')
import LOGGER from './logger'
const logger = LOGGER.logger('main')

import compression from 'compression'

const passport = require('passport')

import api from './api/api'

const app = express();
const expressWs = require('express-ws')(app)
const ws = require('./websocket')

const auth = require('./auth')
const bodyParser = require('body-parser')
const https = require('https')
const http = require('http')
const fs = require('fs')

import db from './db/'

/**
 * This creates the module that we created in the step before.
 * In my case it is stored in the util folder.
 */
var Prometheus = require('./metrics');

// gzip
app.use(compression())

//---------------------
//serve static contents
//---------------------
app.use(express.static('dist'));
//body parser
app.use(bodyParser.json({
  type: 'application/json'
}))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.disable('x-powered-by');


/**
 * The below arguments start the counter functions
 */
app.use(Prometheus.requestCounters);
app.use(Prometheus.responseCounters);

/**
 * Enable metrics endpoint
 */
Prometheus.injectMetricsRoute(app);
/**
 * Enable collection of default metrics
 */
Prometheus.startCollection();

//---------------------
//api part
//--------------------
app.use('/api', passport.authenticate('jwt', {
  session: false
}), api)
// auth
app.use('/auth', auth)

// register websocket
app.use('/ws', passport.authenticate('jwt', {
  session: false
}), ws)


// start server
const port = config.get('port');
const ssl = config.get('ssl');
if (ssl.on) {
  const {
    key_path,
    cert_path,
    ca_path
  } = ssl;
  const options = {
    key: fs.readFileSync(key_path),
    cert: fs.readFileSync(cert_path),
    ca: fs.readFileSync(ca_path)
  };
  https.createServer(app, options).listen(port, () => {
    logger.debug(`Listening on port ${port}!`)
    logger.debug(`SSL key file ${options.key}!`)
    logger.debug(`SSL cert file ${options.cert}!`)
    db.connect()
  });
} else {
  http.createServer(app).listen(port, () => {
    logger.debug(`Listening on port ${port}!`)
    db.connect()
  });
}