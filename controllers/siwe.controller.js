const {sendSuccess} = require('../routes/reponseHandler')
const logger = require('../helpers/logger')
const messageHelper = require('../helpers/internationaliztion/messageHelper')
const { generateNonce, SiweMessage } = require('siwe') 
const {SiweError} = require('../routes/siwe/SiweError')

class SiweController {
    async nonce(req, res, next) {
        logger.info('SiweController.nonce')
        try {
            const payload = {nonce: generateNonce()}
            let message = messageHelper.getMessage('siwe_none')
            sendSuccess(res, message, payload)
        }catch(e) {
            next(e)
        }
    }
    async verify(req, res, next) {
        logger.info('SiweController.verify')
        try {
            const { message, signature } = req.body
            const siweMessage = new SiweMessage(message);
            try {
                await siweMessage.verify({ signature });
                const payload = {verify: true}
                let message = messageHelper.getMessage('siwe_verify_success')
                sendSuccess(res, message, payload)
            } catch(err) {
                throw new SiweError({key: 'siwe_verify_failed', code:400})
            }
        } catch(e) {
            next(e)
        }
    }

}

const controller = new SiweController()
module.exports = controller