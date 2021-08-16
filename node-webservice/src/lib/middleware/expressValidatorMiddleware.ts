import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import HTTPException from '../errors/HTTPException';


/**
 * A validation Middleware for 'express-validator' checks.
 * Call this after your validation chain in your router in order to
 * process any validation errors found by your integrity checks.
 * 
 * @see https://express-validator.github.io/docs/
 *
 * @returns next() if valid, else HTTP 422 Exception
 */
const expressValidatorMiddleware = 
    (req: Request, res: Response, next: NextFunction): void => 
{
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    // We understand the call you are making, we just wont let you do it
    // due to the nature of your data.
    throw new HTTPException(422, `Errors: ${errors.array().toString()}`);
};

export default expressValidatorMiddleware;
