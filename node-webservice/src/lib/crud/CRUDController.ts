import { Request, Response } from 'express';
import CRUDServiceInterface from './CRUDServiceInterface';


/**
 * CRUDController allows a derived class to instantly support all
 * HTTP CRUD operations for a <u>specific</u> record.
 * 
 * This base controller supports limited **OData** support and
 * **If-Unmodified-Since** mid-air-collision avoidance.
 */
export default class CRUDController
{
    protected service: CRUDServiceInterface;
    protected readonly LastModified: string = 'Last-Modified';
    protected readonly IfUnmodifiedSince: string = 'If-Unmodified-Since';


    constructor(service: CRUDServiceInterface) {

        this.service = service;
    }

    /**
     * Reads a specific record, usually on a route like **GET /:id**.
     * It supports the following OData query parameters:
     * * $select
     * * $extend
     * 
     * @example
     * Filtering through only the desired properties:
     * ```
     * /user?$select=firstName,lastName
     * ```
     * 
      @example
     * Expanding properties with foreign relationships:
     * ```
     * /user?$expand=permissions
     * ```
     * 
     * If the Model contains an 'updatedAt' property, the 
     * **Last-Modified** header will be set.
     * 
     * @remarks
     * This class is concerned with mid-air-collision avoidance, not
     * caching.  Hence **If-Modified-Since** logic is not in place.
     * For caching, enable and use **ETags**.
     * 
     * @param request   - Standard
     * @param response  - Standard
     * @returns 200, The specific object as JSON
     */
    async get(request: Request, response: Response): Promise<Record<string, any>> {

        return this.service.read(+request.params.id, request.query as Record<string, string>)
            .then((result: Record<string, any>) => {

                if ('updatedAt' in result) {
                    response.setHeader(this.LastModified, (new Date(result.updatedAt)).toUTCString());
                }
                
                return response.status(200).json(result);
            });
    }

    /**
     * Upserts a record, usually on a route like **PUT /:id**.
     * If the record exists, it will be updated.  If not, it will be created.
     * For a more dynamic approach specific to updating, use **PATCH /id**.
     * 
     * This endpoint also supports the **If-Unmodified-Since** header for
     * mid-air-collisoin avoidance.
     * 
     * @remarks
     * For creating new records, this puts you in charge of specifying the 
     * **id**.
     * 
     * @see aysnc patch(request, response): Promise<any>
     * @see aysnc post(request, response): Promise<any>
     * @param request   - Standard
     * @param response  - Standard
     * @returns 200, The updated or newly created object as JSON
     */
    async put(request: Request, response: Response): Promise<Record<string, any>> {
        
        const lastModified: string = request.header(this.IfUnmodifiedSince);

        return this.service.update(+request.params.id, request.body, lastModified)
            .then((results: Record<string, any>) => {
                return response.status(200).json(results);
            });
    }

    /**
     * Updates specific properties of a record, usually on a route like 
     * **PATCH /:id**.
     * 
     * This endpoint also supports the **If-Unmodified-Since** header for
     * mid-air-collisoin avoidance.
     * 
     * @param request   - Standard
     * @param response  - Standard
     * @returns 200, The updated object as JSON
     */
    async patch(request: Request, response: Response): Promise<Record<string, any>> {
        
        const lastModified: string = request.header(this.IfUnmodifiedSince);

        return this.service.edit(+request.params.id, request.body, lastModified)
            .then((result: Record<string, any>) => {
                return response.status(200).json(result);
            });
    }

    /**
     * Creates a new record, usually on a route like **POST**.
     * 
     * @param request   - Standard
     * @param response  - Standard
     * @returns 200, The newly created object as JSON
     */
    async post(request: Request, response: Response): Promise<Record<string, any>> {
        
        return this.service.create(request.body)
            .then((result: Record<string, any>) => {
                return response.status(200).json(result);
            });
    }

    /**
     * Deletes a specific record, usually on a route like **DELETE /:id**.
     * 
     * This endpoint also supports the **If-Unmodified-Since** header for
     * mid-air-collisoin avoidance.
     * 
     * @param request   - Standard
     * @param response  - Standard
     * @returns 200, The deleted object as JSON
     */
    async delete(request: Request, response: Response): Promise<Record<string, any>> {

        const lastModified: string = request.header(this.IfUnmodifiedSince);
        
        return this.service.delete(+request.params.id, lastModified)
            .then((result: Record<string, any>) => {
                return response.status(200).json(result);
            });
    }
}
