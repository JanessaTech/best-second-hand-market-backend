const express = require('express')
const router = express.Router()
const controller = require('../../controllers/cart.controller')
const initCartErrorHandlers = require('./cartErrorHandlers')
const {validate} = require('../../middlewares')
const cartSchema = require('../../helpers/schemas/cart')

router.post('/', validate(cartSchema.add), controller.add) 
router.delete('/:id', validate(cartSchema.remove), controller.remove)
router.get('/:userId', validate(cartSchema.queryByUser), controller.queryByUser)

initCartErrorHandlers(router)
module.exports = router