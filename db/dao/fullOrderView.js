const logger = require('../../helpers/logger')
const {FullOrderView} = require('../views')
const {FullOrderViewError} = require('../../routes/order/OrderErrors')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')

class FullOrderViewDAO {
    async queryAllByFilter(filter) {
        const fullOrderViews = await FullOrderView.find(filter)
        return fullOrderViews
    }

    async queryByPagination(filter, options) {
        const fullOrderViews = await FullOrderView.paginate(filter, options)
        return fullOrderViews
    }
}

const fullOrderViewDao = new FullOrderViewDAO()
module.exports = fullOrderViewDao