const express = require('express')
const router = express.Router()
const controller = require('../../controllers/user.controller')
const initUserErrorHandlers = require('./userErrorHandlers')
const {validate} = require('../../middlewares')
const userSchema = require('../../helpers/schemas/user')

router.post('/register',  validate(userSchema.register), controller.register)
router.get('/:address', validate(userSchema.findUserByAddress), controller.findUserByAddress)
router.post('/login', validate(userSchema.loginByAddress), controller.loginByAddress)
router.post('/logout', validate(userSchema.logoutByAddress), controller.logoutByAddress)

initUserErrorHandlers(router)
module.exports = router