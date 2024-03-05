const express = require('express')
const router = express.Router()
const controller = require('../../controllers/order.controller')
const initOrderErrorHandlers = require('./orderErrorHandlers')
const {validate} = require('../../middlewares')
const {orderSchema} = require('../schemas')

router.post('/', validate(orderSchema.add), controller.add)
router.post('/addInBatch', validate(likeSchema.addInBatch), controller.addInBatch)

initOrderErrorHandlers(router)
module.exports = router