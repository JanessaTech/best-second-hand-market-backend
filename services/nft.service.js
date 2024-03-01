const logger = require("../helpers/logger");
const {NftError} = require('../routes/nft/NftErrors')
const nftDao = require('../dao/nft')
const userDao = require('../dao/user')
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const {ethers} = require('ethers')
const {convertToURL} = require('../helpers/utils')
const {chainParser} = require('../config/configParsers')

class NftService {

    async mint(nft) {
        logger.info('NftService.mint')
        try {
            const byTokenId = await nftDao.findOneByFilter({chainId:nft.chainId, address: nft.address, tokenId:nft.tokenId})
            if (byTokenId) {
                throw new NftError({key: 'nft_mint_duplication', params:[nft.chainId, nft.address, nft.tokenId], code: 400})
            }
            const created = await nftDao.create(nft)
            return created.toJSON()
        } catch (e) {
            logger.debug('Failed to save nft history ', nft)
            throw e
        }
    }

    async update(update) {
        logger.info('NftService.update')
        try {
            const nft = await nftDao.findByIdAndUpdate(update)
            if (!nft) {
                throw new NftError({key: 'nft_not_found', params:[update._id], code:404})
            }
            return nft.toJSON()
        } catch (e) {
            logger.debug('Failed to update the nft record by _id = ', update._id)
            throw e
        }
    }

    async findNFTById(id) {
        logger.info('NftService.findNFTById. id=', id)
        try {
            const nft = await nftDao.findOneByFilter({_id: id})
            if (!nft) {
                throw new NftError({key: 'nft_not_found', params:[id], code:404})
            }

            const fullNFT = await this.#addExtraInfo(nft)
            return fullNFT
        } catch (e) {
            logger.debug('Failed to find a full nft by id ', id)
            throw new NftError({key: 'nft_find_fullby_id_failed', params:[id, e]})
        }
    }

    /**
     * The method will have performance issue. using redis? to enhance it?
     * @param {*} userId 
     * @returns 
     */
    async queryNFTs(userId, page, limit, sortBy) {
        logger.info('NftService.queryNFTs. userId=', userId)
        const filter = await chainParser.getFilterByChains()
        const options = {page: page, limit: limit, sortBy: sortBy}
        let nfts = []
        const resultByFilter = await nftDao.queryByPagination(filter, options)
        if (resultByFilter && resultByFilter.results && resultByFilter.results.length > 0) {
            for (const nft of resultByFilter.results) {
                try {
                    const fullNft = await this.#addExtraInfo(nft)  //todo- should get extra info from cache saying redis instead
                    nfts.push(fullNft)
                } catch (e) {
                    logger.error(messageHelper.getMessage('nft_find_fullby_id_failed', nft._id, e)) // the code should not hit here. If that happened, pls fix it to make it not happen again
                }
            }
        }
        logger.info(`${resultByFilter.totalResults} nfts are returned`)
        return {nfts: nfts, page: resultByFilter.page, limit: resultByFilter.limit, totalPages: resultByFilter.totalPages, totalResults: resultByFilter.totalResults}
    }

    async queryNFTsForUser(userId, page, limit, sortBy) {
        logger.info('NftService.queryNFTsForUser userId=', userId)
        const user = await userDao.findOneBy({_id: userId})
        if (!user) {
            throw new NftError({key: 'nft_not_found', params:[userId], code: 404})
        }
        const filter = await chainParser.getFilterByChains(user.address)
        const options = {page: page, limit: limit, sortBy: sortBy}
        let nfts = []
        const resultByFilter = await nftDao.queryByPagination(filter, options)
        if (resultByFilter && resultByFilter.results && resultByFilter.results.length > 0) {
            for (const nft of resultByFilter.results) {
                try {
                    const fullNft = await this.#addExtraInfo(nft)  //todo- should get extra info from cache saying redis instead
                    nfts.push(fullNft)
                } catch (e) {
                    logger.error(messageHelper.getMessage('nft_find_fullby_id_failed', nft._id, e)) // the code should not hit here. If that happened, pls fix it to make it not happen again
                }
            }
        }
        logger.info(`${resultByFilter.totalResults} nfts are returned`)
        return {nfts: nfts, page: resultByFilter.page, limit: resultByFilter.limit, totalPages: resultByFilter.totalPages, totalResults: resultByFilter.totalResults}
    }

    async #addExtraInfo(nft) {
        const chain = chainParser.getChain(nft.chainId)
        const owner = await this.#getOwner(chain, nft)
        const uri = await this.#getNftUri(chain, nft.address, nft.tokenId)
        const chainName = chain.chainName
        const tokenStandard = chain.getContractInstance(nft.address)?.tokenStandard

        let jsonNFT = nft.toJSON()
        jsonNFT.owner = owner
        jsonNFT.uri = uri
        jsonNFT.url = convertToURL(uri)
        jsonNFT.chainName = chainName
        jsonNFT.tokenStandard = tokenStandard
        
        return jsonNFT
    }

    async #getOwner(chain, nft) {
        const owner = await this.#getNftOwner(chain, nft.address, nft.tokenId)
        const user = await userDao.findOneBy({address: owner})
        if (!user) {
            const errMsg = messageHelper.getMessage('user_not_found_address', owner)
            logger.error(errMsg) // code shouldn't hit here. Fix it if that happened
            throw new NftError({message: errMsg, code: 400})

        }
        return user.toJSON()
    }

    async #getNftOwner(chain, address, tokenId) {
        try {
            const contractInstance = chainParser.getContractInstance(chain, address)
            const owner = await contractInstance.getOwnerOfToken(tokenId)
            logger.debug('The owner of tokenId ', tokenId, ' is :', owner)
            if (owner === ethers.ZeroAddress) {
                throw new NftError({key: 'contract_token_not_found', params:[tokenId, chain.chainId, address], code:404})
            }
            return owner
        } catch (e) {
            const errMsg = messageHelper.getMessage('nft_failed_get_owner', tokenId, chain.chainId, address, e)
            logger.error(errMsg)
            throw new NftError({message: errMsg, code: 400})
        }
    }

    async #getNftUri(chain, address, tokenId) {
        try {
            const contractInstance = chainParser.getContractInstance(chain, address)
            const uri = await contractInstance.getUri(tokenId)
            logger.debug('The uri of tokenId ', tokenId, ' is :', uri)
            if (!uri) {
                throw new NftError({key: 'contract_invalid_uri', params:[tokenId, chain.chainId, address], code:400})
            }
            return uri
        } catch (e) {
            const errMsg = messageHelper.getMessage('nft_failed_get_uri', tokenId, chain.chainId, address, e)
            logger.error(errMsg)
            throw new NftError({message: errMsg, code: 400})
        }
    }
}

const nftService = new NftService()
module.exports = nftService