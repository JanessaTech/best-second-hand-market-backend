const express = require('express')
const router = express.Router()
const controller = require('../../controllers/ipfs.controller')
const initiIPFSErrorHandlers = require('./ipfsErrorHandlers')
const {validate, uploadProduct} = require('../../middlewares')
const {ipfsSchema} = require('../schemas')
const config = require('../../config/configuration')

router.post('/', uploadProduct(config.multer.productFieldPrefix), validate(ipfsSchema.upload), controller.upload)

initiIPFSErrorHandlers(router)
module.exports = router