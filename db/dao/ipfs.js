const logger = require('../../helpers/logger')
const {IPFS} = require('../models')
const {IPFSError} = require('../../routes/ipfs/IPFSErrors')

class IpfsDAO {
    async create(metadata, filename) {
        try {
            const ipfsDao = new IPFS({
                filename: filename,
                metadata: {
                    ipnft: metadata?.ipnft,
                    url: metadata?.url,
                    data: {
                        name: metadata?.data?.name,
                        description: metadata?.data?.description,
                        image: metadata?.data?.image,
                        properties: {
                            category: metadata?.data?.properties?.category
                        }
                    }
                } 
            })
            const savedIpfs = await ipfsDao.save()
            logger.debug('IpfsDAO.create. A new ipfs is saved successfully', savedIpfs)
            return savedIpfs
        } catch (err) {
            logger.error('Failed to save ipfs due to ', err)
            throw new IPFSError({key: 'ipfs_create_validiation_failed', params:[filename, err], errors: err.errors ? err.errors : err.message, code: 400})
        }
    }
}

const ipfsDao = new IpfsDAO()
module.exports = ipfsDao