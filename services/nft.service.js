const logger = require("../helpers/logger");
const {NftError} = require('../routes/nft/NftErrors')
const {nftDao, userDao, likeDao, ipfsDao} = require('../db')
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const {convertToURL} = require('../helpers/httpHelper')
const {chainParser} = require('../config/configParsers')
const config = require('../config/configuration')

class NftService {

    async mint({tokenId, ipfs, chainId, address, status, price}) {
        logger.info('NftService.mint')
        let nft = undefined
        try {
            await this.#checkOwnerValid(chainId, address, tokenId)
            const byTokenId = await nftDao.findOneByFilter({chainId: chainId, address: address, tokenId: tokenId})
            if (byTokenId) {
                throw new NftError({key: 'nft_mint_duplication', params:[chainId, address, tokenId], code: 400})
            }
            const fileName = ipfs.substring(ipfs.indexOf('product__'))
            const ipfsByFileName = await ipfsDao.findOneByFilter({filename: fileName})
            if (!ipfsByFileName) {
                throw new NftError({key: 'nft_mint_ipfs_not_found', params:[fileName], code: 404})
            }
            nft = {
                tokenId: tokenId,
                ipfs: ipfsByFileName._id,
                chainId: chainId,
                address: address,
                status: status,
                price: price
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
            throw new NftError({key: 'nft_addextra_failed', params:[id, e]})
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
                logger.error(messageHelper.getMessage('nft_addextra_failed', rawNft._id, e)) // the code should not hit here. If that happened, fix it to make it not happen again
            }
        }
        return nfts
    }

    async #addExtraInfo(nft) {
        const chain = chainParser.getChain(nft.chainId)
        const chainName = chain.chainName
        const owner = await chainParser.getOwner(nft.chainId, nft.address, nft.tokenId)
        const user = await userDao.findOneByFilter({address: owner})
        if (!user) {
            const errMsg = messageHelper.getMessage('user_not_found_address', owner)
            logger.error(errMsg) // code shouldn't hit here. Fix it if that happened
            throw new NftError({message: errMsg, code: 400})
        }
        const uri = await chainParser.getNftUri(nft.chainId, nft.address, nft.tokenId)
        const tokenStandard = chainParser.getTokenStandard(nft.chainId, nft.address)

        let jsonNFT = nft.toJSON()
        jsonNFT.owner = user.toJSON()
        jsonNFT.uri = uri
        jsonNFT.url = convertToURL(uri)
        jsonNFT.chainName = chainName
        jsonNFT.tokenStandard = tokenStandard
        
        return jsonNFT
    }

    async #checkOwnerValid(chainId, address, tokenId) {
        const owner = await chainParser.getOwner(chainId, address, tokenId)
        const user = await userDao.findOneByFilter({address: owner})
        if (!user) {
            const errMsg = messageHelper.getMessage('user_not_found_address', owner)
            logger.error(errMsg) // code shouldn't hit here. Fix it if that happened
            throw new NftError({message: errMsg, code: 400})
        }
    }
}

const nftService = new NftService()
module.exports = nftService