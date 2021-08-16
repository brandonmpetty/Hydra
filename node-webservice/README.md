# NodeJS Webservice Demo
A lightweight RESTful web service template, written in TypeScript, based on NodeJS - Express that exposes a Data Mart with OData.  The Prisma ORM is used for database abstraction and management.

<br/>

## Quick Start
### Installation
Installing packages and building the ORM client:
```
npm install
npx prisma migrate dev --name init
```
### Server
Start a **development** instance with a .ts file watcher:
```
npm run dev
```
### Client
Query a webservice resource:
```
curl http://localhost:3000/api/example?$take=10
```
<hr>
<br/>


## Build and Management Systems
### Prisma
The [Prisma](https://www.prisma.io/docs) ORM framework is beyond the scope of this documentation.  Its CLI takes the schema, located in the /prisma folder, and generates both client code and the actual database itself.

To initialize the database and generate the ORM code used by this project, first run:
```
npx prisma migrate dev --name init
```
After making subsequent schema changes you will need to regenerate the client using the following command:
```
npx prisma generate
```
To seed the database with sample data, run:
```
node prisma/seed.js
```
**Note:** This should be possible with Prisma: https://www.prisma.io/docs/guides/database/seed-database

### NPM
NPM provides the following *run* commands for building and managing the project:
* `npm run build` - Production build written to [/dist/index.js](dist/index.js)
* `npm run start` - Runs the production build through Node
* `npm run dev` - Runs a development build through **ts-node-dev**
* `npm run test` - Run all unit tests
* `npm run test-coverage` - Run all unit tests with code coverage written to [/coverage](coverage/lcov-report/index.html)
* `npm run lint` - Perform static code analysis with eslint
* `npm run doc` - Generate API documentation in [/docs](docs/index.html)

### Visual Studio Code
This project was developed using VSC and contains the [launch.json](.vscode/launch.json) and [settings.json](.vscode/settings.json) files required to build and test the codebase.  Ensure you have the **Jasmine Test Explorer** installed.
<hr/>
<br/>

## Technology Overview

This project uses a wide assortment of technologies. For a more detailed overview see the [Technology](TECHNOLOGY.md) readme.  For a fully documented API overview, generate the API documentation as detailed above.