const express = require('express')
const router = express.Router()
const controller = require('../../controllers/nft.controller')
const initNftErrorHandlers = require('./nftErrorHandlers')
const {validate} = require('../../middlewares')
const {nftSchema} = require('../schemas')

router.post('/mint', validate(nftSchema.mint), controller.mint)
router.post('/update', validate(nftSchema.update), controller.update)
router.get('/:id', validate(nftSchema.findNFTById), controller.findNFTById)
router.get('/', validate(nftSchema.queryNFTs) , controller.queryNFTs)
router.get('/users/:userId', validate(nftSchema.queryNFTsForUser), controller.queryNFTsForUser)
router.get('/favorite/:userId', validate(nftSchema.queryFavoriteNFTsForUser), controller.queryFavoriteNFTsForUser)

initNftErrorHandlers(router)
module.exports = router


