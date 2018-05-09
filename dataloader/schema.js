import {
  GraphQLSchema,
  GraphQLObjectType,
	GraphQLString,
	GraphQLList,
} from 'graphql';

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

const getPersonByID = (id) => {
  return fetch(`${BASE_URL}/person/${id}`)
    .then(res => res.json())
    .then(json => json);
}

const PersonType = new GraphQLObjectType({
	name: 'Person',
	description: '...',

	fields: () => ({
		firstName: {
			type: GraphQLString,
			resolve: (person) => person.firstName || person.first_name,
		},
		lastName: {
			type: GraphQLString,
			resolve: (person) => person.lastName || person.last_name,
		},
		email: { type: GraphQLString },
		username: { type: GraphQLString },
		id: { type: GraphQLString },
		friends: { 
			type: new GraphQLList(PersonType),
			resolve: (person) => person.friends.map(getPersonByID)
		},
	})
});

const QueryType = new GraphQLObjectType({
	name: 'Query',
	description: '...',

	fields: () => ({
		person: {
			type: PersonType,
			args: {
				id: { type: GraphQLString }
			},

			resolve: (root, args) => getPersonByID(args.id)
		}
	})
});

export default new GraphQLSchema({
    query: QueryType,
});