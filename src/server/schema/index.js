import {
	// GraphQLBoolean,
	// GraphQLFloat,
	// GraphQLID,
	// GraphQLInt,
	// GraphQLList,
	// GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString
} from 'graphql';

import {
	// connectionArgs,
	// connectionDefinitions,
	// connectionFromArray,
	fromGlobalId,
	globalIdField,
	// mutationWithClientMutationId,
	nodeDefinitions,
} from 'graphql-relay';

// Import methods that your schema can use to interact with your database
// import {} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
let {nodeInterface, nodeField} = nodeDefinitions(
	(globalId) => {
		let {type, id} = fromGlobalId(globalId);
		console.log(type, id);
		return null;
	},
	(obj) => {
		console.log(obj);
		return null;
	}
);

/**
 * Define your own types here
 */

let entityType = new GraphQLObjectType({
	name: 'Entity',
	description: 'A person who uses our app',
	fields: () => ({
		id: globalIdField('User'),
		displayName: { type: GraphQLString },
		displayType: { type: GraphQLString },
		initials: { type: GraphQLString },
		avatar: { type: GraphQLString }
	}),
	interfaces: [nodeInterface]
});


/**
 * Define your own connection types here
 */
// let {connectionType: widgetConnection} =
// 	connectionDefinitions({name: 'Widget', nodeType: widgetType});



/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
let queryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		node: nodeField,
		// Add your own root fields here

		user: {
			type: entityType,
			args: {
				id: globalIdField('Entity')
			},
			resolve: (_, args) => {
				let {request: context} = _;
				return context.ntiService.resolveEntity(args.id);
			}
		}
	})
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 *//*
let mutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		// Add your own mutations here
	})
});
*/

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export let Schema = new GraphQLSchema({
	query: queryType
	// Uncomment the following after adding some mutation fields:
	// mutation: mutationType
});
