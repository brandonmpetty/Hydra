import 'jasmine';
import request from 'supertest';
import express, { Request, Response } from 'express';
import Router from "express-promise-router";
import { param } from 'express-validator';
import expressValidatorMiddleware from '../../src/lib/middleware/expressValidatorMiddleware';
import expressErrorHandlerMiddleware from '../../src/lib/middleware/expressErrorHandlerMiddleware';


describe("When using our router validation middleware", async () => {

    const app = express();

    beforeAll(function() {

        // Setup Route with param(...) check
        const router = Router();

        router.get('/:id', 
            param('id').isNumeric(),
            expressValidatorMiddleware,
            async (request: Request, response: Response)=>{
                response.sendStatus(200);
            },
            expressErrorHandlerMiddleware);

        app.use('/example', router);
    });

    it('will let correct parameters go through', async function() {

        await request(app)
            .get('/example/1')
            .expect(200);
    });

    it('will block incorrect parameters from reaching the controller', async function() {

        await request(app)
            .get('/example/test')
            .expect(422);
    });
});
