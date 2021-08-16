/**
 * Webservice Demo - Brandon M. Petty
 * 
 * The goal of this demo is to provide a well architected NodeJS webservice.
 */

import logger from './lib/logger';
import app from './lib/app';

const mode = process.env.NODE_ENV === 'production' ?
    'production' : 'development';

logger.info(`Starting Webservice - Mode(${mode})`);

// Instantiate an Express instance
const PORT = 3000;

// Open our port process all HTTP requests
const server = app.listen(PORT, () => {
    logger.info(`Webservice running on port: ${PORT}.`);
});

// Cleanly shutdown when we are told to.
process.on('SIGINT', () => {
    logger.info('SIGINT - Shutting down service');
    server.close(() => {
        logger.info('Service shutdown');
        process.exit(0);
    });
});
