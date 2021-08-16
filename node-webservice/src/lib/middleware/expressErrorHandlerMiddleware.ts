import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import HttpException from '../errors/HTTPException';
import ODataParseError from '../errors/ODataParseError';

/**
 * An Express middleware for handling all uncaught exceptions in the promise 
 * chain.  It is specifically designed for appropriately handling
 * **HTTPException** errors, relieving the Controller layer of this burden.
 *
 * @returns Will call next(err) for all unmanaged exceptions.  Otherwise all
 * HTTPExceptions will return the desired response.
 */
const expressErrorHandlerMiddleware: ErrorRequestHandler = 
    (err: unknown, req: Request, res: Response, next: NextFunction): Response<any, any> =>
{
    if (err instanceof HttpException) {
        return res.status(err.status).json(err.message);
    } else
    if (err instanceof ODataParseError) {
        return res.status(400).json(err.message);
    }

    // 500
    next(err);
};

export default expressErrorHandlerMiddleware;