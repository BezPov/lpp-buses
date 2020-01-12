const logger = require('../services/logging');

const graphqlHTTP = require('express-graphql');

const graphQLSchema = require('../models/graphQlSchema');

const initRoutes = function (server) {
    server.post(
        '/graphql',
        graphqlHTTP({
            schema: graphQLSchema,
            graphiql: false,
        }),
    );

    server.get(
        '/graphql',
        graphqlHTTP({
            schema: graphQLSchema,
            graphiql: true,
        }),
    );
};

module.exports = initRoutes;