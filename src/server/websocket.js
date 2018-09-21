const logger = require('./logger')('websocket')
const pty = require('pty')

module.exports = function(ws, req){
  logger.debug('connected')

  const sshuser = 'wenliu2'
  const sshhost = 'localhost'
  const sshport = 22
  const sshauth = 'password,keyboard-interactive'

  let term = pty.spawn('ssh', 
    [sshuser + '@' + sshhost, '-p', sshport, '-o', 'PreferredAuthentications=' + sshauth], {
      name: 'xterm-256color',
      cols: 80,
      rows: 30
  }); 

  logger.debug(" PID=" + term.pid + " STARTED on behalf of user=" + sshuser)

  term.on('data', function(data) {
    ws.send(data);
  });

  term.on('exit', function(code) {
    logger.debug((new Date()) + " PID=" + term.pid + " ENDED")
  });
  
  let interval = 1000*10; // 10 senconds
  let waitTimes = 3; // times to wait

  let lastPong = new Date()
  const pingLoop = setInterval(()=> {
    const now = new Date()
    if ( (now - lastPong) > waitTimes * interval ){
      logger.warn('socket expired, closing it...')
      ws.close()
      return
    }
    // logger.debug('ping')
    ws.ping('ping')
  }, interval)

  ws.on('message', function(strmsg){
    // logger.debug('msg: ', msg)
    // ws.send(`pong, ${msg}`)
    
    const msg = JSON.parse(strmsg)
    const data = msg.data
    // logger.debug('msg: ' + msg)
    if ( msg.op === 'data' ){
      term.write(data)
    }
    if ( msg.op === 'resize' ){
      term.resize(data.col, data.row)
    }
  })
  ws.on('close', function(){
    logger.debug('closed')
    // term.end()
    term.destroy()
    clearInterval(pingLoop);
  })

  ws.on('pong', function(data){
    // logger.debug('pong', data)
    lastPong = new Date()
  })
}