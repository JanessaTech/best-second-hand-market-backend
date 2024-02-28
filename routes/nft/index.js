const express = require('express')
const router = express.Router()
const controller = require('../../controllers/nft.controller')
const initUserErrorHandlers = require('./nftErrorHandlers')
const {validate} = require('../../middlewares')
const nftSchema = require('../../helpers/schemas/nft')

router.post('/mint', validate(nftSchema.mint), controller.mint)
router.post('/update', validate(nftSchema.update), controller.update)
router.get('/', validate(nftSchema.queryNFTs) , controller.queryNFTs)
router.get('/users/:userId', validate(nftSchema.queryNftsForUser), controller.queryNftsForUser)
router.get('/:id', validate(nftSchema.getNftById), controller.getNftById)


initUserErrorHandlers(router)
module.exports = router


