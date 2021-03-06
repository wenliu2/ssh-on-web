import LOGGER from './logger'
const logger = LOGGER.logger('passport')
const passport = require('passport')
const passportJWT = require('passport-jwt')
// const config = require('./config')
import config from './config'

const extractJWT = passportJWT.ExtractJwt

const LocalStrategy = require('passport-local').Strategy
const JWTStrategy = passportJWT.Strategy
const db = require('./db')
const sha512 = require('js-sha512')

const UserModel = db.UserModel

const jwtSecret = config.get("passport.jwt_secret")
const jwtMaxAge = config.get("passport.max_age")

logger.debug(`jwtSecret = ${jwtSecret}`)
logger.debug(`jwtMaxAge = ${jwtMaxAge}`)
const PASSPORT_CONFIG = {
  JWT_SECRET: jwtSecret,
  JWT_OPTIONS: {
    maxAge:jwtMaxAge
  }
}

passport.use(new LocalStrategy({
  usernameField: 'nt',
  passwordField: 'password',
  session: false
}, (nt, password, cb) => {
  // simple judge, password === nt for quick development
  // logger.debug('local stragtegy 1, UserModel: ', UserModel)
  UserModel.findOne({nt: nt}, (err, user) => {
    // logger.debug('local strategy', user)
    if ( !user ) {
      logger.debug(`user not found: '${nt}'`)
    }
    if (err) {
      logger.error('findOne error', err)
      return cb(err, false, {message: err.message})
    }
    if (!user || user.passwordHash !== sha512(password)) {
      return cb(null, false, {message: 'User/Password mismatch'})
    }
    logger.debug(`user login successfully. '${nt}`)
    return cb(null, {nt: user.nt}, {message: 'Logged in Successfully'})
  })
  /*
  if (nt === password) {
    return cb(null, {nt: nt, code: '001'}, {message: 'Logged In Successfully'})
  } else {
    return cb(null, false, {message: 'Incorrect user name or password.'})
  }
  */
}))

passport.use(new JWTStrategy({
  jwtFromRequest: extractJWT.fromExtractors([extractJWT.fromAuthHeaderAsBearerToken(), extractJWT.fromHeader('sec-websocket-protocol')]),
  secretOrKey: PASSPORT_CONFIG.JWT_SECRET,
  jsonWebTokenOptions: PASSPORT_CONFIG.JWT_OPTIONS
}, (jwtPayload, cb) => {
  logger.debug('jwtPayload:', jwtPayload) 
  return cb(null, jwtPayload) // req.user will be set as jwtPayload in next step in passport.js internally.
}))

module.exports = PASSPORT_CONFIG