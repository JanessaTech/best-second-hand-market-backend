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
            logger.error(messageHelper.getMessage('config_chainName_not_found', chainId))
        }
        return chainName
    }

    #getContractInstance(chainId, address) {
        const provider = providers.get(chainId)
        let contractInstance = undefined
        if (provider) {
            if (provider?.contracts) {
                const contract = provider.contracts.get(address)
                contractInstance = contract.contractInstance
            }
        }
        if(!contractInstance) {
            logger.error(messageHelper.getMessage('config_contractInst_not_found', chainId, address))
        }  
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
            logger.error(messageHelper.getMessage('config_tokenStandard_not_found', chainId, address))
        }
    }

    async getNftOwner(chainId, address, tokenId) {
        try {
            const contractInstance = this.#getContractInstance(chainId, address)
            if (contractInstance) {
                const owner = await contractInstance.ownerOfToken(tokenId)
                logger.info('The owner of tokenId ', tokenId, ' is :', owner)
                return owner
            }  
        } catch (e) {
            logger.error(messageHelper.getMessage('nft_failed_get_owner', tokenId, e))
        }
        return undefined 
    }

    async getNftUri(chainId, address, tokenId) {
        try {
            const contractInstance = this.#getContractInstance(chainId, address)
            if (contractInstance) {
                const uri = await contractInstance.getUri(tokenId)
                logger.info('The uri of tokenId ', tokenId, ' is :', uri)
                return uri
            }
        } catch (e) {
            logger.error(messageHelper.getMessage('nft_failed_get_uri', tokenId, e))
        }
        return undefined
    }

    async mint(nft) {
        logger.info('NftService.mint')
        try {
            const byTokenId = await nftDao.findByChainIdAddressTokenId(nft.chainId, nft.address, nft.tokenId)
            if (byTokenId) {
                throw new NftError({key: 'nft_mint_duplication', params:[nft.chainId, nft.address, nft.tokenId], code: 400})
            }
            return await nftDao.create(nft)
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
            return nft
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
                throw new NftError({key: 'nft_not_found', params:[update._id], code:404})
            }
            const owner = await this.getNftOwner(nft.chainId, nft.address, nft.tokenId)
            const uri = await this.getNftUri(nft.chainId, nft.address, nft.tokenId)
            const chainName = this.#getChainName(nft.chainId)
            const tokenStandard = this.#getTokenStandard(nft.chainId, nft.address)

            nft.owner = owner
            nft.uri = uri
            nft.chainName = chainName
            nft.tokenStandard = tokenStandard
            
            return nft
        } catch (e) {
            logger.debug('Failed to get a full nft by id ', id)
            throw e
        }
    }

    
}

const nftService = new NftService()
module.exports = nftService