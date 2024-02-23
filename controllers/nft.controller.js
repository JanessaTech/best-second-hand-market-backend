const logger = require('../helpers/logger')
const {sendSuccess} = require('../helpers/reponseHandler')
const nftService = require('../services/nft.service')
const messageHelper = require('../helpers/internationaliztion/messageHelper')


class NFTcontroller {
    /**
     * Get the list of nfts by conditions
     * The method is used when wallet is not connected
     */
    async getAllNfts(req, res, next) {

    }

    /**
     * Get a nft by id
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getNftById(req, res, next) {

    }

    /**
     * Query the list of nfts for an user based on conditions
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getMyNfts(req, res, next) {

    }

    /**
     * Mint a nft
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async mint(req, res, next) {
        logger.info('NFTcontroller.mint')
        try {
            const nft = {
                tokenId : req.body.tokenId,
                title : req.body.title,
                category: req.body.category,
                chainId: req.body.chainId,
                address: req.body.address,
                description: req.body.description,
                status: req.body.status,
                price: req.body.price
            }
            const payload = await nftService.mint(nft)
            sendSuccess(res, messageHelper.getMessage('nft_mint_success', payload.tokenId), {nft: payload})
        } catch (e) {
            next(e)
        }
    }

    /**
     * Update status or price for a nft by an user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async updateNft(req, res, next) {

    }
}

const controller = new NFTcontroller()
module.exports = controller