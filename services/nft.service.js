const logger = require("../helpers/logger");
const {NftError} = require('../routes/nft/NftErrors')
const nftDao = require('../dao/nft')
const providers = require('../contracts');
const messageHelper = require("../helpers/internationaliztion/messageHelper");

class NftService {

    #getChainName(chainId) {
        let chainName = undefined
        const provider = providers.get(chainId)
        if (provider) {
            if (provider?.chainName) {
                chainName =  provider?.chainName
            }
        }
        if (!chainName) {
            const errMsg = messageHelper.getMessage('config_chainName_not_found', chainId)
            logger.error(errMsg)
            throw new NftError({message: errMsg, code: 400})
        }
        return chainName
    }

    #getContractInstance(chainId, address) {
        logger.debug('chainId = ', chainId, 'typeof chainId = ', typeof chainId)
        logger.debug('address = ', address, 'typeof address = ', typeof address)
        const provider = providers.get(chainId)
        let contractInstance = undefined
        if (provider) {
            if (provider?.contracts) {
                const contract = provider.contracts.get(address)
                contractInstance = contract?.contractInstance
            }
        }
        if(!contractInstance) {
            const errMsg = messageHelper.getMessage('config_contractInst_not_found', chainId, address)
            logger.error(errMsg)
            throw new NftError({message: errMsg, code: 400})
        }  
        return contractInstance
    }

    #getTokenStandard(chainId, address) {
        const provider = providers.get(chainId)
        let tokenStandard = undefined
        if (provider) {
            if (provider?.contracts) {
                const contract = provider.contracts.get(address)
                tokenStandard = contract.tokenStandard
            }
        }
        if (!tokenStandard) {
            const errMsg = messageHelper.getMessage('config_tokenStandard_not_found', chainId, address)
            logger.error(errMsg)
            throw new NftError({message: errMsg, code: 400})
        }
        return tokenStandard
    }

    async getNftOwner(chainId, address, tokenId) {
        try {
            const contractInstance = this.#getContractInstance(chainId, address)
            if (contractInstance) {
                const owner = await contractInstance.ownerOfToken(tokenId)
                logger.debug('The owner of tokenId ', tokenId, ' is :', owner)
                return owner
            }  
        } catch (e) {
            const errMsg = messageHelper.getMessage('nft_failed_get_owner', tokenId, chainId, address, e)
            logger.error(errMsg)
            throw new NftError({message: errMsg, code: 400})
        }
    }

    async getNftUri(chainId, address, tokenId) {
        try {
            const contractInstance = this.#getContractInstance(chainId, address)
            if (contractInstance) {
                const uri = await contractInstance.getUri(tokenId)
                logger.debug('The uri of tokenId ', tokenId, ' is :', uri)
                return uri
            }
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
            const owner = await this.getNftOwner(nft.chainId, nft.address, nft.tokenId)
            const uri = await this.getNftUri(nft.chainId, nft.address, nft.tokenId)
            const chainName = this.#getChainName(nft.chainId)
            const tokenStandard = this.#getTokenStandard(nft.chainId, nft.address)

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
        
    }

    
}

const nftService = new NftService()
module.exports = nftService