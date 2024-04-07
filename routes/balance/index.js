const express = require('express')
const router = express.Router()
const controller = require('../../controllers/balance.controller')
const initBalanceErrorHandlers = require('./balanceErrorHandlers')
const {validate} = require('../../middlewares')
const {balanceSchema} = require('../schemas')

router.post('/', validate(balanceSchema.update), controller.update) 
router.get('/:userId', validate(balanceSchema.queryByUserId), controller.queryByUserId)

initBalanceErrorHandlers(router)
module.exports = router