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
    user_not_found_id: 'User is not found by id(_id){0}',
    user_find_by_address:'Found an user by address {0}', 
    user_login_success: 'User login by address {0} successfully',
    user_logout_success: 'User logout by address {0} successfully',
    user_update_success: 'User(id={0}) is updated successfully with name {1}, intro {2} and profile {3}',
    user_update_failed: 'Failed to update user(id={0}) with name {1} and intro {2} due to {3}',
    user_overview_failed: 'Failed to get overview for user(id={0}) due to {1}',
    user_overview_success: 'Get the overview for user(id={0}) successfully',

    //nft
    nft_mint_success: 'Nft with tokenId {0} is minted successfully',
    nft_mint_failed: 'Failed to mint a new nft due to {0}',
    nft_mint_duplication: 'The nft with chainId {0} address {1} and tokenId {2} is already saved',
    nft_save_validation_failed: 'Failed to save a new nft record for the combination of chainId {0} address {1} and tokenId {2} due to validation failure',
    nft_update_success: 'The nft with id(_id) {0} is updated successfully',
    nft_not_found: 'The nft with id(_id) {0} is not found',
    nft_by_id_success: 'The nft with id(_id) {0} is found',
    nft_by_id_failed: 'Failed to find the nft with id(_id) {0} (userId = {1}) due to {2}',
    nft_query_all_success: 'Query all nfts by userId {0} successfully',
    nft_query_all_failed: 'Failed to query all nfts with userId = {0} due to {1}',
    nft_addextra_failed: 'Failed to add extra contract infor for nft with id(_id) {0} due to {1}',
    nft_query_for_user_success: 'Query nfts under the user with userId being {0} successfully',
    nft_query_favorite_for_user_success: 'Query the favorite nfts for the user with userId being {0} successfully',
    nft_updateMany_failed: 'Failed to execute updateMany due to {0}. filter={1}, update={2}, option={3}',
    nft_count_by_address_failed:'Failed to count nfts by address {0} due to {1}',

    //config
    config_chain_not_found: 'The chain with chainId {0} is not found. Please check the correctness of config.chains in config.common.js',
    config_contractInst_not_found: 'The corresponding contract instance is not found by chainId {0} and address {1}. Please check the correctness of config.chains in config.common.js',
    config_tokenStandard_not_found: 'The tokenStandard is not found by chainId {0} and address {1}. Please check the correctness of config.chains in config.common.js',
    config_chain_warmup:'All chains took {0} ms to warmup in total',
    config_chain_contract_read_failed: 'Failed to read contract due to {0}',

    //contracts
    config_contract_get_owner: 'Get owner for tokenId {0} under chainId {1} and address {2}',
    config_contract_token_not_found: 'Token {0} is not found in the contract for chainId {1} and address {2}',
    config_contract_get_uri: 'Get uri for tokenId {0} under chainId {1} and address {2}',
    config_contract_invalid_uri: 'Invalid uri for token {0} in the contract for chainId {1} and address {2}',
    config_contract_contract_get_alltokenIds: 'Get getAllTokenIds for chainId {0} and address {1}',
    config_contract_get_tokenIds_byAddress: 'Get tokenIds for owner {0} for chainId {1} and address {2}',
   
    // contract cache
    config_contract_cache_owner: 'Cache owner {0} for tokenId {1} under chainId {2} and address {3}',
    config_contract_cache_uri: 'Cache uri {0} for tokenId {1} under chainId {2} and address {3}',
    config_contract_cache_alltokenIds: 'Cache all tokenIds {0} for chainId {1} and address {2}',
    config_contract_cache_tokens: 'Cache tokens {0} for owner {1} under chainId {2} and address {3}',
    config_contract_cache_warmup: 'Cacheable contract under chainId {0} and address {1} took {2} ms to warm up',
    config_contract_cache_clean_failed: 'Failed to clean up cache under chainId {0} and address {1} due to {2}',

    //cart
    cart_add_success: 'Add nftId {0} for userId {1} successfully',
    cart_add_failed: 'Failed to add a new cart item(userId={0}, nftId={1}) due to {2}',
    cart_remove_success: 'Remove cart item by userId {0} and nftId {1} successfully',
    cart_query_user: 'Query the list of nft ids for user {0} successfully',
    cart_query_user_failed: 'Failed to query the list of nft ids for user {0} due to {1}',
    cart_add_validiation_failed: 'Failed to add a new cart item for userId {0} and nftId {1} due to {2}',
    cart_delete_failed: 'Failed to delete cart item by userId {0} and nftId {1} due to {2}',
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
    comment_create_success: 'Created a new comment successfully for nftId {0} parentId {1} and user {2}',
    comment_delete_success: 'Deleted comment by id(_id) {0} successfully',
    comment_delete_failed: 'Failed to delete comment by id(_id) {0}',
    comment_query_comments_success: 'Query comments by nftId {0} successfully',
    comment_create_failed: 'Failed to create a new comment for nftId {0} parentId {1} and user {2} due to {3}',
    comment_create_validiation_failed: 'Failed to create a new comment for nftId {0} parentId {1} and user {2} due to {3}',
    comment_query_by_nftId_failed: 'Failed to query comments by nftId {0} due to {1}',

    order_create_success: 'Created a new order for userId {0} nftId {1} and from {2}', 
    order_createInBatch_success: 'Created orders in batch for userId {0} nftIds {1} and froms {2}', 
    order_create_invalid_nft: 'Failed to create a new order due to invalid nft(nftId={0})',
    order_create_invalid_user: 'Failed to create a new order due to invalid user(userId={0})',
    order_create_failed: 'Failed to create a new order for userId {0} nftId {1} and from {2} due to {3}',
    order_create_validiation_failed: 'Failed to create a new order for userId {0} nftId {1} and from {2} due to {3}',
    order_query_success: 'Query orders for user(userId={0}) successfully',
    order_createInBatch_failed:'Failed to create orders in batch for userId {0} nftIds {1} and froms {2} due to {3}', 
    order_createInBatch_filter_error: 'The length of filteredNftIds filteredFroms and prices are not the same.',
    order_createInBatch_invalid_arrays:'nftIds and froms shoud have the same length',
    order_query_by_userId_failed: 'Failed to query orders by userId {0} due to {1}',
    order_count_by_userId_failed: 'Failed to count orders by userId {0} due to {1}',
    order_addextra_failed: 'Failed to add extra contract info for order {0} due to {1}',
    
    // siwe
    siwe_none: 'Generate a random none successfully',
    siwe_verify_success: 'Verify siwe signature successfully',
    siwe_verify_failed: 'Failed to verify siwe signature',

    //redis
    redis_hSet_failed: 'Failed to add/update value {2} into redis for key {0} and field {1} due to {3}',
    redis_hDel_failed: 'Failed to delete item for key {0} and field {1} due to {2}',
    redis_hGet_failed: 'Failed to get item for key {0} and field {1} due to {2}',
    redis_hKeys_failed: 'Failed to get fields by key {0} due to {1}',


    //listeners
    listener_mint_cache_failed: 'Failed to update cache when mint: to={0}, tokenId={1}, uri={2}, chainId={3}, address={4}, err={5}',
    listener_buy_cache_failed: 'Failed to update cache when buy: from={0}, to={1}, ids={2}, chainId={3}, address={4}, err={5}',
    listener_buyBatch_cache_failed: 'Failed to update cache when buyBatch: froms={0}, to={1}, idss={2}, chainId={3}, address={4}, err={5}',

    // global
    UnSupportedAuthError : 'We only support Bearer token in Authorization',
    UnauthorizedError : 'You do not have enough permission(s) to visit {0}',
    ValidationError: 'Request includes invalid parameter(s)',
    JsonWebTokenError: 'Invalid token',
    TokenExpiredError: 'Token expired',
    UnmatchedTokenError: 'Token for user {0} is not matched',
    Error: 'Internal server error'
}