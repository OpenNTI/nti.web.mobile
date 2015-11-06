import {
	// GraphQLBoolean,
	// GraphQLFloat,
	// GraphQLID,
	GraphQLInt,
	// GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString
} from 'graphql';

import {
	connectionArgs,
	connectionDefinitions,
	connectionFromArray,
	globalIdField
} from 'graphql-relay';

import GraphQLTimeStamp from '../../common-types/TimeStamp';

import {registerType, nodeInterface} from '../interface';

import {entityType as EntityType} from '../entities';

export const gradebookGradeType = new GraphQLObjectType({
	name: 'gradebookGrade',
	description: 'An assignment Grade',
	fields: () => ({
		id: globalIdField('Grade', x => x && x.getID()),

		value: {
			type: GraphQLString
		},

		letter: {
			type: GraphQLString
		}
	}),
	interfaces: [nodeInterface]
});

export const gradebookByAssignmentRowType = new GraphQLObjectType({
	name: 'gradebookByAssignmentRow',
	description: 'A row item for the gradebook for a given assignment.',
	fields: () => ({
		id: globalIdField('User', x => x.Username),

		user: {
			type: EntityType//,
			// resolve: x => x.User
		},

		username: {
			type: GraphQLString//,
			// resolve: x => x.username
		},

		completed: {
			type: GraphQLTimeStamp//,
			// resolve: x => x.completed ...the field name lines up with the property name.
		},

		grade: {
			type: gradebookGradeType//,
			// resolve: x => x.grade ...the field name lines up with the property name.
		},

		feedbackCount: {
			type: GraphQLInt//,
			// resolve: x => x.feedbackCount
		}
	}),
	interfaces: [nodeInterface]
});

export const {connectionType: gradebookByAssignmentRowConnection} =
	connectionDefinitions({name: 'gradebookByAssignmentRow', nodeType: gradebookByAssignmentRowType});

export const gradebookByAssignmentType = new GraphQLObjectType({
	name: 'gradebookByAssignment',
	description: 'List gradebook for a given assignment.',
	fields: () => ({
		total: {
			type: GraphQLInt,
			resolve: x => x.shell.TotalItemCount
		},
		count: {
			type: GraphQLInt,
			resolve: x => x.shell.ItemCount
		},
		filter: {
			type: GraphQLString//,
			// resolve: x => x.filter
		},
		search: {
			type: GraphQLString//,
			// resolve: x => x.search
		},
		page: {
			type: GraphQLInt//,
			// resolve: x => x.page
		},
		pageSize: {
			type: GraphQLInt//,
			// resolve: x => x.pageSize
		},
		items: {
			type: gradebookByAssignmentRowConnection,
			args: {
				...connectionArgs
			},
			description: 'Self descriptive :P',
			resolve (_, args) {
				return connectionFromArray(_.shell.Items || [], args);
			}
		}
	})
});

export const rootQueries = {

	gradebookByAssignment: {
		type: gradebookByAssignmentType,
		args: {
			id: globalIdField('Assignment'),
			filter: {
				type: new GraphQLNonNull(GraphQLString)
			},
			search: {
				type: GraphQLString
			},
			page: {
				type: GraphQLInt
			},
			pageSize: {
				type: GraphQLInt
			}
		},

		//forward the rootValue down
		resolve: (x, args) => x.service.getParsedObject(args.id)
			.then(o => {
				const {filter, search, page = 0, pageSize = 50} = args;
				const batchStart = (page * pageSize);

				return o.fetchLink('GradeBookByAssignment', { filter, search, batchSize: pageSize, batchStart })
					.then(raw => x.service.getParsedObject(raw)) //when GradeBookByAssignmentSummary has a mimeType this step won't be necessary.
					.then(shell => ({
						search,
						filter,
						shell,
						page,
						pageSize,
						assignment: o
					}));
			})
	}
};


const isByAssignmentType = (obj) => (obj && obj.Class) === 'GradeBookByAssignmentSummary';
const getRow = id => console.log('requested?', id);
// const getEntity = (id, service) => service.resolveEntity(id);

registerType(gradebookByAssignmentType, isByAssignmentType, getRow);
