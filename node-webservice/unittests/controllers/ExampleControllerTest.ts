import 'jasmine';
import request from 'supertest';
import express from 'express';
import Router from "express-promise-router";
import { Mock, It } from 'moq.ts';

import ExampleController from "../../src/controllers/ExampleController"
import ExampleServiceInterface from '../../src/services/ExampleServiceInterface';


describe("Calling GET /example with a Service Mock", () => {

    it('will respond with a 200 and correct result set', async function() {

        // Mock
        const mockData = [
            {
                firstName: 'Test',
                lastName: 'User',
                dob: '07/14/2021'
            }
        ];

        const exampleServiceMock = new Mock<ExampleServiceInterface>()
            .setup(instance => instance.root(It.IsAny()))
            .returns(Promise.resolve(mockData))
            .object();

        // Setup Route
        const app = express();
        const router = Router();
        const controller = new ExampleController(exampleServiceMock);
        router.get('/', controller.root.bind(controller));
        app.use('/example', router);

        // Test
        await request(app)
            .get('/example')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, mockData);
    });
});
