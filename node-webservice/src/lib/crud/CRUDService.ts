import HttpException from '../errors/HTTPException';
import CRUDServiceInterface from './CRUDServiceInterface';
import { OData2Prisma } from '../OData2Prisma';
import { PrismaDelegate } from '../types/PrismaDelegate';


/**
 * CRUDService performs all CRUD operations, for a <u>specific</u>
 * record, through the Prisma ORM.  It also provides limited OData
 * support on **read**.
 * 
 * @remarks
 * Due to the nature of this class, most strong typing is lost.
 * 
 * @remarks
 * **If-Unmodified-Since** is not currently supported.<br/>
 * Prisma Issue: https://github.com/prisma/prisma/issues/8580
 * 
 * @beta
 */
export default class CRUDService implements CRUDServiceInterface {

    protected entity: PrismaDelegate;

    constructor(entity: PrismaDelegate){

        this.entity = entity;
    }

    /**
     * Selects and returns the specific record from the datastore.
     * <u>Limited</u> OData support for:
     * * $select
     * * $expand
     * 
     * @example
     * Filtering through only the desired properties:
     * ```ts
     * // From query param: /user?$select=firstName,lastName
     * {
     *     "$select": "firstName,lastName"
     * }
     * ```
     * 
      @example
     * Expanding properties with foreign relationships:
     * ```ts
     * // From query param: /user?$expand=permissions
     * {
     *     "$expand": "permissions"
     * }
     * ```
     * 
     * @remarks
     * You cannot use **$select** and **$expand** at the same time.
     * 
     * Unsupported or malformed OData will throw an **HTTPException**.
     * @see OData2Prisma.findUnique(...) for more details.
     * 
     * @param id    - Record id
     * @param odata - Optional OData.  See comments.
     * @returns The specific object as JSON
     * @beta
     */
    async read(id: number, odata: Record<string, string>): Promise<Record<string, any>> {

        const filter = OData2Prisma.findUnique(id, odata);
        return this.entity.findUnique(filter);
    }

    /**
     * Upserts a record in the datastore.
     * If the record exists, it will be updated.  If not, it will be created.
     * 
     * If **lastModified** is provided, an **HTTPException** will be thrown if
     * the record was updated since that time.  This helps avoid mid-air-collisions.
     * 
     * @param id            - Record id
     * @param data          - A record model, without the **id** property
     * @param lastModified  - Optional **Last-Modified** date string
     * @returns The updated or newly created object as JSON
     */
    async update(id: number, data: Record<string, any>, lastModified: string): Promise<Record<string, any>> {

        // TODO: Implement!  See Prisma Issue comment above.
        if (lastModified) {
            throw new HttpException(412, 'Not supported: If-Unmodified-Since');
        }

        return this.entity.upsert({
            where: {
                id: id,
            },
            update: data,
            create: data
        });
    }

    /**
     * Edits an existing record in the datastore.
     * Only the properties that are passed will be updated, along with any column
     * flagged with \@updatedAt.
     * 
     * If **lastModified** is provided, an **HTTPException** will be thrown if
     * the record was updated since that time.  This helps avoid mid-air-collisions.
     * 
     * @param id            - Record id
     * @param data          - A record model containly only what you want updated
     * @param lastModified  - Optional **Last-Modified** date string
     * @returns The updated object as JSON
     */
    async edit(id: number, data: Record<string, any>, lastModified: string): Promise<Record<string, any>> {
        
        // TODO: Implement!  See Prisma Issue comment above.
        if (lastModified) {
            throw new HttpException(412, 'Not supported: If-Unmodified-Since');
        }

        return this.entity.update({
            where: {
                id: id
            },
            data: data
        });
    }

    /**
     * Adds the specific record to your datastore.
     * 
     * @param data - The record model you want inserted into the database
     * @returns The object you created as JSON
     */
    async create(data: Record<string, any>): Promise<Record<string, any>> {
        
        return this.entity.create({
            data: data,
        });
    }

    /**
     * Deletes the specific record from the datastore.
     * 
     * @param id            - Record id
     * @param lastModified  - Optional **Last-Modified** date string
     * @returns The deleted record as JOSN
     */
    async delete(id: number, lastModified: string): Promise<Record<string, any>> {

        // TODO: Implement!  See Prisma Issue comment above.
        if (lastModified) {
            throw new HttpException(412, 'Not supported: If-Unmodified-Since');
        }

        return this.entity.delete({
            where: {
                id: id
            }
        })
    }
}