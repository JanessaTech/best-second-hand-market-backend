const BaseError = require('../base_errors/baseError')

class BalanceError extends BaseError {
    constructor(props) {
        super(props)
    }
}

module.exports = {
    BalanceError
}