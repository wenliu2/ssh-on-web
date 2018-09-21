const log4js = require('log4js')

// log4js.configure();
function logger(category, level) {
  logger = log4js.getLogger(category);
  if ( !level )  level = 'debug';
  logger.level = level;
  return logger;
}

module.exports = logger;