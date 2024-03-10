const yup = require('yup')

module.exports = {
    accountSchema : require('./account'),
    userSchema : require('./user'),
    nftSchema: require('./nft'),
    cartSchema : require('./cart'),
    likeSchema: require('./like'),
    commentSchema: require('./comment'),
    orderSchema: require('./order')
}