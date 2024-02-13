module.exports = {
    //account
    account_not_found : {code : 404},

    user_login_wrong_password: {code:400},
    user_not_found:{code:404},
    user_register_duplicated_name: {code: 404},

    //todo
    todo_not_found: {code:400},

    // global
    UnSupportedAuthError : {code : 401},
    UnauthorizedError : {code : 401},
    ValidationError: {code : 400},
    JsonWebTokenError: {code : 400},
    TokenExpiredError: {code : 400},
    UnmatchedTokenError: {code : 400},
    Error: {code: 500}
}