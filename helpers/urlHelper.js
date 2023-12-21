const urls = require('../config/urls')
function getRoles(originalUrl) {
    for(let prop in urls) {
        let key = prop
        let value = urls[key]
        let matched = originalUrl.match(key)
        if (matched) return value
    }
    return []
}
module.exports = {
    getRoles
}