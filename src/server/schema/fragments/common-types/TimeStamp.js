import { GraphQLScalarType } from 'graphql';
import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';

function coerceDate (value) {
	if (!(value instanceof Date)) {
		throw new Error('Field error: value is not an instance of Date');
	}

	return isNaN(value.getTime()) ? null : value.getTime() / 1000;
}

export default new GraphQLScalarType({
	name: 'TimeStamp',
	serialize: coerceDate,
	parseValue: coerceDate,
	parseLiteral (ast) {
		if (ast.kind !== Kind.FLOAT) {
			throw new GraphQLError('Query error: Can only parse floats to dates but got a: ' + ast.kind, [ast]);
		}
		const result = new Date(ast.value * 1000);
		if (isNaN(result.getTime())) {
			throw new GraphQLError('Query error: Invalid date', [ast]);
		}

		return result;
	}
});
