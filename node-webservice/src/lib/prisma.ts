import { PrismaClient } from '@prisma/client';
import logger from './logger';


function prismaFactory(): PrismaClient {
    
    const prisma = new PrismaClient({
        log: [
            {
                emit: 'event',
                level: 'query',
            },
            {
                emit: 'event',
                level: 'error',
            },
        ],
    });
    
    prisma.$on('error', (e) => {
        // Note: Do not log to the DB if the DB is down.
        logger.error(`Database Error: ${e}`);
    });
    
    prisma.$on('query', (e) => {
        logger.debug(`Query: ${e.query}`);
    });

    return prisma;
}


/**
 * A Prisma ORM instance allowing access to our entire schema.
 * 
 * @see /prisma/schema.prisma - The Prisma schema configuration.
 * 
 * @remarks
 * To regenerate the Prisma client with the latest schema updates:
 * ```
 * npx prisma generate
 * ```
 */
const prisma: PrismaClient = prismaFactory();
export default prisma;