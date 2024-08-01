import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const customLevelOptions = {
  levels: {
    debug: 5,
    http: 4,
    info: 3,
    warning: 2,
    error: 1,
    fatal: 0
  },
  colors: {
    debug: 'white',
    http: 'cyan',
    info: 'blue',
    warning: 'yellow',
    error: 'magenta',
    fatal: 'red'
  }
};

winston.addColors(customLevelOptions.colors);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  winston.format.colorize({ colors: customLevelOptions.colors }),
  winston.format.printf((info) => {
    const message = typeof info.message === 'object' ? JSON.stringify(info.message, null, 2) : info.message;
    return `${info.timestamp} ${info.level}: ${message}`;
  })
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat
  }),
  new winston.transports.File({
    filename: 'errors.log',
    level: 'error',
    format: fileFormat
  })
];

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'PRODUCTION' ? 'info' : 'debug',
  levels: customLevelOptions.levels,
  transports
});

export const addLogger = (req, res, next) => {
  req.logger = logger;
  next();
};
