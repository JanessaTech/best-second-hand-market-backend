const express = require('express')
const router = express.Router()
const controller = require('../../controllers/ipfs.controller')
const initiIPFSErrorHandlers = require('./ipfsErrorHandlers')
const {validate, uploadProduct} = require('../../middlewares')
const {ipfsSchema} = require('../schemas')

router.post('/', uploadProduct('product'), validate(ipfsSchema.upload), controller.upload)

initiIPFSErrorHandlers(router)
module.exports = router