import ODataParseError from './errors/ODataParseError';


/**
 * OData2Prisma converts OData query parameters into Prisma specific JSON.
 * It is not a production OData parser, but a stop-gap implementation.
 * 
 * This class has / should have three main purposes:
 * * Determine what types of Prisma functions should be called based on the OData.
 * * Translate the OData query parameters into paramters for those functions.
 * * Return as a response not only the Prisma function parameters but also
 * data transformation information, and handle that transformation.
 * 
 * @privateRemarks Inspiration: https://github.com/Vicnovais/odata-sequelize
 * @privateRemarks .Net is the only framework I have seen with 'real' OData
 * support.  Everyone appears to be dropping REST + OData for GraphQL.
 * 
 * @alpha
 */
export class OData2Prisma
{
    /**
     * Different OData query parameters require different Prisma functions.
     * This method will provide that information.
     * 
     * @param odata - OData query paramters
     * @returns The type of Prisma function to execute
     */
    static queryType(odata: Record<string, string>): QueryTypeEnum {

        let result: QueryTypeEnum = QueryTypeEnum.FINDMANY;

        if (odata) {

            // Support $count
            if ('$count' in odata) {
                result = QueryTypeEnum.COUNT;
            } else 
            // Support $apply=aggregate(...)
            if (odata['$apply']?.startsWith('aggregate(')) {
                result = QueryTypeEnum.AGGREGATE;
            }
            // Support $apply=groupby(...)
            if (odata['$apply']?.startsWith('groupby(')) {
                result = QueryTypeEnum.GROUPBY;
            }
        }

        return result;
    }

    /**
     * Returns parameters for Prisma's .findUnique(...) method.
     * 
     * OData query parameters:
     * * $select
     * * $expand
     * 
     * You cannot use both of these parameters at the same time.
     * 
     * @param id    - The record id used for the **Where** clause
     * @param odata - The OData query parameters
     * @returns The parameter for **prisma.entity.findUnique(...)**.
     * 
     * @beta
     */
    static findUnique(id: number, odata: Record<string, string>): Record<string, any> {

        // Prisma's findUnique forces a unique filter
        const filter: Record<string, any> = {
            where: {
                id: id
            }
        };

        // There is no need for: top, skip, orderby, etc
        if (odata) {

            // Selecting
            this.select(filter, odata);
            this.expand(filter, odata);
        }

        return filter;
    }

    /**
     * Returns parameters for Prisma's .findMany(...) method.
     * 
     * OData query parameters:
     * * $select
     * * $expand
     * * $skip
     * * $take
     * * $orderBy
     * * $filter
     * 
     * @example 
     * Get the second set of 10 user records, ordered by dob:
     * ```
     * users/?$select=firstName,lastName,dob&$skip=10&$take=10&$orderBy=dob asc
     * users/?$select=firstName&$filter=lastName eq 'Smith'
     * ```
     * 
     * @see https://devblogs.microsoft.com/odata/aggregation-extensions-in-odata-asp-net-core/
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/aggregation-grouping-summarizing
     * 
     * @param odata - The OData query parameters
     * @returns The parameter for **prisma.entity.findMany(...)***.
     * 
     * @alpha
     */
    static findMany(odata: Record<string, string>): Record<string, any> {

        // TODO: Support $filter to make this actually useful.
        const filter: Record<string, any> = { };

        if (odata) {

            // Filtering
            this.filter(filter, odata);

            // Selecting
            this.select(filter, odata);
            this.expand(filter, odata);

            // Pagination Support
            this.skip(filter, odata);
            this.top(filter, odata);

            // Sorting
            this.orderBy(filter, odata);
        }

        return filter;
    }

    /**
     * Applys a very limited OData **$apply=aggregate(...)** operation to Prisma.
     * 
     * @remarks
     * This does not currently support 'as'. That would require a transformation 
     * of the result set.
     * 
     * @example
     *      OData: $apply=aggregate($count as OrderCount)
     *      Prisma OData: $apply=aggregate($count)
     * 
     * @example
     *      OData: $apply=aggregate(Amount with sum as Total)
     *      Prisma OData: $apply=aggregate(Amount with sum)
     *      OData WITH Options: sum, min, max, average
     * 
     * @example
     *      OData: $apply=aggregate(Amount with sum as DailyAverage from Time with average)
     *      Prisma OData: not supported
     * 
     * @see http://docs.oasis-open.org/odata/odata-data-aggregation-ext/v4.0/cs01/odata-data-aggregation-ext-v4.0-cs01.html#_Toc378326289
     * 
     * @param odata - An OData parameter set containing **$apply=aggregate(...)**
     * @returns A JSON object with aggregate data based on OData
     * 
     * @alpha
     */
     static aggregate(odata: Record<string, string>): Record<string, any> {

        const filter: Record<string, any> = {};
        const data: string = odata['$apply'];

        // We only support aggregate
        if (data && !data.startsWith('aggregate('))
            throw new ODataParseError('$apply can only execute the aggregate function at this time');

        // Capture the data between the parens.
        const value: string = data.match(/\((.*)\)/)?.pop();
        if (value) {

            // Allow for multiple aggs: $apply=aggregate(Price with min, Price with max)
            const parts: Array<string> = value.split(',').map((item: string) => item.trim()) as Array<string>;
            for (const part of parts) {

                const tokens: Array<string> = part.split(' ');

                // Because of the dicey way we are parsing this
                // we are only supporting a few known patterns.
                if (tokens.length === 1 && tokens[0] === '$count') {
                    filter._count = true;
                } else 
                if (tokens.length === 3 && tokens[1] == 'with') {

                    let aggOp = '';
                    switch(tokens[2]) {
                        case 'sum':
                            aggOp = '_sum';
                            break;
                        case 'min':
                            aggOp = '_min';
                            break;
                        case 'max':
                            aggOp = '_max';
                            break;
                        case 'average':
                            aggOp = '_avg'
                            break;
                    }

                    if (!aggOp)
                        throw new ODataParseError('Unsupported aggregation operator', aggOp);
                    
                    const objPath = `${aggOp}/${tokens[0]}`;
                    this.ToRelationalObject(objPath, true, filter);
                }
            } // For all aggrefation parts

            // Apply Filtering
            this.filter(filter, odata);
        } // If we can capture the data between the parens

        if (!Object.keys(filter).length)
            throw new ODataParseError('Error parsing $apply=aggregate(...)')

        return filter;
    }


    // https://github.com/prisma/prisma/issues/8744
    // WorkItems?$filter=Count ge 100$apply=groupby((WorkItemType), aggregate($count as Count))&&$orderby=Count&top=5


    static filter(filter: Record<string, any>, odata: Record<string, string>): Record<string, any> {

        const data = odata['$filter'];

        if (data) {

            // We cannot support anything fancy right now
            // TODO: Map OData startswith, endswith and contains to Prisma's startsWith, endsWith, contains
            if (data.includes('('))
                throw new ODataParseError('$filter cannot contain parenthesis');
            
            filter.where = {};

            let whereSection = filter.where;

            // Only support all AND or all OR, not mix
            const containsAnd = data.includes(' and ');
            const containsOr = data.includes(' or ');
            if (containsAnd && containsOr)
                throw new ODataParseError('$filter cannot mix AND and OR logic at this time')

            let logicDelimiter = '('; // A character that will never appear
            if (containsAnd) {
                logicDelimiter = ' and ';
                filter.where['AND'] = {};
                whereSection = filter.where.AND;
            } else
            if (containsOr) {
                logicDelimiter = ' or ';
                filter.where['OR'] = {};
                whereSection = filter.where.OR;
            }

            for (const exp of data.split(logicDelimiter)) {
                const parts: Array<string> = exp.split(' ');

                if (parts.length < 3)
                    throw new ODataParseError('Invalid $filter');

                let logicOp = ''
                switch(parts[1]) {
                    case 'eq':
                        logicOp = 'equals'
                        break;
                    case 'ne':
                        logicOp = 'not'
                        break;
                    case 'gt':
                        logicOp = 'gt';
                        break;
                    case 'lt':
                        logicOp = 'lt';
                        break;
                    case 'ge':
                        logicOp = 'gte';
                        break;
                    case 'le':
                        logicOp = 'lte';
                        break;
                }

                if (!logicOp)
                    throw new ODataParseError('Unsupported logical operation', logicOp);

                /* eslint-disable */
                const value = exp.includes("'") ? data.match(/\'(.*)\'/)?.pop() : Number(parts[2]);
                if (value === undefined || value === null)
                    throw new ODataParseError('Unable to parse quoted value in $filter');

                /* eslint-disable no-eval */
                if (value === NaN)
                    throw new ODataParseError('Non-numeric $filter values must be wrapped in single quotes', parts[2]);

                const objPath = `${parts[0]}/${logicOp}`;
                this.ToRelationalObject(objPath, value, whereSection);

            } // For all logical expressions in filter
        }

        return filter;
    }

    protected static select(filter: Record<string, any>, odata: Record<string, string>): void {
        
        const data: string = odata['$select'];

        if (data) {

            // We cannot support anything fancy right now
            if (data.includes('('))
                throw new ODataParseError('$select cannot contain parenthesis');

            // Do not allow $select and $expand at the same time
            if ('include' in filter)
                throw new ODataParseError('$select and $include cannot be used at the same time');

            filter.select = {};

            for (const col of data.split(',').map((item: string) => item.trim()) as Array<string>) {

                // Parse out OData relationships for Prisma
                // Example: Location/City => { Location: { City: true } }
                this.ToRelationalObject(col, true, filter.select, 'select');
            }
        }
    }

    protected static expand(filter: Record<string, any>, odata: Record<string, any>): void {

        const data: string = odata['$expand'];

        if (data) {

            // We cannot support anything fancy right now
            if (data.includes('('))
                throw new ODataParseError('$select cannot contain parenthesis');

            // Do not allow $select and $expand at the same time
            if ('select' in filter) 
                throw new ODataParseError('$select and $include cannot be used at the same time');

            filter.include = {};

            for (const col of data.split(',').map((item: string) => item.trim()) as Array<string>) {

                // Parse out OData relationships for Prisma
                // Example: Store/Location => { Store: { Location: true } }
                this.ToRelationalObject(col, true, filter.include, 'include');
            }
        }
    }

    protected static skip(filter: Record<string, any>, odata: Record<string, string>): void {
        const data: string = odata['$skip'];

        if (data) {

            // Ensure no bad data
            const skip = Number(data);
            if (isNaN(skip)) throw new ODataParseError('$skip must be numeric', data);

            filter.skip = skip;
        }
    }

    protected static top(filter: Record<string, any>, odata: Record<string, string>): void {

        const data: string = odata['$top'];

        if (data) {

            // Ensure no bad data
            const take = Number(data);
            if (isNaN(take)) throw new ODataParseError('$top must be numeric', data);

            filter.take = take;
        }
    }

    protected static orderBy(filter: Record<string, any>, odata: Record<string, string>): void {

        const data: string = odata['$orderby'];

        if (data) {

            filter.orderBy = {};

            for (const col of data.split(',').map((item: string) => item.trim()) as Array<string>) {
                const order: Array<string> = col.split(' ');
                if (order.length !== 2)
                    throw new ODataParseError('Invalid $orderby format')
    
                // Try to ensure we aren't injecting garbage
                const direction = order[1].toLowerCase();
                if (!(direction === 'asc' || direction == 'desc'))
                    throw new ODataParseError("$orderby requires 'asc' or 'desc' parameters", direction);
    
                // Inject the property with support for nested relationships
                this.ToRelationalObject(order[0], direction, filter.orderBy);
            }
        }
    }

    protected static isSafeKeyName(value: string): boolean {
        return /^[a-zA-Z0-9-_]+$/.test(value);
    }

    protected static ToRelationalObject(
        path: string, value: (boolean | number | string), parent: Record<string, any>, action?: string): void {

        let builder = parent;

        const selectPathParts = path.split('/');
        const pathLength = selectPathParts.length - 1;
        
        for (let i = 0; i < pathLength; i++) {

            const pathName = selectPathParts[i];
            if (!this.isSafeKeyName(pathName)) throw new ODataParseError('Unsafe name', pathName);

            builder = builder[pathName] ??= {};

            if (action) {
                builder = builder[action] ??= {};
            }
        }

        const colName = selectPathParts[pathLength];
        if (!this.isSafeKeyName(colName)) throw new ODataParseError('Unsafe name', colName);
        builder[colName] = value;
    }
}

/**
 * Enums that are used to denote which Prisma functions to use based on OData
 * query parameters.
 */
export enum QueryTypeEnum {
    FINDMANY,
    AGGREGATE,
    GROUPBY,
    COUNT
}
