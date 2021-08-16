import 'jasmine';
import { OData2Prisma } from '../../src/lib/OData2Prisma';
import { parse } from 'querystring';


describe("Given an OData $select query to OData2Prisma.findUnique(...)", () => {

    it("will be able to select the specified values in Prisma", () => {

        const odata = 
            parse("$select=Foo,Bar/Har") as Record<string, string>;

        const result = OData2Prisma.findUnique(1, odata);

        expect(result).toBeDefined();
        expect(result.where.id).toEqual(1);
        expect(result.select.Foo).toBeTrue();
        expect(result.select.Bar.select.Har).toBeTrue();
    });
});

describe("Given an OData $expand query to OData2Prisma.findUnique(...)", () => {

    it("will be able to expand the specified columns in Prisma", () => {

        const odata = 
            parse("$top=5&$skip=1&$expand=Foo,Bar/Har") as Record<string, string>;

        const result = OData2Prisma.findUnique(1, odata);

        expect(result).toBeDefined();
        expect(result.where.id).toEqual(1);
        expect(result.include.Foo).toBeTrue();
        expect(result.include.Bar.include.Har).toBeTrue();
    });
});

describe("Given unsupported OData for OData2Prisma.findUnique(...)", () => {

    it("will cause the method to fail cleanly", () => {

        const odata = 
            parse("$top=5&$skip=1&$orderby=A desc") as Record<string, string>;

        const result = OData2Prisma.findUnique(1, odata);

        // Ensure unsupported flags are ignored.
        // Future: This may need to fail in order to ensure the correct intent.
        expect(result).toBeDefined();
        expect(result.where.id).toEqual(1);
    });
});

describe("Given a pagination OData query to OData2Prisma.findMany(...)", () => {

    it("will be able to generate the correct Prisma filter", () => {

        const param = "$top=5&$skip=1&$expand=Foo,Bar/Har&$filter=A ge 7 and B eq 'Test This'&$orderby=A desc, B/C asc";
        const odata = parse(param) as Record<string, string>;

        const result = OData2Prisma.findMany(odata);

        expect(result).toBeDefined();
        expect(result.include.Foo).toBeTrue();
        expect(result.include.Bar.include.Har).toBeTrue();
        expect(result.where.AND.A.gte).toBe(7);
        expect(result.where.AND.B.equals).toBe('Test This');
        expect(result.skip).toBe(1);
        expect(result.take).toBe(5);
        expect(result.orderBy).toBeDefined();
        expect(result.orderBy.A).toBe('desc');
        expect(result.orderBy.B.C).toBe('asc');
    });
});

describe("Given aggregation OData query to OData2Prisma.aggregate(...)", () => {

    it("will be able to generate the correct Prisma filter", () => {

        const odata = 
            parse("$apply=aggregate(A/Z with average, B with max, C with max, $count)") as Record<string, string>;

        const result = OData2Prisma.aggregate(odata);

        expect(result).toBeDefined();
        expect(result._avg.A.Z).toBeTrue();
        expect(result._max.B).toBeTrue();
        expect(result._max.C).toBeTrue();
        expect(result._count).toBeTrue();
        expect(result._min).toBeUndefined();
    });
});
