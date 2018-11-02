import express from 'express'
import passport from 'passport'
const jwtSecret = require('./passport-config').JWT_SECRET
import db from './db'
import sha512 from 'js-sha512'

const router = express.Router()
const jwt = require('jsonwebtoken')

router.post('/signup', (req, res, next) => {
  const {nt, password, verifiedPassword} = req.body
  if ( !nt || !password || !verifiedPassword || password !== verifiedPassword){
    res.status(422).json({error: 'Invalid input.'})
    return
  }

  const userModel = new db.UserModel()
  userModel.nt = nt
  userModel.passwordHash = sha512(password)
  userModel.createDt = new Date()
  userModel.save().then(user => {
    res.json(user)
  }).catch(err => {
    if ( err.name === 'MongoError' && err.code === 11000 ){
      res.status(409).json({error: 'User already exists.', detail: err.message})
    } else {
      res.status(500).json(err)
    }
  })
})

router.post('/login', (req, res, next) => {
  
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user: user
      })
    }

    req.login(user, {session: false}, (err) => {
      if (err) res.send(err)
      const token = jwt.sign(user, jwtSecret)
      return res.json({user, token})
    })
  })
  (req, res)
})

module.exports = router;