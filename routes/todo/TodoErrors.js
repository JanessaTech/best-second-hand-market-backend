const BaseError = require('../../helpers/errors/baseError')

class TodoError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    TodoError
}