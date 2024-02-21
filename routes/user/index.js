const express = require('express')
const router = express.Router()
const controller = require('../../controllers/user.controller')
const initUserErrorHandlers = require('./userErrorHandlers')
const {validate} = require('../../middlewares')
const userSchema = require('../../helpers/schemas/user')


router.post('/register',  validate(userSchema.register), controller.register)
router.get('/:address', validate(userSchema.getUserByAddress), controller.getUserByAddress)
router.post('/login', validate(userSchema.loginByAddress), controller.loginByAddress)
router.post('/logout', validate(userSchema.logoutByAddress), controller.logoutByAddress)
// router.post('/login', validate(userSchema.login), controller.login)
// router.get('/:id', authenticate(userService),authorize(), validate(userSchema.getByUserId), controller.getUserById)
// router.put('/', authenticate(userService),authorize(), validate(userSchema.updateUser), controller.updateUser)

initUserErrorHandlers(router)
module.exports = router