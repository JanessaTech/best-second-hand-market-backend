const express = require('express')
const router = express.Router()
const controller = require('../../controllers/siwe.controller')
const initSiweErrorHandlers = require('./siweErrorHandlers')

router.get('/nonce', controller.nonce)
router.post('/verify', controller.verify)

initSiweErrorHandlers(router)
module.exports = router