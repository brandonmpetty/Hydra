import { Express } from 'express';

// Dependancies
import prisma from '../lib/prisma';
import ExampleService from '../services/ExampleService';
import ExampleController from '../controllers/ExampleController';
import ExampleRouter from './ExampleRouter';

// Singleton instances
const exampleService = new ExampleService(prisma);
const exampleController = new ExampleController(exampleService);


/**
 * Load the routes for each resource into our Express app instance.
 * 
 * @param app - Express app instance
 */
export default function routeLoader(app: Express): void {

    const exampleRouter = new ExampleRouter(exampleController);
    app.use(`/api/${exampleRouter.routeName}`, exampleRouter.create());
    // TODO: Add other routes here
}
