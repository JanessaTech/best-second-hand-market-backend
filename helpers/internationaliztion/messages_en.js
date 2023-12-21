const {JsonWebTokenError, TokenExpiredError} = require("jsonwebtoken");
module.exports = {
    account_login : 'Account {0} logined successfully(en)',
    account_register: 'Account {0} is registered successfully',
    account_login_wrong_password: 'login with wrong password',
    account_not_found: 'account {0} is not found',
    account_getAll: 'Get all accounts successfully',
    account_getById : 'Get account by id {0} successfully',
    account_update : 'Account {0} is updated successfully',
    account_deleteById : 'Account {0} is deleted successfully',

    //user
    user_register: 'User {0} is registered successfully',
    user_login : 'User {0} logined successfully(en)',
    user_getById : 'Get user by id {0} successfully',
    user_update : 'User {0} is updated successfully',
    user_login_wrong_password: 'User {0} logined with wrong password',
    user_not_found: 'User {0} is not found',
    user_register_duplicated_name: 'User {0} is already registered',

    //todo
    todo_not_found: 'Todo {0} for user {1} is not found',
    todo_getAll: 'Get all todos for user {0} successfully',
    todo_create: 'Todo {0} is created for user {1} successfully',
    todo_update : 'Todo {0} is updated for user {1} successfully',
    todo_deleteById : 'Todo {0} is deleted for user {1} successfully',

    // siwe
    siwe_none: 'Generate a random none successfully',
    siwe_verify_success: 'Verify siwe signature successfully',
    siwe_verify_failed: 'Failed to verify siwe signature',

    // global
    UnSupportedAuthError : 'We only support Bearer token in Authorization',
    UnauthorizedError : 'You do not have enough permission(s) to visit {0}',
    ValidationError: 'Request includes invalid parameter(s)',
    JsonWebTokenError: 'Invalid token',
    TokenExpiredError: 'Token expired',
    UnmatchedTokenError: 'Token for user {0} is not matched',
    Error: 'Internal server error'
}