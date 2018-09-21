const logger = require('./logger')('websocket')
const pty = require('pty')

class SocketApp {
  constructor (ws, req) {
    this.ws = ws;
    this.req = req;
    this.term = null;
  }

  connectionHandler (){
    logger.debug('socket connected')

    // const sshuser = 'wenliu2'
    // const sshhost = 'localhost'
    // const sshport = 22
    // const sshauth = 'password,keyboard-interactive'

    // let term = pty.spawn('ssh', 
    //   [sshuser + '@' + sshhost, '-p', sshport, '-o', 'PreferredAuthentications=' + sshauth], {
    //     name: 'xterm-256color',
    //     cols: 80,
    //     rows: 30
    // }); 

    // logger.debug(" PID=" + term.pid + " STARTED on behalf of user=" + sshuser)

    // term.on('data', function(data) {
    //   ws.send(data);
    // });

    // term.on('exit', function(code) {
    //   logger.debug((new Date()) + " PID=" + term.pid + " ENDED")
    // });
  
    let interval = 1000*10; // 10 senconds
    let waitTimes = 3; // times to wait

    let lastPong = new Date()
    const pingLoop = setInterval(()=> {
      const now = new Date()
      if ( (now - lastPong) > waitTimes * interval ){
        logger.warn('socket expired, closing it...')
        this.ws.close()
        return
      }
      // logger.debug('ping')
      this.ws.ping('ping')
    }, interval)

    this.ws.on('message', (strmsg) => {
      const msg = JSON.parse(strmsg)
      const data = msg.data
      if ( msg.op === 'connect' ){
        // ssh to server based on the client input
        this.openConnection(msg.data)
      }else if ( msg.op === 'data' ){
        // client is sending the data
        this.term.write(data)
      }else if ( msg.op === 'resize' ){
        // client is resizing
        this.term.resize(data.col, data.row)
      }else{
        logger.warn(`unknown message from client: ${strmsg}`)
      }
    })

    this.ws.on('close', () => {
      logger.debug('closed')
      // term.end()
      this.term.destroy()
      clearInterval(pingLoop);
    })

    this.ws.on('pong', (data) => {
      // logger.debug('pong', data)
      lastPong = new Date()
    })
  } // -- connectionHandler

  openConnection(clientOptions) {
    const {sshuser, sshhost, sshport, sshauth, cols, rows} = clientOptions

    this.term = pty.spawn('ssh', 
      [sshuser + '@' + sshhost, '-p', sshport, '-o', 'PreferredAuthentications=' + sshauth], {
        name: 'xterm-256color',
        cols: cols,
        rows: rows
    }); 

    logger.debug(" PID=" + this.term.pid + " STARTED on behalf of user=" + sshuser)

    this.term.on('data', (data) => {
      this.ws.send(data);
    });

    this.term.on('exit', (code) => {
      logger.debug((new Date()) + " PID=" + this.term.pid + " ENDED")
      this.ws.close()
    });
  } // -- openConnection
} // -- class

module.exports = SocketApp