# Technology Overview
To build this system, a wide variety of technologies are being used. Below are a list of key technologies, but many critical complementary plugins were also used.  See the [package.json](package.json) for full details.

## Current
### Build
[Webpack](https://webpack.js.org/guides/typescript) in conjunction with [ts-node](https://github.com/TypeStrong/ts-node#readme) is used to compile all Typescript files into a single .js file for production.  For development, [ts-node-dev](https://github.com/wclr/ts-node-dev#readme) is used to quickly rebuild the running project whenever a file changes.
### Database
[Prisma](https://www.prisma.io/docs) is a powerful ORM technology used for database abstration, data modeling, and migration.  It allows cleaner, safer, database related code.  This demo leverages a local [SQLite](https://www.prisma.io/docs/concepts/database-connectors/sqlite) database, but can be easilly switch out for Postgres, MySql, etc.
### OData
[OData](https://www.odata.org) allows the client to express more freely what kinds of data it wants from a REST server, and how that data is to be transformed.  It can greatly reduce the number of endpoints one may need to expose.  A *very* limited implemenation was created as part of this project.
### OpenAPI
An [openpai.yml](openapi.yml) file is provided.  You could use [swagger-jsdoc-webpack-plugin](https://github.com/patsimm/swagger-jsdoc-webpack-plugin#readme) to build it from your tsdoc router comments instead.  This can be used to automatically build clients that can access your API.
### Logging
[Winston](https://github.com/winstonjs/winston#readme) is a popular plugin-based logging framework.  This project logs all human readable logs to console, while piping all JSON-based error logs to disk.
### Security
[Helmet](https://helmetjs.github.io) is a standard Express focussed security package providing out of the box best practices.
### Testing
[Jasmine](https://jasmine.github.io) is an easy to use *behavior-driven development* testing framework.  Mocking is being managed by [moq.ts](https://github.com/dvabuzyarov/moq.ts#readme) while controller testing is made possible by [SuperTest](https://github.com/visionmedia/supertest). Code coverage reporting is built in using [nyc](https://istanbul.js.org).
### Code Quality
[ESLint](https://eslint.org) is a Typescript friendly *static code analysis* tool which provides valuable feedback during the development cycle.
### Documentation
[TSDoc](https://tsdoc.org) is used throughout the codebase for IDE level api documentation.  [TypeDoc](https://typedoc.org) uses those same documenation comments to generate easy to follow API documentation for the development team.
<hr/>
<br/>

## Production Considerations
In order to put use this template in production, the following considerations should be made.

### OData
The OData implementation in this project is very limited and is not ready for production.  It should either be removed, replaced, or enhanced.

### Scaling and Loadbalancing
There are different levels from which you can scale this service.  At the most fundamental you can write it into the service itself using [Node Cluster](https://nodejs.org/api/cluster.html).  A more professionally managed solution may involve using [PM2](https://pm2.io) instead.  There are also options using [NGINX](https://docs.nginx.com/nginx/deployment-guides/load-balance-third-party/node-js) as a load balancer.  If placed in a container you could use [Docker](https://www.docker.com) and [Kubernetes](https://kubernetes.io).  You could then take it into the cloud on [Azure](https://azure.microsoft.com/en-us/develop/nodejs), or any other qualified cloud platform.

### API Versioning
API can be a tricky subject.  It effects your core architecural design as well as documentation.  For small projects, building it in direction with a technology like [express-routes-versioning](https://github.com/Prasanna-sr/express-routes-versioning#readme) could be possible.  Creating different versioned webservice instances and managing them through a Gateway may be better for larger projects.

### Security
Currently, this implementation does not restrict access to any endpoint.  Putting in place a Roles / ACL security layer on each Route may be necessary.  You may also want to implement an OAuth / OpenID Connect 'Code' validation endpoint for secure session generation.  You should also perform a full security audit of your API to ensure it is not susceptible to attack.

### Caching
All session permission information should be stored in a cache, preferably something like [Redis](https://redis.io).  This will allow for quick permission checking on each endpoint without incurring a costly database hit.  You could then use that same Redis system for result caching.  Placing a Web Server, like NGINX, infront of your App Server could also provide out of the box cache and compression support.

