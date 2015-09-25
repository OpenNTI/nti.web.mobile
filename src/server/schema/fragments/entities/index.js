import {
	// GraphQLBoolean,
	// GraphQLFloat,
	// GraphQLID,
	// GraphQLInt,
	// GraphQLList,
	// GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString
} from 'graphql';

import {
	connectionArgs,
	connectionDefinitions,
	connectionFromArray,
	globalIdField
} from 'graphql-relay';


import {registerType, nodeInterface} from '../interface';

export const entityType = new GraphQLObjectType({
	name: 'Entity',
	description: 'Entity in the system (User-like)',
	fields: () => ({
		id: globalIdField('User'),
		displayName: { type: GraphQLString },
		displayType: { type: GraphQLString },
		initials: { type: GraphQLString },
		avatar: { type: GraphQLString }
	}),
	interfaces: [nodeInterface]
});

export const {connectionType: entityConnection} = connectionDefinitions({name: 'Entity', nodeType: entityType});

export const entitySearchType = new GraphQLObjectType({
	name: 'EntitySearch',
	description: 'List entities that match',
	fields: () => ({
		items: {
			type: entityConnection,
			args: {
				...connectionArgs,
				search: {
					type: GraphQLString
				}
			},
			// type: new GraphQLList(entityType),
			description: 'Entity results',
			resolve: (_, args) =>{
				return _.service.getContacts().search(args.search, true)
					.then(x => connectionFromArray(x, args));
			}
		}
	})
});

export const rootQueries = {
	user: {
		type: entityType,
		args: {
			id: globalIdField('Entity')
		},
		resolve: (_, args) =>
			_.service.resolveEntity(args.id)
	},


	entitySearch: {
		type: entitySearchType,
		resolve: x => x //forward the rootValue down
	}
};


const isEntity = (obj) => 'displayName' in obj && 'avatar' in obj;
const getEntity = (id, service) => service.resolveEntity(id);

registerType(entityType, isEntity, getEntity);
// registerType(entitySearchType);
