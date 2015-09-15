import {
	GraphQLBoolean,
	GraphQLObjectType,
	GraphQLSchema
} from 'graphql';

/*
import {
	connectionArgs,
	connectionDefinitions,
	connectionFromArray,
	fromGlobalId,
	globalIdField,
	mutationWithClientMutationId,
	nodeDefinitions,
} from 'graphql-relay';
*/

/*
const {nodeInterface, nodeField} = nodeDefinitions(
	(globalId) => {
		var {type, id} = fromGlobalId(globalId);
		if (type === 'User') {
			return getUser(id);
		} else if (type === 'Widget') {
			return getWidget(id);
		} else {
			return null;
		}
	},
	(obj) => {
		if (obj instanceof User) {
			return userType;
		} else if (obj instanceof Widget) {
			return widgetType;
		} else {
			return null;
		}
	}
);*/

const queryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => ({
		//node: nodeField,
		// Add root fields here

		meh: {
			type: GraphQLBoolean,
			description: 'Dummy Field',
			resolve: () => true
		}
	})
});



export default new GraphQLSchema({
	query: queryType
});
