const BaseError = require('../base_errors/baseError')

class CommentError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    CommentError
}