const BaseError = require('../../helpers/errors/baseError')

class CommentError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    CommentError
}