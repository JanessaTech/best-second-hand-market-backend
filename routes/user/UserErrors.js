const BaseError = require('../../helpers/errors/baseError')

class UserError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    UserError
}