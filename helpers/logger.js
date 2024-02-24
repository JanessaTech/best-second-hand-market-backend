const winston = require("winston")
const {format} = require("winston")
const logLevel = getLogLevel(process.env.NODE_ENV)

const isJson = (obj) => {
    return obj !== undefined && obj !== null && obj.constructor === Object;
}

const customFormat = {
    transform(info) {
        const { timestamp, message } = info;
        const level = info[Symbol.for('level')];
        const others = info[Symbol.for('splat')];
        const args = others? others.map( e => isJson(e) ? '\n' + JSON.stringify(e, null, 4) + '\n' : e).join(' ') : others
        info[Symbol.for('message')] = args?  `${timestamp}  ${level}: ${message} ${args}` :  `${timestamp}  ${level}: ${message}`;
        return info;
    }
}
const logger = winston.createLogger({
    level: logLevel,  // log levels are : error , warn, info, verbose, debug, silly. If we set te level to be info, logs which are error/warn/info will be printed out
    format: winston.format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        //format.splat(),
        //format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
        customFormat
    ),
    transports: [
        new winston.transports.Console({silent: process.env.JEST_ENABLED === 'yes'}),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
});

function getLogLevel(env) {
    switch (env) {
        case 'prod' : return 'debug'
        case 'stage' : return 'debug'
        case 'dev' : return 'debug'
        default: return 'info'
    }
}
module.exports = logger