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
    user_register_duplication_name: 'User name {0} is already registered',
    user_register_duplication_address: 'The address {0} is already registered',
    user_register_validiation_failed: 'Failed to register user {0} due to validation failure',
    user_not_found_address:'User is not found by address {0}',
    user_get_by_address:'Get an user by address {0}', 
    user_login_success: 'User login by address {0} successfully',
    user_logout_success: 'User logout by address {0} successfully',

    //nft
    nft_mint_success: 'Nft with tokenId {0} is minted successfully',
    nft_mint_duplication: 'The nft with chainId {0} address {1} and tokenId {2} is already saved',
    nft_save_validation_failed: 'Failed to save a new nft record for the combination of chainId {0} address {1} and tokenId {2} due to validation failure',
    nft_update_success: 'The nft with _id {0} is updated successfully',
    nft_not_found: 'The nft with _id {0} is not found',
    nft_by_id_success: 'The nft with _id {0} is found',
    nft_failed_get_owner: 'Failed to get NFT owner by token id {0} due to {1}',
    nft_failed_get_uri: 'Failed to get NFT uri by token id {0} due to {1}',

    //config
    config_chainName_not_found: 'The chainName by chainId {0} is not found. Please check the correctness of config.chains in config.global.js',
    config_contractInst_not_found: 'The corresponding contract instance is not found by chainId {0} and address {1}. Please check the correctness of config.chains in config.global.js',
    config_tokenStandard_not_found: 'The tokenStandard by chainId {0} and address {1} is not found. Please check the correctness of config.chains in config.global.js',
    
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