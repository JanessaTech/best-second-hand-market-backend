const express = require('express')
const router = express.Router()
const controller = require('../../controllers/user.controller')
const initUserErrorHandlers = require('./userErrorHandlers')

router.post('/register', controller.register)
// router.post('/login', validate(userSchema.login), controller.login)
// router.get('/:id', authenticate(userService),authorize(), validate(userSchema.getByUserId), controller.getUserById)
// router.put('/', authenticate(userService),authorize(), validate(userSchema.updateUser), controller.updateUser)

initUserErrorHandlers(router)
module.exports = router