const passport = require('passport')
const passportJWT = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/schemas/user')
require('dotenv').config()

const Strategy = passportJWT.Strategy
const params = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: function (req) {
    let token = null
    if (req && req.headers) {
      token = req.headers['authorization'] // req.get('authorization')
    }
    return token
  },
}

// LocalStrategy
passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ userName: username })
      .then((user) => {
        if (!user) {
          return done(null, false)
        }
        if (!user.validPassword(password)) {
          return done(null, false)
        }
        return done(null, user)
      })
      .catch((err) => done(err))
  }),
)

// JWT Strategy
passport.use(
  new Strategy(params, function (payload, done) {
    User.findOne({ _id: payload.user.id })
      .then((user) => {
        if (!user) {
          return done(new Error('User not found'))
        }
        return done(null, user)
      })
      .catch((err) => done(err))
  }),
)
