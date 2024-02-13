module.exports = class BaseError extends Error {
    /**
     * We have 3 attributes in props:
     *  - key: used to get error message from messages_en.js(or messages_zh.js)
     *  - errors: set details of the error. You could set any data you want, eg: string, object or array etc
     *  - params : provide parameters in the form of array if necessary for constructing error message
     *  - code: error code shown in json response
     *
     *  We seldom use this class directly.
     *  We recommend you introducing a new class by inheriting this class, eg: AccountError
     *  We have three ways to new this inherited class(let's use AccountError as an example):
     *   1. error = new AccountError({key: 'account_register', params: ['demoAccount'], errors:'dummy errors', code: 400})
     *   2. error = new AccountError({})
     *   3. error = new AccountError()
     *
     *   We recommend #1. For #2 and #3, key in error object will be AccountError
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
    }
}