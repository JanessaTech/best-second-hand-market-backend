const logger = require('../helpers/logger')
const {sendSuccess} = require('../routes/reponseHandler')
const {IPFSError} = require('../routes/ipfs/IPFSErrors')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const ipfsService = require('../services/ipfs.service')

class IPFSController {
    async upload(req, res, next) {
        logger.info('IPFSController.upload')
        const product = {
            title: req.body.title,
            fileName: req?.file?.filename,
            filePath:  req?.file?.path,
            mimetype: req?.file?.mimetype,
            category: req.body.category,
            description: req.body.description
        }
        try {
            if (!req?.file) throw new IPFSError({key: 'ipfs_upload_no_file', code: 400})
            const payload = await ipfsService.upload(product)
            sendSuccess(res, messageHelper.getMessage('ipfs_upload_success', product?.fileName), {metadata: payload})
        } catch (e) {
            if (!(e instanceof IPFSError)) {
                const err = new IPFSError({key: 'ipfs_upload_failed', params: [product.fileName, e]})
                next(err)
            } else {
                next(e)
            }
        }
    }
}

const controller = new IPFSController()
module.exports = controller