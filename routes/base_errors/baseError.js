const messageHelper = require("../../helpers/internationaliztion/messageHelper")

module.exports = class BaseError extends Error {
    /**
     * We have 4 attributes in props:
     *  - message: The message which will be shown in json response
     *  - key: used to get error message from messages_en.js(or messages_zh.js)
     *  - params : provide parameters in the form of array if necessary for constructing error message
     *  - errors: set details of the error. You could set any data you want, eg: string, object or array etc
     *  - code: error code shown in json response
     *
     *  We seldomly use this class directly.
     *  We recommend you introducing a new class by inheriting this class, eg: NftError
     *  Here are several cases on how to use the inherited class(let's use NftError as an example):
     *   1. error = new NftError({message: 'your own custom message', code: 400})
     *   2. error = new NftError({message: 'your own custom message', errors:'dummy errors', code: 400})
     *   3. error = new NftError({key: 'account_register', params: ['demoAccount'], errors:'dummy errors', code: 400})
     *   4. error = new NftError({})
     *   5. error = new NftError()
     *
     *   We recommend #1, #2 and #3, especially #1,  key in error object will be NftError
     *   Check out about more usages in nft.service.js where we showcase 
     * 
     *
     * @param props see above
     */
    constructor(props) {
        super();
        if (props === undefined) { //fix bug: we cannot get key if we new AccountError like this: error = new AccountError()
            props = {}
        }
        this.key = props && props.key ? props.key : this.constructor.name
        this.errors = props.errors
        this.params = props.params || []
        this.code = props.code || 400
        this.message = props.message || messageHelper.getMessage(this.key, ...this.params)
    }
}