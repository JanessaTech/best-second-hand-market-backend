const yup = require('yup')

module.exports = {
    accountSchema : require('./account'),
    userSchema : require('./user'),
    todoSchema: require('./todo'),
    nftSchema: require('./nft'),
    cartSchema : require('./cart'),
    likeSchema: require('./like'),
    commentSchema: require('./comment')
}