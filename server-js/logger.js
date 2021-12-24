const winston = require('winston');


const logger = winston.createLogger({
    //level: 'info',
    //format: winston.format.simple(),
    //defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            level: 'info',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        }),
    ],
});


   
  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
/* logger.add(new winston.transports.Console({
    format: winston.format.simple(),
})); */


module.exports = logger;