import 'jasmine';
import ExampleService from '../../src/services/ExampleService';
import { PrismaClient, PrismaPromise, Prisma, Sales } from '@prisma/client';
import { Mock, It, Times } from 'moq.ts';


describe("When calling ExampleService.root(...) ", () => {

    it("will by default return a list of results", async () => {

        const mockData = [ new Mock<Sales>().object() ];

        const mock = new Mock<PrismaClient>()
            .setup(instance => instance.sales.findMany(It.IsAny()))
            .returns(Promise.resolve(mockData) as PrismaPromise<Sales[]>);

        const exampleService = new ExampleService(mock.object());

        const odata: Record<string, string> = { }
        const result: any = await exampleService.root(odata);

        mock.verify(instance => instance.sales.findMany(It.IsAny()), Times.Once());
        expect(result.length).toBe(1);
    });

    it("will by return a modified list of results with OData query params: $top and $skip", async () => {

        const mockData = [ new Mock<Sales>().object() ];

        const mock = new Mock<PrismaClient>()
            .setup(instance => instance.sales.findMany(It.IsAny()))
            .returns(Promise.resolve(mockData) as PrismaPromise<Sales[]>);

        const exampleService = new ExampleService(mock.object());

        const odata: Record<string, string> = { $top: '10', $skip: '5' }
        const result: any = await exampleService.root(odata);

        mock.verify(instance => instance.sales.findMany(
            It.Is(param => 
                param['take'] === 10 &&
                param['skip'] === 5
            )),
            Times.Once());

        expect(result.length).toBe(1);
    });

    it("will return the count if it finds an OData $count query parameter", async () => {

        const mock = new Mock<PrismaClient>()
            .setup(instance => instance.sales.count(It.IsAny()))
            .returns(Promise.resolve(1) as PrismaPromise<number>);

        const exampleService = new ExampleService(mock.object());

        const odata: Record<string, string> = { $count: 'true' };
        const result: any = await exampleService.root(odata);

        expect(typeof result).toBe('number');
        mock.verify(instance => instance.sales.count(It.IsAny()), Times.Once());
        expect(result).toBe(1);
    });

    it("will return statistics if it finds an OData $apply=aggregate(...) query parameter", async () => {

        const mockAggregateData = new Mock<Prisma.GetSalesAggregateType<Prisma.SalesAggregateArgs>>()
            .object();

        const mock = new Mock<PrismaClient>()
            .setup(instance => instance.sales.aggregate(It.IsAny()))
            .returns(Promise.resolve(mockAggregateData) as 
                PrismaPromise<Prisma.GetSalesAggregateType<Prisma.SalesAggregateArgs>>);

        const exampleService = new ExampleService(mock.object());

        const odata: Record<string, string> = { 
            $apply: 'aggregate(Amount with sum, Amount with min, Amount with average)' 
        };
        const result: any = await exampleService.root(odata);

        mock.verify(instance => instance.sales.aggregate(
            It.Is(param => 
                param['_avg'].Amount === true &&
                param['_sum'].Amount === true &&
                param['_min'].Amount === true &&
                param.hasOwnProperty('_max') === false &&
                param.hasOwnProperty('_count') === false
            )),
            Times.Once());

        expect(result).toBeTruthy();
    });

    it("will throw an exception when passed bad OData", async () => {

        const mockAggregateData = new Mock<Prisma.GetSalesAggregateType<Prisma.SalesAggregateArgs>>()
            .object();

        const mock = new Mock<PrismaClient>()
            .setup(instance => instance.sales.aggregate(It.IsAny()))
            .returns(Promise.resolve(mockAggregateData) as 
                PrismaPromise<Prisma.GetSalesAggregateType<Prisma.SalesAggregateArgs>>);

        const exampleService = new ExampleService(mock.object());

        const odata: Record<string, string> = { 
            $apply: 'aggregate(Amount with stdev as StandardDeviation)' 
        };

        await expectAsync(exampleService.root(odata)).toBeRejected();
    });
});
