const User = require('../models/user')
const express = require('express')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const users = require('../controllers/users')
const router = express.Router()

router.route('/register')
      .get(users.renderRegisterForm)
      .post(catchAsync(users.userRegister))

router.route('/login')
      .get(users.renderLoginForm)
      .post(passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.userLogin)
      
router.get("/logout", users.userLogout);

// router.get('/register', users.renderRegisterForm)
// router.post('/register', catchAsync(users.userRegister))
// router.get('/login', users.renderLoginForm)
// router.post('/login', passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.userLogin)
// router.get("/logout", users.userLogout);

module.exports = router
