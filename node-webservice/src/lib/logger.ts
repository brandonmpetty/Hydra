/**
 * Creates a logger instance using the Winston logging framework.
 * https://github.com/winstonjs/winston#readme
 */
import winston from 'winston';


function loggerFactory(): winston.Logger {

    const levels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    };
    
    const level = () => {
        return (process.env.NODE_ENV || 'development') === 'development' ?
            'debug' : 'http';
    };
    
    const colors = {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'white',
    };
    
    winston.addColors(colors);
    
    const format = winston.format.combine(

        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.colorize({ all: true }),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
    );
    
    const transports = [

        // Be cautious with console logging PHI or other restricted data.
        // Docker, for example, may be recording it all to disk.
        new winston.transports.Console({
            format,
            handleExceptions: true
        }),

        // TODO: Replace transports.File with: https://github.com/winstonjs/winston-daily-rotate-file
        // Ensure JSON format.  We are logging errors for machines, not people.
        new winston.transports.File({
            filename: 'logs/error.log',
            format: winston.format.json(),
            handleExceptions: true,
            level: 'error',
        })
    ];
    
    const logger = winston.createLogger({
        level: level(),
        levels,
        transports,
        exitOnError: false // Uncaught exceptions will be logged.  Do not shut down.
    });

    return logger;
}


/**
 * A Winston Logger instance that can be used throughout the codebase.
 * 
 * Transports:
 * * Console - Will always log to console regardless of level
 * * File - Will log errors to the 'logs' folder, as JSON.
 * 
 * @example
 * ```ts
 * logger.info('Hello world');
 * logger.debug('Hello world');
 * ```
 * 
 * @remarks
 * Remember to log all errors for machines, not humans.  A script will be
 * required to process them later, so keep that in mind.
 */
const logger: winston.Logger = loggerFactory();
export default logger;
