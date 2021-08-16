import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routeLoader from '../routes';
import expressErrorHandlerMiddleware from 
    './middleware/expressErrorHandlerMiddleware';


function expressFactory(): Express {
    
    const app = express();

    // Developement only settings
    if (app.get('env') === 'development') {
        app.set('json spaces', 4); // Pretty Print JSON results
    }
    
    // Disable ETag system in Express for non-static GETs
    // Note that static etags in Express are always weak.
    // Set to 'strong' to enable.  This is a global setting.
    app.set('etag', false); // 'strong' - SHA1 Hash
    
    // Set our CORS policy
    app.use(cors());

    // Secure our service against various attacks
    app.use(helmet());
    
    // Use the built in body parser
    app.use(express.json());
    
    // Initialze all of our routes
    routeLoader(app);
    
    // Global error handler.  Ensure this is called last!
    app.use(expressErrorHandlerMiddleware);

    return app;
}


/**
 * An Express instance with configured routes and error handling.
 * 
 * @see expressErrorHandlerMiddleware for how this handles exceptions.
 * 
 * @remarks
 * Security is partially managed by **helmet**.
 */
const app: Express = expressFactory();
export default app;
