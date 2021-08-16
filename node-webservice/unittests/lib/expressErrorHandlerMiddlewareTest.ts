import 'jasmine';
import request from 'supertest';
import express, { Request, Response } from 'express';
import Router from "express-promise-router";
import expressErrorHandlerMiddleware from '../../src/lib/middleware/expressErrorHandlerMiddleware';
import HttpException from '../../src/lib/errors/HTTPException';


describe("When throwing an HTTPException from a controller", () => {

    it('our router\'s error handling middleware will handle it correctly', async function() {

        const message = "I'm a teapot";

        // Setup Route
        const app = express();
        const router = Router();
        router.get('/', 
            async (request: Request, response: Response)=>{
                throw new HttpException(418, message);
            },
            expressErrorHandlerMiddleware); // Keep at end of chain
        app.use('/example', router);

        // Test
        await request(app)
            .get('/example')
            .expect(418, JSON.stringify(message));
    });
});

describe("When throwing an unknown Error from a controller", () => {

    it('our router\'s error handling middleware will handle it correctly', async function() {

        // Setup Route
        const app = express();
        const router = Router();
        router.get('/', 
            async (request: Request, response: Response)=>{
                return Promise.resolve().then(()=>{
                    throw new Error("Throwing test value");
                });
            },
        expressErrorHandlerMiddleware);
        app.use('/example', router);

        // Test
        await request(app)
            .get('/example')
            .expect(500);
        
        // The Body will contain verbose amounts of html formatted information.
        // If you do not want that, update the error handler.
    });
});
