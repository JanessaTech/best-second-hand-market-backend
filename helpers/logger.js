const winston = require("winston");
const {format} = require("winston");
const logLevel = getLogLevel(process.env.NODE_ENV)
const logger = winston.createLogger({
    level: logLevel,  // log levels are : error , warn, info, verbose, debug, silly. If we set te level to be info, logs which are error/warn/info will be printed out
    format: winston.format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.splat(),
        format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/app.log" }),
    ],
});

function getLogLevel(env) {
    switch (env) {
        case 'prod' : return 'info'
        case 'stage' : return 'info'
        case 'dev' : return 'debug'
        default: return 'info'
    }
}
module.exports = logger