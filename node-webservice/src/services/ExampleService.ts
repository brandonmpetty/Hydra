import { PrismaClient } from '@prisma/client';
import CRUDService from '../lib/crud/CRUDService';
import { OData2Prisma, QueryTypeEnum } from '../lib/OData2Prisma';
import ExampleServiceInterface from './ExampleServiceInterface';

/**
 * ExampleService extends our CRUD operations by adding **root** processing.
 * This implementation adds additional OData capabilities.
 * It acts as an example for how to extend CRUDService with additional
 * functionality while minimizing boilerplate code.
 */
export default class ExampleService extends CRUDService implements ExampleServiceInterface {

    constructor(prisma: PrismaClient){
        super(prisma.sales); // Pass in the specific Prisma Delegate
    }

    /**
     * Reads all records, usually on a route like **GET /**.
     * It supports the following OData query parameters:
     * * $select - Returns an array of results
     * * $extend
     * * $skip
     * * $take
     * * $orderBy
     * * $filter
     * * $count - Returns a numeric result count
     * * $apply=aggregate(...) - Returns an aggregated object
     * 
     * Not all of these can be used at the same time.  This routine will
     * analyze the OData query parameters to infer the correct response.
     * 
     * Unsupported or malformed OData will throw an **HTTPException**.
     * 
     * @example
     * Getting the result count:
     * ```ts
     * // From query param: /user?$count
     * {
     *     "$count": ""
     * }
     * ```
     * 
     * @param odata - Optional OData.  See comments.
     * @returns Array, Object, or Number depending on OData
     */
    async root(odata: Record<string, string>): Promise<Array<Record<string, any>> | Record<string, any> | number> {

        const type: QueryTypeEnum = OData2Prisma.queryType(odata);

        switch(type)
        {
            case QueryTypeEnum.AGGREGATE: {

                const aggArgs = OData2Prisma.aggregate(odata);
                return this.entity.aggregate(aggArgs);
            }

            case QueryTypeEnum.COUNT: {

                const countArg = OData2Prisma.filter({}, odata);
                return this.entity.count(countArg);
            }

            default: {

                const findManyArg = OData2Prisma.findMany(odata);
                return this.entity.findMany(findManyArg);
            }
        }
    }
}
