const express = require('express');
const logger = require('./logger')('main')

const api = require('./api/api')

const app = express();
const expressWs = require('express-ws')(app)
const wsLogic = require('./websocket')

//---------------------
//serve static contents
//---------------------
app.use(express.static('dist'));
app.disable('x-powered-by');

//---------------------
//api part
//--------------------
app.use('/api', api);

/*
expressWs.getWss().on('connection', function(ws, req){
  logger.debug('connected', req);  
});
*/

// register websocket handling logic
app.ws('/ws', wsLogic)

// start server
const port = 8080;
app.listen(port, () => logger.debug(`Listening on port ${port}!`));