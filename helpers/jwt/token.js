const jwt = require("jsonwebtoken")
module.exports = class Token {
    static generateToken(params) {
        return jwt.sign({
            id: params.id,
            name: params.name,
            roles: params.roles,
            email: params.email
        }, process.env.API_SECRET, {expiresIn: '18000s'})

    }
}