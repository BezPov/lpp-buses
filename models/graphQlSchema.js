// https://flaviocopes.com/graphql-node-express/

const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');

const BusApi = require('../api/busApi');

const busType = new GraphQLObjectType({
	name: 'Bus',
	fields: {
		busId: {
			type: GraphQLString
		},
		busNumber: {
			type: GraphQLString
		},
		name: {
			type: GraphQLString
		}
	}
});

const queryType = new GraphQLObjectType({
	name: 'Query',
	fields: {
		bus: {
			type: busType,
			args: {
				id: { type: GraphQLString }
			},
			resolve: async (source, { id }) => {
				return await BusApi.findOne({ busId: id });
			}
		},
		buses: {
			type: new GraphQLList(busType),
			resolve: async () => {
				return await BusApi.findMany({});
			}
		}
	}
});

const schema = new GraphQLSchema({
	query: queryType
});

module.exports = schema;