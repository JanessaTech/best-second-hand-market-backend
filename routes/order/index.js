const express = require('express')
const router = express.Router()
const controller = require('../../controllers/order.controller')
const initOrderErrorHandlers = require('./orderErrorHandlers')
const {validate} = require('../../middlewares')
const {orderSchema} = require('../schemas')

router.post('/', validate(orderSchema.create), controller.create)
router.post('/batch', validate(orderSchema.createInBatch), controller.createInBatch)
router.get('/:userId', validate(orderSchema.queryOrdersByUserId), controller.queryOrdersByUserId)

initOrderErrorHandlers(router)
module.exports = router