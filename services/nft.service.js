const logger = require("../helpers/logger");
const {NftError} = require('../routes/nft/NftErrors')
const nftDao = require('../dao/nft')
const userDao = require('../dao/user')
const likeDao = require('../dao/like')
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const {ethers} = require('ethers')
const {convertToURL} = require('../helpers/utils')
const {chainParser} = require('../config/configParsers')
const config = require('../config/configuration')

class NftService {

    async mint(nft) {
        logger.info('NftService.mint')
        try {
            const chain = chainParser.getChain(nft.chainId)
            await this.#getOwner(chain, nft)  // check if the owner of the token is a registered user
            const byTokenId = await nftDao.findOneByFilter({chainId:nft.chainId, address: nft.address, tokenId:nft.tokenId})
            if (byTokenId) {
                throw new NftError({key: 'nft_mint_duplication', params:[nft.chainId, nft.address, nft.tokenId], code: 400})
            }
            const created = await nftDao.create(nft)
            return created.toJSON()
        } catch (e) {
            logger.error('Failed to save nft history ', nft)
            if (!(e instanceof NftError)) {
                const err = new NftError({key: 'nft_mint_failed', params: [e]})
                throw err
            } else {
                throw e
            } 
        }
    }

    async update(updates) {
        logger.info('NftService.update')
        try {
            const filter = {_id: updates._id}
            const update = {}
            if (updates?.price) {
                update.price = updates.price
            }
            if (updates?.status) {
                update.status = updates.status
            }
            const option = {new: true}
            const nft = await nftDao.findOneAndUpdate(filter, update, option)
            if (!nft) {
                throw new NftError({key: 'nft_not_found', params:[updates._id], code:404})
            }
            return nft.toJSON()
        } catch (e) {
            logger.error('Failed to update the nft record by _id = ', updates._id)
            throw e
        }
    }

    async findNFTById(id, updateView = undefined) {
        logger.info('NftService.findNFTById. id=', id)
        try {
            const nft = updateView ? await nftDao.findOneByFilterWithUpdatedView({_id: id}) : await nftDao.findOneByFilter({_id: id})
            if (!nft) {
                throw new NftError({key: 'nft_not_found', params:[id], code:404})
            }
            const fullNFT = await this.#addExtraInfo(nft)
            return fullNFT
        } catch (e) {
            logger.error('Failed to find a full nft by id ', id)
            throw new NftError({key: 'nft_find_fullby_id_failed', params:[id, e]})
        }
    }

    /**
     * The method will have performance issue. using redis? to enhance it?
     * @param {*} userId 
     * @returns 
     */
    async queryNFTs(query) {
        logger.info('NftService.queryNFTs. query=', query)
        const filter = await chainParser.getFilterByChains({...query})
        const options = {page: query?.page, limit: query?.limit, sortBy: query?.sortBy}
        let nfts = []
        const resultByFilter = await nftDao.queryByPagination(filter, options)
        if (resultByFilter && resultByFilter.results && resultByFilter.results.length > 0) {
            nfts = await this.#addExtraInfoToRawNFTs(resultByFilter.results)
        }
        logger.info(`${resultByFilter.totalResults} nfts are returned`)
        return {nfts: nfts, page: resultByFilter.page, limit: resultByFilter.limit, totalPages: resultByFilter.totalPages, totalResults: resultByFilter.totalResults}
    }

    async queryNFTsForUser(userId, query) {
        logger.info('NftService.queryNFTsForUser userId=', userId)
        const user = await userDao.findOneByFilter({_id: userId})
        if (!user) {
            throw new NftError({key: 'user_not_found_id', params:[userId], code: 404})
        }
        const filter = await chainParser.getFilterByChains({owner: user.address, ...query})
        const options = {page: query?.page, limit: query?.limit, sortBy: query?.sortBy}
        let nfts = []
        const resultByFilter = await nftDao.queryByPagination(filter, options)
        if (resultByFilter && resultByFilter.results && resultByFilter.results.length > 0) {
            nfts = await this.#addExtraInfoToRawNFTs(resultByFilter.results)
        }
        logger.info(`${nfts.length} nfts are returned`)
        return {nfts: nfts, page: resultByFilter.page, limit: resultByFilter.limit, totalPages: resultByFilter.totalPages, totalResults: resultByFilter.totalResults}
    }

    async queryFavoriteNFTsForUser(userId, query) {
        logger.info('NftService.queryFavoriteNFTsForUser userId=', userId)
        const user = await userDao.findOneByFilter({_id: userId})
        if (!user) {
            throw new NftError({key: 'user_not_found_id', params:[userId], code: 404})
        }
        const likes = await likeDao.queryAllByFilter({userId:userId})
        const nftIds = likes.map((like) => like.nftId)
        const filter = await chainParser.getFilterByChains({...query, nftIds: nftIds})
        const options = {page: query?.page, limit: query?.limit, sortBy: query?.sortBy}
        let nfts = []
        const resultByFilter = await nftDao.queryByPagination(filter, options)
        if (resultByFilter && resultByFilter.results && resultByFilter.results.length > 0) {
            nfts = await this.#addExtraInfoToRawNFTs(resultByFilter.results)
        }
        logger.info(`${nfts.length} nfts are returned`)
        return {nfts: nfts, page: resultByFilter.page, limit: resultByFilter.limit, totalPages: resultByFilter.totalPages, totalResults: resultByFilter.totalResults}
    }

    async queryNFTsByIds(nftIds) {
        logger.info('NftService.queryNFTsByIds. nftIds = ', nftIds)
        const filter = await chainParser.getFilterByChains({nftIds: nftIds} )
        const rawNfts = await nftDao.queryAllByFilter(filter)

        let nfts = await this.#addExtraInfoToRawNFTs(rawNfts)
        return nfts
    }

    async countNFTsByAddress(address){
        logger.info('NftService.queryNFTsForUser. address = ', address)
        try {
            const filter = await chainParser.getFilterByChains({owner: address, status: config.NFTSTATUS.On.description})
            const count = await nftDao.countNfts(filter)
            return count
        } catch (e) {
            const errMsg = messageHelper.getMessage('nft_count_by_address_failed', address, e)
            logger.error(errMsg)
            throw new NftError({message: errMsg, code:400})
        }
    }

    async #addExtraInfoToRawNFTs(rawNfts) {
        let nfts = []
        for(const rawNft of rawNfts) {
            try {
                const fullNft = await this.#addExtraInfo(rawNft)
                nfts.push(fullNft)
            } catch (e) {
                logger.error(messageHelper.getMessage('nft_find_fullby_id_failed', rawNft._id, e)) // the code should not hit here. If that happened, fix it to make it not happen again
            }
        }
        return nfts
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
        const user = await userDao.findOneByFilter({address: owner})
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