const logger = require('../../helpers/logger')
const {OrderView} = require('../views')
const {OrderViewError} = require('../../routes/order/OrderErrors')
const messageHelper = require('../../helpers/internationaliztion/messageHelper')

class OrderViewDAO {
    async queryAllByFilter(filter) {
        const orderViews = await OrderView.find(filter)
        return orderViews
    }

    async queryByPagination(filter, options) {
        const orderViews = await OrderView.paginate(filter, options)
        return orderViews
    }
}

const orderViewDao = new OrderViewDAO()
module.exports = orderViewDao