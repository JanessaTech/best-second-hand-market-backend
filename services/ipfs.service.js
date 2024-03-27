const logger = require("../helpers/logger")
const messageHelper = require("../helpers/internationaliztion/messageHelper")
const config = require('../config/configuration')
const fs = require('fs')
const path = require('path')
const { NFTStorage, File } = require('nft.storage') 
const {ipfsDao} = require('../db')

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
        const raw_metadata = await client.store(nft)
        logger.info(messageHelper.getMessage('ipfs_upload_metadata', product.fileName, raw_metadata))
        
       //return {ipnft: metadata.ipnft, url: metadata.url, data: metadata.data}
       /*const metadata = {
        ipnft: 'bafyreifhvholyo7k35y4ckkjt4ywbyvteo2j52mdfux5n4gqdt7fq5z5ca',
        url: 'ipfs://bafyreifhvholyo7k35y4ckkjt4ywbyvteo2j52mdfux5n4gqdt7fq5z5ca/metadata.json',
        data: {
            name: 'my first book',
            description: 'my first book',
            image: 'ipfs://bafybeid6y74ulx4rmnum2z4poapjkgs2elbdnkroj6lsgxjw7cddx4asva/product__1711532700307.jpg',
            properties: {
                category: 'books'
            }
        }
       }
       return metadata
       */
       const metadata = {ipnft: raw_metadata.ipnft, url: raw_metadata.url, data: raw_metadata.data}
       await ipfsDao.create(metadata, product?.fileName)
       return metadata
    }

    async #fileFromPath(filePath, mimetype) {
        const content = await fs.promises.readFile(filePath)
        return new File([content], path.basename(filePath), { mimetype })
    }
}

const ipfsService = new IPFSService()
module.exports = ipfsService