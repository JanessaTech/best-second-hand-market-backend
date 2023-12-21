const express = require('express')
const router = express.Router()
const controller = require('../../controllers/account.controller')
const {accountSchema} = require('../../helpers/schemas')
const accountService = require('../../services/account.service')
const {validate, authenticate, authorize} = require('../../middlewares')
const initAccountErrorHandlers = require('./accountErrorHandlers')

router.post('/login', validate(accountSchema.login), controller.login)
router.post('/register', validate(accountSchema.register), controller.register)
router.get('/', authenticate(accountService),authorize(), controller.getAllAccounts)
router.get('/:id', authenticate(accountService), authorize(), validate(accountSchema.getByAccountId), controller.getAccountById)
router.put('/', authenticate(accountService),authorize(),validate(accountSchema.updateAccount), controller.updateAccount)
router.delete('/:id', authenticate(accountService), authorize(),validate(accountSchema.deleteAccount), controller.deleteAccountById)

initAccountErrorHandlers(router)

module.exports = router