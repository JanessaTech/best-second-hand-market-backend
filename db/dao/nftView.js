const logger = require('../../helpers/logger')
const {NftView} = require('../views')
const {NftError} = require('../../routes/nft/NftErrors')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')

class NftViewDAO {

    async findOneByFilter(filter) {
        const nftView = await NftView.findOne(filter)
        return nftView
    }

    async queryAllByFilter(filter) {
        const nftViews = await NftView.find(filter)
        return nftViews
    }

    async queryByPagination(filter, options) {
        const nftViews = await NftView.paginate(filter, options)
        return nftViews
    }

    async countNfts(filter) {
        const count = await NftView.countDocuments(filter)
        return count
    }
}

const nftViewDao = new NftViewDAO()
module.exports = nftViewDao