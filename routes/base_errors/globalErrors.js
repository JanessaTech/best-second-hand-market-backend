const BaseError = require('./baseError')

class UnSupportedAuthError extends BaseError {
    constructor(props) {
        super(props);
    }
}
class UnauthorizedError extends BaseError {
    constructor(props) {
        super(props);
    }
}

class UnmatchedTokenError extends BaseError{
    constructor(props) {
        super(props);
    }
}

/**
 * This is an example of how to add new global custom error class
 */
class GlobalDemoError extends BaseError {
    constructor(props) {
        super(props);
    }
}

module.exports = {
    UnSupportedAuthError,
    UnauthorizedError,
    UnmatchedTokenError,
    GlobalDemoError
}