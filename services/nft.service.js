const logger = require("../helpers/logger");
const {NftError} = require('../routes/nft/NftErrors')
const nftDao = require('../dao/nft')
const userDao = require('../dao/user')
const {chains} = require('../contracts')
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const {ethers} = require('ethers')
const {convertToURL} = require('../helpers/utils')

class NftService {
    #getChain(chainId) {
        logger.debug('chainId = ', chainId, 'typeof chainId = ', typeof chainId)
        const chain = chains.get(chainId)
        if (!chain) {
            const errMsg = messageHelper.getMessage('config_chain_not_found', chainId)
            logger.error(errMsg)
            throw new NftError({message: errMsg, code: 400})
        }
        return chain
    }

    #getContractInstance(chain, address) {
        logger.debug('address = ', address, 'typeof address = ', typeof address)
        try {
            const contractInstance = chain.getContractInstance(address)
            if(!contractInstance) {
                const errMsg = messageHelper.getMessage('config_contractInst_not_found', chain.chainId, address)
                logger.error(errMsg)
                throw new NftError({message: errMsg, code: 400})
            }
            return contractInstance
        } catch (e) {
            throw e
        } 
    }

    async #getOwner(chain, nft) {
        const owner = await this.#getNftOwner(chain, nft.address, nft.tokenId)
        const user = await userDao.findByAddress(owner)
        if (!user) {
            const errMsg = messageHelper.getMessage('user_not_found_address', owner)
            logger.error(errMsg) // code shouldn't hit here. Fix it if that happened
            throw new NftError({message: errMsg, code: 400})

        }
        return user.toJSON()
    }

    async #addExtraInfo(nft) {
        const chain = this.#getChain(nft.chainId)
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

    async #getNftOwner(chain, address, tokenId) {
        try {
            const contractInstance = this.#getContractInstance(chain, address)
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
            const contractInstance = this.#getContractInstance(chain, address)
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

    async mint(nft) {
        logger.info('NftService.mint')
        try {
            const byTokenId = await nftDao.findByChainIdAddressTokenId(nft.chainId, nft.address, nft.tokenId)
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

    async getNFTById(id) {
        logger.info('NftService.getFullNFTById. id=', id)
        try {
            const nft = await nftDao.findById(id)
            if (!nft) {
                throw new NftError({key: 'nft_not_found', params:[id], code:404})
            }

            const fullNFT = await this.#addExtraInfo(nft)
            return fullNFT
        } catch (e) {
            logger.debug('Failed to get a full nft by id ', id)
            throw e
        }
    }

    async #getFilterByChains() {
        let merged = []
        for (const [chainId, chain] of chains.entries()) {
            if (chain.getAllContractInstances()) {
                for(const [address, instance] of chain.getAllContractInstances()) {
                    try {
                        const tokenIds = await instance.getAllTokenIds()
                        if (tokenIds && tokenIds.length > 0) {
                            merged.push({$and : [{chainId: chainId}, {address: address}, {tokenId: {$in: tokenIds}}]})
                        }
                    }catch (e) {
                        logger.error(messageHelper.getMessage('contract_read_failed', e))
                    }
                    
                }
            }
        }
        const filter = merged.length > 0 ? {$or: merged} : {_id: -1} // we return empty if all of chains are not readable
        logger.debug('filter = ', filter)
        return filter
    }

    /**
     * The method will have performance issue. using redis? to enhance it?
     * @param {*} userId 
     * @returns 
     */
    async queryNFTs(userId, page, limit, sortBy) {
        logger.info('NftService.getAllNFTsByUserId. userId=', userId)
        const filter = await this.#getFilterByChains()
        const options = {page: page, limit: limit, sortBy: sortBy}
        let nfts = []
        const resultByFilter = await nftDao.findBy(filter, options)
        if (resultByFilter && resultByFilter.results && resultByFilter.results.length > 0) {
            for (const nft of resultByFilter.results) {
                try {
                    const fullNft = await this.#addExtraInfo(nft)  //todo- should get extra info from cache saying redis instead
                    nfts.push(fullNft)
                } catch (e) {
                    logger.error(messageHelper.getMessage('nft_get_full_failed', nft._id, e)) // the code should not hit here. If that happened, pls fix it to make it not happen again
                }
            }
        }
        logger.info(`${resultByFilter.totalResults} nfts are returned`)
        return {nfts: nfts, page: resultByFilter.page, limit: resultByFilter.limit, totalPages: resultByFilter.totalPages, totalResults: resultByFilter.totalResults}
    } 
}

const nftService = new NftService()
module.exports = nftService