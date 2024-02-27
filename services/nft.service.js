const logger = require("../helpers/logger");
const {NftError} = require('../routes/nft/NftErrors')
const nftDao = require('../dao/nft')
const {chains} = require('../contracts')
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const {ethers} = require('ethers')

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

    async #addExtraInfo(nft) {
        const chain = this.#getChain(nft.chainId)
        const owner = await this.#getNftOwner(chain, nft.address, nft.tokenId)
        const uri = await this.#getNftUri(chain, nft.address, nft.tokenId)
        const chainName = chain.chainName
        const tokenStandard = chain.getContractInstance(nft.address)?.tokenStandard

        let jsonNFT = nft.toJSON()
        jsonNFT.owner = owner
        jsonNFT.uri = uri
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

    async getFullNFTById(id) {
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

    /**
     * The method will have performance issue. using redis? to enhance it?
     * @param {*} userId 
     * @returns 
     */
    async getAllNFTsByUserId(userId) {
        logger.info('NftService.getAllNFTsByUserId. userId=', userId)
        let res = []
        const nfts = await nftDao.findBy({})
        if (nfts && nfts.length > 0) {
            for (const nft of nfts) {
                try {
                    const fullNft = await this.#addExtraInfo(nft)
                    res.push(fullNft)
                } catch (e) {
                    logger.error(messageHelper.getMessage('nft_get_full_failed', nft._id, e))
                }
            }
        }
        return res
    } 
}

const nftService = new NftService()
module.exports = nftService