const logger = require("../helpers/logger")
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const config = require('../config/configuration')
const fs = require('fs')
const path = require('path')
const { NFTStorage, File } = require('nft.storage') 

class IPFSService {
    async upload(product) {
        logger.info('IPFSService. upload')
        const filePath = product?.filePath
        const mimetype = product?.mimetype
        logger.debug('filePath =', filePath)
        logger.debug('mimetype =', mimetype)
        const image = await this.#fileFromPath(filePath, mimetype) 
        logger.info('Reading file is done')
        const nft = {
            image,
            name: product?.title,
            description: product?.title,
            properties: {
                category:  product?.category
            }
        }
    
        const client = new NFTStorage({ token: config.nft_storage.API_KEY })
        const metadata = await client.store(nft)
        logger.info(messageHelper.getMessage('ipfs_upload_metadata', product.fileName, metadata))
        return {ipnft: metadata.ipnft, url: metadata.url, data: metadata.data}
    }

    async #fileFromPath(filePath, mimetype) {
        const content = await fs.promises.readFile(filePath)
        return new File([content], path.basename(filePath), { mimetype })
    }

}

const ipfsService = new IPFSService()
module.exports = ipfsService