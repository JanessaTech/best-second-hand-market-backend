const messages = require('../internationaliztion')

module.exports = {
    getMessage : (key, ...params) => {
        const local = 'en'  // to-do: we should get the value from client's browser
        let message = messages[local][key]

        for(let i = 0; i < params.length; i++) {
            const ph = `{${i}}`
            message = message.replaceAll(ph, params[i])
        }
        return message
    }
}