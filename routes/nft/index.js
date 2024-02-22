const express = require('express')
const router = express.Router()
const controller = require('../../controllers/nft.controller')
const initUserErrorHandlers = require('./nftErrorHandlers')
const {validate} = require('../../middlewares')
const nftSchema = require('../../helpers/schemas/nft')

router.post('/mint', controller.mint)

initUserErrorHandlers(router)
module.exports = router


