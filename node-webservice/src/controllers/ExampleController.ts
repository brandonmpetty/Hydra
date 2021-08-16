import { Request, Response } from 'express';
import CRUDController from '../lib/crud/CRUDController';
import ExampleServiceInterface from '../services/ExampleServiceInterface';


/**
 * ExampleController extends CRUDController to support root path GET access.
 * By removing the need to create boilerplate CRUD operations, your code
 * should be greatly simplified.
 * 
 * @remarks
 * In this example the results are highly OData dependant.
 */
export default class ExampleController extends CRUDController
{
    constructor(exampleService: ExampleServiceInterface) {
        super(exampleService);
    }

    /**
     * Processes all root requests with optional OData query parameters.
     * 
     * @example
     * Returning an Array of model objects:
     * ```
     * /user?$select=firstName,lastName
     * ```
     * 
     * @example
     * Returning an aggregation Object:
     * ```
     * /user?$apply=aggregate(Amount with min, Amount with max)
     * ```
     * 
     * @example
     * Returning a the count Number:
     * ```
     * /user?$count
     * ```
     * 
     * @remarks
     * The OData parser is extremely limited and for demo purposes only.
     * 
     * @param request   - Standard
     * @param response  - Standard
     * @returns 200 Array, Object, or Number depending on OData
     */
    async root(request: Request, response: Response): Promise<any> {

        return (this.service as ExampleServiceInterface).root(request.query)
            .then((results: any) => {

                return response.status(200).json(results);
            });
    }
}