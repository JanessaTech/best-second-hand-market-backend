const logger = require("../helpers/logger");
const {NftError} = require('../routes/nft/NftErrors')
const nftDao = require('../dao/nft')
const {chains} = require('../contracts');
const messageHelper = require("../helpers/internationaliztion/messageHelper");

class NftService {
    #getChain(chainId) {
        const chain = chains.get(chainId)
        if (!chain) {
            const errMsg = messageHelper.getMessage('config_chain_not_found', chainId)
            logger.error(errMsg)
            throw new NftError({message: errMsg, code: 400})
        }
        return chain
    }

    #getContractInstance(chainId, address) {
        logger.debug('chainId = ', chainId, 'typeof chainId = ', typeof chainId)
        logger.debug('address = ', address, 'typeof address = ', typeof address)
        try {
            const chain = this.#getChain(chainId)
            const contractInstance = chain.getContractInstance(address)
            if(!contractInstance) {
                const errMsg = messageHelper.getMessage('config_contractInst_not_found', chainId, address)
                logger.error(errMsg)
                throw new NftError({message: errMsg, code: 400})
            }
            return contractInstance
        } catch (e) {
            throw e
        } 
    }

    async #getTokensFromChains() {
        let tokens = []
        for (const [chainId, chain] of chains) {
            const instances = chain.getAllContractInstances()
            for (const [address, instance] of instances) {
                try {
                    const tokenIds = await instance.getAllTokenIds()
                    tokens.push({chainId: chainId, address: address, tokenIds: tokenIds})
                } catch(e) {
                    logger.error(messageHelper.getMessage('contract_tokenIds_failed', chainId, address, e))
                    // we suppress the error to make loop continue 
                } 
            }
        }
        return tokens
    }

    async getNftOwner(chainId, address, tokenId) {
        try {
            const contractInstance = this.#getContractInstance(chainId, address)
            const owner = await contractInstance.getOwnerOfToken(tokenId)
            logger.debug('The owner of tokenId ', tokenId, ' is :', owner)
            return owner
        } catch (e) {
            const errMsg = messageHelper.getMessage('nft_failed_get_owner', tokenId, chainId, address, e)
            logger.error(errMsg)
            throw new NftError({message: errMsg, code: 400})
        }
    }

    async getNftUri(chainId, address, tokenId) {
        try {
            const contractInstance = this.#getContractInstance(chainId, address)
            const uri = await contractInstance.getUri(tokenId)
            logger.debug('The uri of tokenId ', tokenId, ' is :', uri)
            return uri
        } catch (e) {
            const errMsg = messageHelper.getMessage('nft_failed_get_uri', tokenId, chainId, address, e)
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
            const chain = this.#getChain(nft.chainId)
            const owner = await this.getNftOwner(nft.chainId, nft.address, nft.tokenId)
            const uri = await this.getNftUri(nft.chainId, nft.address, nft.tokenId)
            const chainName = chain.chainName
            const tokenStandard = chain.getContractInstance(nft.address)?.tokenStandard

            let jsonNFT = nft.toJSON()
            jsonNFT.owner = owner
            jsonNFT.uri = uri
            jsonNFT.chainName = chainName
            jsonNFT.tokenStandard = tokenStandard
            
            return jsonNFT
        } catch (e) {
            logger.debug('Failed to get a full nft by id ', id)
            throw e
        }
    }

    async getAllNFTsByUserId(userId) {
        logger.info('NftService.getAllNFTsByUserId. userId=', userId)
        const tokens = await this.#getTokensFromChains()
        for (const token of tokens) {
            logger.debug('token = ', token)
        }
    } 
}

const nftService = new NftService()
module.exports = nftService