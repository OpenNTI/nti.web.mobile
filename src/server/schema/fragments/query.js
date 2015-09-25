import { GraphQLObjectType } from 'graphql';
import {rootQueries as entitieQueries} from './entities';
import {nodeField} from './interface';

export default new GraphQLObjectType({
	name: 'Query',
	fields: () =>
		Object.assign(
			{node: nodeField},
			entitieQueries
			)
});
