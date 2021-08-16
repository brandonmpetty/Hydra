import { Router as ExpressRouter } from "express";
import Router from "express-promise-router";
import { param } from 'express-validator';
import ExampleController from '../controllers/ExampleController'
import expressValidatorMiddleware from '../lib/middleware/expressValidatorMiddleware';


/**
 * An example of how to associate your Controller with a promise based router.
 * 
 * @see http://docs.oasis-open.org/odata/odata-openapi/v1.0/odata-openapi-v1.0.html
 */
export default class ExampleRouter {

    readonly routeName = 'example';
    private exampleController: ExampleController;

    constructor(exampleController: ExampleController) {
        this.exampleController = exampleController;
    }

    /**
     * Setup all documented routes for: /example
     *
     * @param exampleController - A controller with all CRUD operations
     * @returns A promise based router with additional endpoints
     */
    create(): ExpressRouter {
        
        const router = Router();

        router.get('/', 
            this.exampleController.root.bind(this.exampleController));

        router.get('/:id', 
            param('id').isNumeric(),
            expressValidatorMiddleware,
            this.exampleController.get.bind(this.exampleController));

        router.put('/:id', 
            param('id').isNumeric(),
            expressValidatorMiddleware,
            this.exampleController.put.bind(this.exampleController));

        router.post('/', 
            expressValidatorMiddleware,
            this.exampleController.post.bind(this.exampleController));

        router.patch('/:id', 
            param('id').isNumeric(),
            expressValidatorMiddleware,
            this.exampleController.patch.bind(this.exampleController));

        router.delete('/:id', 
            param('id').isNumeric(),
            expressValidatorMiddleware,
            this.exampleController.delete.bind(this.exampleController));
        
        return router;
    }
}
