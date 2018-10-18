const express = require('express')
const os = require('os')
const router = express.Router()
const logger = require('../logger')('api')
const UserModel = require('../db').UserModel
const uuidv1 = require('uuid/v1');

const mockHosts = [{
  url: 'wenliu2@localhost',
  group: 'localhost',
  type: 'password'
}, {
  url: 'wenliu2@proxy-lw01-2630460.lvs02.dev.ebayc3.com',
  group: 'proxy',
  type: 'password'
}]

router.use((req, resp, next) => {
  const start = new Date();
  next();
  const end = new Date();
  let timeDiff = end - start; // in ms
  
  logger.debug(`Processing URL: '${req.originalUrl}', elapsed time: ${timeDiff}ms`);
})

router.get('/getUsername', (req, res) => {
    logger.debug('req.user', req.user);
    res.json({ username: os.userInfo().username });
  }
)

// read db to get hosts list of the current user.
router.get('/hosts', (req, res) => {
  UserModel.findOne({nt: req.user.nt}, 'hosts', (err, data) => {
    if ( err ) {
      res.status(500).json(err)
    } else {
      res.json(data.hosts)
    }
  })
})

// insert a host into the host list of the current user
router.put('/host', (req, res) => {
  const user = req.user
  const uuid = uuidv1()
  const host = Object.assign({}, req.body)
  host.uuid = uuid
  UserModel.update({nt: user.nt}, {$push: {hosts: host}}, (err, raw) => {
    if (err) {
      res.status(500).json(err)
    } else {
      res.json(host)
    }
  })
})
// delete a host 
router.delete('/host/:uuid', (req, res) => {
  const uuid = req.params['uuid']
  UserModel.update({nt: req.user.nt}, {$pull: {hosts: {uuid: uuid}}}, 
    (err, raw) => {
      if (err){
        res.status(500).json(err)
      } else {
        res.json({uuid: uuid})
      }
  })
})

// update a host
router.post('/host', (req, res) => {
  const user = req.user
  const host = req.body 

  UserModel.update({nt: user.nt, "hosts.uuid": host.uuid}, {$set: {"hosts.$[]": host}}, 
    (err, raw) => {
      if (err){
        res.status(500).json(err)
      } else {
        res.json({uuid: host.uuid})
      }
    })
})

router.get('/login-status', (req, res) => {
  logger.debug('login_status')
  res.json({islogin: true})
})

module.exports = router;
