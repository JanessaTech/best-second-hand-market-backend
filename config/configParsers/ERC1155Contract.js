const logger = require('../../helpers/logger')
const {ethers} = require('ethers')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')
const {ConfigContractError} = require('./ConfigErrors')
const {hSet, hGet, hDel} = require('../../infra/redis/ops')
const userDao = require('../../db/dao/user')
const nftDao= require('../../db/dao/nft')
const orderDao = require('../../db/dao/order')
const cartDao = require('../../db/dao/cart')
const config = require('../configuration')
const ipfsDao = require('../../db/dao/ipfs')

module.exports = class ERC1155Contract {
    #chainId
    #address
    #abi
    #provider
    #tokenStandard
    #instance

    constructor(chainId, address, abi, provider, tokenStandard) {
        this.#chainId = chainId
        this.#address = address
        this.#abi = abi
        this.#provider = provider
        this.#tokenStandard = tokenStandard
        this.#instance = new ethers.Contract(address, abi, provider)

        // add some event listeners
        this.#instance.on('mint_tracer', async (to, tokenId, uri) => await this.mintListener(to, tokenId, uri, chainId, address))
        this.#instance.on('mintBatch_tracer', async (to, tokenIds, uris) => await this.mintBatchListener(to, tokenIds, uris, chainId, address))
        this.#instance.on('buy_tracer', async (from, to, ids) => await this.buyListener(from, to, ids, chainId, address))
        this.#instance.on('doSafeBuy_tracer', async (from, to, ids) => await this.doSafeBuyListener(from, to, ids, chainId, address))
        this.#instance.on('buyBatch_tracer', async (to, froms, idss) => await this.buyBatchListener(to, froms, idss, chainId, address))
        this.#instance.on('doSafeBuyBatch_tracer', async (to, froms, idss) => await this.doSafeBuyBatchListener(to, froms, idss, chainId, address))
    }

    get chainId() {
        return this.#chainId
    }

    get address() {
        return this.#address
    }

    get abi() {
        return this.#abi
    }

    get provider() {
        return this.#provider
    }

    get tokenStandard() {
        return this.#tokenStandard
    }

    get instance() {
        return this.#instance
    }

    async #saveNFT({owner, tokenId, ipfs, chainId, address}) {
        const user = await userDao.findOneByFilter({address: owner})
        if (!user) {
            const errMsg = messageHelper.getMessage('user_not_found_address', owner)
            logger.error(errMsg) // code shouldn't hit here. Fix it if that happened
            throw new ConfigContractError({message: errMsg, code: 400})
        }
        const byTokenId = await nftDao.findOneByFilter({chainId: chainId, address: address, tokenId: tokenId})
        if (byTokenId) {
            logger.warn(messageHelper.getMessage('nft_mint_duplication', chainId, address, tokenId))
            return
        }
        const fileName = ipfs.substring(ipfs.indexOf(`${config.multer.productFieldPrefix}__`))
        const ipfsByFileName = await ipfsDao.findOneByFilter({filename: fileName})
        if (!ipfsByFileName) {
            throw new ConfigContractError({key: 'nft_mint_ipfs_not_found', params:[fileName], code: 404})
        }
        const nft = {
            tokenId: tokenId,
            ipfs: ipfsByFileName._id,
            chainId: chainId,
            address: address
        }
        const created = await nftDao.create(nft)
        return created
    }

    async #buyNFTs(from, to, ids, chainId, address) {
        const userByFrom = await userDao.findOneByFilter({address: from})
        if (!userByFrom) {
            const errMsg = messageHelper.getMessage('user_not_found_address', from)
            logger.error(errMsg) // code shouldn't hit here. Fix it if that happened
            throw new ConfigContractError({message: errMsg, code: 400})
        }
        const userByTo = await userDao.findOneByFilter({address: to})
        if (!userByTo) {
            const errMsg = messageHelper.getMessage('user_not_found_address', to)
            logger.error(errMsg) // code shouldn't hit here. Fix it if that happened
            throw new ConfigContractError({message: errMsg, code: 400})
        }
        const toUpdates = await nftDao.queryAllByFilter({chainId: chainId, address: address, tokenId: {$in: ids}})
        const nftIds = toUpdates.map((nft) => nft._id)
        const prices = toUpdates.map((nft) => nft.price)
        if (nftIds.length !== ids.length) {
            throw Error('The length of ids is not equal to the length of nftIds') // the code shouldn't hit here
        }
        logger.debug('Contract.buyNFTs. Change the status of nfts to off. nftIds=', nftIds)
        await nftDao.updateMany({_id: {$in: nftIds}}, {$set: {status: config.NFTSTATUS.Off.description, price: 0}})
        logger.debug('Contract.buyNFTs. Delete carts: userId =', userByTo._id, ' nftIds=', nftIds)
        await cartDao.delete(userByTo._id, nftIds) // delete nfts in cart if neccesary
        const froms = Array(nftIds.length).fill(from)
        logger.debug('Contract.buyNFTs. Create orders in batch. userId=', userByTo._id, ' nftIds =', nftIds, ' froms =', froms, 'prices =', prices)
        await orderDao.createInBatch(userByTo._id, nftIds, froms, prices)
    }

    async mintListener(to, tokenId, uri, chainId, address) {
        logger.debug(`Contract.mintListener. Received from mint_tracer event: to =${to}  tokenId =${tokenId} uri =${uri} under chainId ${chainId} and address ${address}`)
        //update db
        const nft = {
            owner: to,
            tokenId : Number(tokenId),
            ipfs : uri,
            chainId: chainId,
            address: address,
        }
        try {
            const savedNft = await this.#saveNFT(nft)
            logger.debug(messageHelper.getMessage('listener_mint_nft_success', savedNft))
        } catch (err) {
            /**
             * to-do:  
             * 1. Report the err to compensator system which could try to save nft record several times
             * 2. Log err to db so that we could analyse why saving nft is failed and recovery data manually if neccessary
             */
            logger.error(messageHelper.getMessage('listener_mint_nft_failed', nft, to, err))
            throw err
        }

        //update cache
        try {
            const allTokenIds = await this.getAllTokenIds()
            await hSet(`${chainId}:${address}`, 'all_tokenids', allTokenIds.join(','))
            await hSet(`${chainId}:${address}`, `owner_${tokenId}`, to)
            const tokens = await this.tokensOfAddress(to)
            await hSet(`${chainId}:${address}`, to, tokens.join(','))
        } catch (err) {
            const errMsg = messageHelper.getMessage('listener_mint_cache_failed', to, tokenId, uri, chainId, address, err)
            logger.error(errMsg)
        }
    }

    async mintBatchListener(to, tokenIds, uris, chainId, address) {
        logger.debug(`Contract.mintBatchListener. Received from mint_batch event: to =${to}  tokenIds =${tokenIds} uris =${uris} under chainId ${chainId} and address ${address}`)
        //TBD
    }

    async buyListener(from, to, ids, chainId, address) {
        logger.debug(`Contract.buyListener. Received from buy_tracer event: from =${from} to =${to}  ids =${ids} under chainId ${chainId} and address ${address}`)
        //update db
        try {
            await this.#buyNFTs(from, to, ids.map((id) => Number(id)), chainId, address)
        } catch (err) {
            /**
             * to-do:  
             * 1. Report the err to compensator system which could try to do the same thing several times
             * 2. Log err to db so that we could analyse why buying nfts is failed and recovery data manually if neccessary
             */
            logger.error(messageHelper.getMessage('listener_buy_nft_failed', from, to, ids, chainId, address, err))
            throw err
        }
        //update cache
        try {
            await this.#updateCache(from, to, ids, chainId, address)
        } catch (err) {
            const errMsg = messageHelper.getMessage('listener_buy_cache_failed', from, to, ids, chainId, address, err)
            logger.error(errMsg)
        }
    }

    async doSafeBuyListener(from, to, ids, chainId, address) {
        logger.debug(`Contract.doSafeBuyListener. Received from doSafeBuy_tracer event: from =${from} to =${to}  ids =${ids} under chainId ${chainId} and address ${address}`)
        //TBD
    }

    async buyBatchListener(to, froms, idss, chainId, address) {
        logger.debug(`Contract.buyBatchListener. Received from buyBatch_tracer event: froms =${froms} to =${to}  idss =${idss} under chainId ${chainId} and address ${address}`)
        //update db

        for (let i = 0; i < froms.length; i++) {
            const from = froms[i]
            const ids = idss[i]
            try {
                await this.#buyNFTs(from, to, ids.map((id) => Number(id)), chainId, address)
            } catch (err) {
                /**
                 * to-do:  
                 * 1. Report the err to compensator system which could try to do the same thing several times
                 * 2. Log err to db so that we could analyse why buying nfts is failed and recovery data manually if neccessary
                 */
                logger.error(messageHelper.getMessage('listener_buy_nft_failed', from, to, ids, chainId, address, err))
                throw err
            }
        }

        //update cache
        try {
            for (let i = 0; i < idss.length; i++) {
                const from = froms[i]
                const ids = idss[i]
                await this.#updateCache(from, to, ids, chainId, address)
            }
        }
        catch (err) {
            const errMsg = messageHelper.getMessage('listener_buyBatch_cache_failed', froms, to, idss, chainId, address, err)
            logger.error(errMsg)
        }
    }

    async doSafeBuyBatchListener(to, froms, idss, chainId, address) {
        logger.debug(`Contract.doSafeBuyBatchListener. Received from doSafeBuyBatch_tracer event: froms =${froms} to =${to}  idss =${idss} under chainId ${chainId} and address ${address}`)
        //TBD
    }

    async getOwnerOfToken(tokenId) {
        logger.debug(messageHelper.getMessage('config_contract_get_owner', tokenId, this.#chainId, this.#address))
        const owner = await this.#instance.ownerOfToken(tokenId)
        logger.debug('The owner of tokenId ', tokenId, ' is :', owner)
        if (owner === ethers.ZeroAddress) {
            throw new ConfigContractError({key: 'config_contract_token_not_found', params:[tokenId, this.#chainId, this.#address], code:404})
        }
        return owner
    }

    async getAllTokenIds() {
        logger.debug(messageHelper.getMessage('config_contract_contract_get_alltokenIds', this.#chainId, this.#address))
        const tokenIds = await this.#instance.getAllTokenIds()
        logger.debug('Contract.getAllTokenIds. tokenIds:', tokenIds)
        return tokenIds.map((t) => Number(t))
    }

    async tokensOfAddress(address) {
        logger.debug(messageHelper.getMessage('config_contract_get_tokenIds_byAddress', address, this.#chainId, this.#address))
        const tokenIds = await this.#instance.tokensOfAddress(address)
        logger.debug('Contract.tokensOfAddress. tokenIds:', tokenIds)
        return tokenIds.map((t) => Number(t))
    }

    toString() {
        return `chainId = ${this.#chainId} \n address = ${this.#address}\n tokenStandard = ${this.#tokenStandard}\n abi = ${this.#abi}`
    }

    async #updateCache(from, to, ids, chainId, address) {
        logger.debug(`Contract.updateCache. from=${from}, to=${to}, ids=${ids}, chainId=${chainId}, address=${address}`)
        ids.forEach(async (id) => {
            await hSet(`${chainId}:${address}`, `owner_${id}`, to)
        })
        const tokensFrom = await this.tokensOfAddress(from)
        const tokensTo = await this.tokensOfAddress(to)
        if (!tokensFrom || tokensFrom.length === 0) {
            await hDel(`${chainId}:${address}`, from)
        } else {
            await hSet(`${chainId}:${address}`, from, tokensFrom.join(','))
        }
        await hSet(`${chainId}:${address}`, to, tokensTo.join(','))
    }
}