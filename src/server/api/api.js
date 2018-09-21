const express = require('express')
const os = require('os')
const router = express.Router()
const logger = require('../logger')('api')

router.use((req, resp, next) => {
  const start = new Date();
  next();
  const end = new Date();
  let timeDiff = end - start; // in ms
  
  logger.debug(`Processing URL: '${req.originalUrl}', elapsed time: ${timeDiff}ms`);
})

router.get('/getUsername', (req, res) => {
    logger.debug('params', req.params);
    res.json({ username: os.userInfo().username });
  }
);

module.exports = router;
