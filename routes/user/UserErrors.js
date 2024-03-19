const BaseError = require('../base_errors/baseError')

class UserError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    UserError
}