const express = require('express')
import LOGGER from './logger'
const logger = LOGGER.logger('websocket')
const pty = require('node-pty')
const file = require('tmp-promise').file
const fs = require('fs-extra')
const Promise = require('bluebird')
const UserModel = require('./db/').UserModel
const encryptor = require('./encrypt')

const router = express.Router()
router.ws('/', (ws, req) => {
  const wsApp = new SocketApp(ws, req)
  wsApp.connectionHandler()
})

class SocketApp {
  constructor(ws, req) {
    this.ws = ws;
    this.req = req;
    this.term = null;
  }

  connectionHandler() {
    logger.debug('socket connected', this.req.user)

    let interval = 1000 * 10; // 10 senconds
    let waitTimes = 3; // times to wait

    let lastPong = new Date()
    const pingLoop = setInterval(() => {
      const now = new Date()
      if ((now - lastPong) > waitTimes * interval) {
        logger.warn('socket expired, closing it...')
        this.ws.close()
        return
      }
      // logger.debug('ping')
      this.ws.ping('ping')
    }, interval)

    this.ws.on('message', (strmsg) => {
      if (!this.ws.isAlive) this.ws.isAlive = true
      const msg = JSON.parse(strmsg)
      const data = msg.data
      if (msg.op === 'connect') {
        // ssh to server based on the client input
        this.openConnection(msg.data)
      } else if (msg.op === 'data' && this.term) {
        // client is sending the data
        this.term.write(data)
      } else if (msg.op === 'resize' && this.term) {
        // client is resizing
        this.term.resize(data.col, data.row)
        logger.debug("resizing")
      } else if (msg.op === 'close' && this.term) {
        this.term.destroy()
      } else {
        logger.warn(`unknown message from client: ${strmsg}`)
      }
    })

    this.ws.on('close', () => {
      logger.debug('closed')
      // term.end()
      this.ws.isAlive = false
      if (this.term) this.term.destroy()
      clearInterval(pingLoop);
    })

    this.ws.on('pong', (data) => {
      // logger.debug('pong', data)
      lastPong = new Date()
    })
  } // -- connectionHandler

  pty(sshArgs, clientOptions) {
    const { sshuser, cols, rows } = clientOptions
    this.term = pty.spawn('ssh', sshArgs, {
      name: 'xterm-256color',
      cols: cols,
      rows: rows
    });

    logger.debug(" PID=" + this.term.pid + " STARTED on behalf of user=" + sshuser)

    this.term.on('data', (data) => {
      this.ws.send(data);
    });

    this.term.on('exit', (code) => {
      logger.debug((new Date()) + " PID=" + this.term.pid + " ENDED" + "EXIT CODE" + code)
      if (this.ws.isAlive) {
        this.ws.send("PTY exit code " + code + "\r\n")
        this.ws.close()
      }
    });
  }

  openConnection(clientOptions) {
    logger.debug("clientOptions:", clientOptions)
    const { sshuser, sshhost, sshport, options } = clientOptions

    const sshArgs = [sshuser + '@' + sshhost, '-p', sshport]
    if (options.PreferredAuthentications) {
      sshArgs.push('-o', 'PreferredAuthentications=' + options.PreferredAuthentications)
    }

    if (options.ServerAliveInterval) {
      sshArgs.push('-o', 'ServerAliveInterval=' + options.ServerAliveInterval)
    }

    if (options.PreferredAuthentications === 'publickey') {
      const hash = options.keyHash
      let path = ''
      let cleanup = false
      const filePromise = file({ mode: 0o600, prefix: 'ssh-on-web-', postfix: '.key' })
      const keyContentPromise = new Promise((resolve, reject) => {
        UserModel.findOne({ nt: this.req.user.nt, 'keys.hash': hash }, { 'keys.privatekey': 1, keys: { $elemMatch: { hash, hash } } }, (err, doc) => {
          // UserModel.find({"keys.hash": hash }, {'keys.hash':1, 'keys.privatekey':1, 'keys.name': 1}, (err, doc) => {
          if (err) return reject(err)
          if (!doc) return reject(new Error('unknown key'))
          resolve(doc.keys[0].privatekey)
        })
      })

      Promise.all([filePromise, keyContentPromise])
        .then(results => {
          // logger.debug("results: ", results)
          const o = results[0]
          const keyResult = encryptor.decrypt(results[1])

          cleanup = o.cleanup

          path = o.path
          return fs.write(o.fd, keyResult)
        }).then((x) => {
          sshArgs.push('-i', `${path}`)
          this.pty(sshArgs, clientOptions)
        }).catch(err => {
          logger.error("err:", err)
          this.ws.send((`${err.name}: ${err.message}\r\n`))
          this.ws.close()
        }).finally(() => {
          if (cleanup) setTimeout(cleanup, 3000000) //tmp file deleted after 5 mins
        })
    } else {
      this.pty(sshArgs, clientOptions)
    }
  } // -- openConnection
} // -- class

module.exports = router