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
    user_find_by_address:'Found an user by address {0}', 
    user_login_success: 'User login by address {0} successfully',
    user_logout_success: 'User logout by address {0} successfully',

    //nft
    nft_mint_success: 'Nft with tokenId {0} is minted successfully',
    nft_mint_failed: 'Failed to mint a new nft due to {0}',
    nft_mint_duplication: 'The nft with chainId {0} address {1} and tokenId {2} is already saved',
    nft_save_validation_failed: 'Failed to save a new nft record for the combination of chainId {0} address {1} and tokenId {2} due to validation failure',
    nft_update_success: 'The nft with id(_id) {0} is updated successfully',
    nft_not_found: 'The nft with id(_id) {0} is not found',
    nft_by_id_success: 'The nft with id(_id) {0} is found',
    nft_by_id_failed: 'Failed to find the nft with id(_id) {0} (userId = {1}) due to {2}',
    nft_failed_get_owner: 'Failed to get NFT owner by token id {0} for the combination of chainId {1} and address {2} due to {3}',
    nft_failed_get_uri: 'Failed to get NFT uri by token id {0} for the combination of chainId {1} and address {2} due to {3}',
    nft_query_all_success: 'Query all nfts by userId {0} successfully',
    nft_query_all_failed: 'Failed to query all nfts with userId = {0} due to {1}',
    nft_find_fullby_id_failed: 'Failed to find full nft with id(_id) {0} due to {1}',
    nft_query_for_user_success: 'Query nfts under the user with userId being {0} successfully',

    //config
    config_chain_not_found: 'The chain with chainId {0} is not found. Please check the correctness of config.chains in config.common.js',
    config_contractInst_not_found: 'The corresponding contract instance is not found by chainId {0} and address {1}. Please check the correctness of config.chains in config.common.js',
    config_tokenStandard_not_found: 'The tokenStandard is not found by chainId {0} and address {1}. Please check the correctness of config.chains in config.common.js',

    //contracts
    contract_get_tokenIds: 'Get getAllTokenIds under the combination of chainId {0} and address {1}',
    contract_token_not_found: 'Token {0} is not found in the contract under the combination of chainId {1} and address {2}',
    contract_invalid_uri: 'Invalid uri for token {0} in the contract under the combination of chainId {1} and address {2}',
    contract_read_failed: 'Failed to read contract due to {0}',
    contract_get_tokenIds_byAddress: 'Get tokenIds for owner {0} under the combination of chainId {1} and address {2}',
    
    //cart
    cart_add_success: 'Add nftId {0} for userId {1} successfully',
    cart_add_failed: 'Failed to add a new cart item(userId={0}, nftId={1}) due to {2}',
    cart_remove_success: 'Remove cart item with id {0} successfully',
    cart_query_user: 'Query the list of nft ids for user {0} successfully',
    cart_query_user_failed: 'Failed to query the list of nft ids for user {0} due to {1}',
    cart_add_validiation_failed: 'Failed to add a new cart item for userId {0} and nftId {1} due to {2}',
    cart_delete_failed: 'Failed to delete cart item by id {0} due to {1}',
    cart_isInCart_success: 'Get inCart status successfully for userId {0} and nftId {1}',
    cart_isInCart_failed:'Failed to get inCart status for userId {0} and nftId {1} due to {2}',
    cart_add_own_failed: 'You are not allowed to add a new cart item(userId={0}, nftId={1}) into cart because the nft(nftId={1}) already belongs to the nft owner(userId={0})',
    cart_already_added_failed: 'The nft(nftId={0}) is already in the user(userId={1})\'s cart',
    cart_nft_status_off: 'The nft(nftId={0}) with status being off is not allowed to be added into cart',
    cart_limit_reached: 'Failed to add nft(nftId={0}) to user(userId={1}). The user\'s cart has reached the limit({2})',

    //like
    like_increase_success:'Increase like by one for nftId {0} by userId {1} successfully',
    like_decrease_success:'Decrease like by one for nftId {0} by userId {1} successfully',
    like_count_success:'Return count for nftId {0} successfully',
    like_check_isLike_failed: 'Failed to check isLike for userId {0} and nftId {1} due to {2}',
    like_check_countLike_failed: 'Failed to checkcountLike for userId {0} and nftId {1} due to {2}',
    like_check_isLike: 'Check if nftId {0} is liked by userId {1} successfully',
    like_findOneAndUpdate_validiation_failed: 'Failed to findOneAndUpdate a like item for userId {0} and nftId {1} due to {2}',
    like_delete_failed: 'Failed to delete a like item for userId {0} and nftId {1} due to {2}',

    comment_nftId_or_parentId: 'You must provide either nftId or parentId, both are not allowed',
    comment_create_success: 'Created a new comment successfully for nftId {0} parentId {1} and userId {2}',
    comment_delete_success: 'Deleted comment by id(_id) {0} successfully',
    comment_delete_failed: 'Failed to delete comment by id(_id) {0}',
    comment_query_comments_success: 'Query comments by nftId {0} successfully',
    comment_create_failed: 'Failed to create a new comment for nftId {0} parentId {1} and userId {2} due to {3}',
    comment_create_validiation_failed: 'Failed to create a new comment for nftId {0} parentId {1} and userId {2} due to {3}',
    comment_query_comments_failed: 'Failed to query comments by nftId {0}',

    order_create_success: 'Created a new order for userId {0} nftId {1} and from {2}', 
    order_createInBatch_success: 'Created in batch of orders for userId {0} nftIds {1} and froms {2}', 
    order_create_invalid_nft: 'Failed to create a new order due to invalid nft(nftId={0})',
    order_create_invalid_user: 'Failed to create a new order due to invalid user(userId={0})',
    order_create_failed: 'Failed to create a new order for userId {0} nftId {1} and from {2} due to {3}',
    order_create_validiation_failed: 'Failed to create a new order for userId {0} nftId {1} and from {2} due to {3}',
    order_query_success: 'Query orders for user(userId={0}) successfully',

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