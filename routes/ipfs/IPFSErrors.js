const BaseError = require('../base_errors/baseError')

class IPFSError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    IPFSError
}