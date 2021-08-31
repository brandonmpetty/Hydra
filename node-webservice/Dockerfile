# A multi-stage build pipeline resulting in a production docker image

# Typescript Build Environment
FROM node:16-bullseye-slim as node-build
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build


# Setup a Staging Environment that will mirror Production
FROM node:16-bullseye-slim as node-staging
WORKDIR /usr/app
# Install only Production modules
COPY --from=node-build /usr/app/package*.json ./
RUN npm install --only=production
RUN mkdir logs
# Copy our Production build
COPY --from=node-build /usr/app/dist/index.js ./
# Copy over the generated Prisma client w/o binary generator
RUN rm -rf ./node_modules/.prisma/client
COPY --from=node-build /usr/app/node_modules/.prisma/client ./node_modules/.prisma/client


# Final Production Image
# For testing use: nodejs-debian10:debug
# Access the shell via: docker run --entrypoint=sh -ti hydra/node-webservice
FROM gcr.io/distroless/nodejs-debian10
WORKDIR /usr/app
COPY --from=node-staging /usr/app ./
COPY --from=node-staging /lib/x86_64-linux-gnu/libz.so.1 /lib/x86_64-linux-gnu/libz.so.1
USER 1000
CMD ["index.js"]