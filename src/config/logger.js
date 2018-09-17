//@logger
const winston = require('winston')
const logger = winston.createLogger({
   level: 'info',
   format: winston.format.json(),
   transports: [
     new winston.transports.File({ filename: 'error.log', level: 'error' })
   ]
 });
process.on('uncaughtException', (err) => {
   logger.error(err.message, err)
})

 if (process.env.NODE_ENV !== 'production') {
   logger.add(new winston.transports.Console({
     format: winston.format.simple()
   }));
 }

 module.exports = logger;