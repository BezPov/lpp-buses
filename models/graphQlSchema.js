const {gql} = require('apollo-server');

const typeDefs = gql`
	type Station {
		stationId: ID!
		referenceId: String
		name: String
	}
	
	type Bus {
		busId: ID!
		busNumber: String
		routeId: Number
		oppositeRouteId: Number
		name: String
		routeLength: Number
		stations: [Station]
	}
	
	type Query {
		getBus(busId: ID!): Bus
	}
`;

module.exports = typeDefs;